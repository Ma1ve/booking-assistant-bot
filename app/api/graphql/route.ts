import { createContext, GraphQLContext } from "@/lib/prisma";
import { createYoga, createSchema } from "graphql-yoga";

import { getFormatTime } from "@/components/shared/lib/getFormatTime";
import { GraphQLError } from "graphql";

const schema = createSchema<GraphQLContext>({
  typeDefs: `
    type User {
      id: ID!
      firstName: String!
      lastName:  String!
      startTime: String!
      endTime:   String!
      address:   String!
      telegram:  String!
      schedules: [DayScheduleUser!]!
    }
    
    type DaySchedule {
      id: ID!
      date: String!  
      users: [DayScheduleUser!]!
      userCount: Int!
    }

    type DayScheduleUser {
      userId: ID!
      dayScheduleId: ID!
      user: User!
      daySchedule: DaySchedule!
    }

    type UserWithTotalScheduleRecords {
      id: ID!
      firstName: String!
      lastName:  String!
      startTime: String!
      endTime:   String!
      address:   String!
      telegram:  String!
  
      totalScheduleRecords: String!
      pastScheduleRecords: String!
    }

    type Query {
      usersByDay(date: String!): [User!]!

      todayClosestSchedule: UserWithTotalScheduleRecords 
    }
  
  type Mutation {
    updateSchedule(
      userId: Int!
      input: UserInput!
    ): User!

    createSchedule(
      scheduleId: Int! 
      input: UserInput!
    ): User!

    deleteScheduleById(
      userId: Int!   
    ): User
  }

  input UserInput {
    firstName: String!
    lastName:  String!
    startTime: String!
    endTime:   String!
    address:   String!
    telegram:  String!
    date: String!
  }

  `,
  resolvers: {
    Query: {
      usersByDay: async (_parent, { date }, ctx) => {
        try {
          const day = await ctx.prisma.daySchedule.findFirst({
            where: { date: new Date(date) },
            include: {
              users: {
                include: { user: true },
              },
            },
          });

          const users =
            day?.users
              .map((dsu) => dsu.user)
              .sort((a, b) => {
                const aTime = a.startTime.getHours() * 60 + a.startTime.getMinutes();
                const bTime = b.startTime.getHours() * 60 + b.startTime.getMinutes();
                return aTime - bTime;
              }) ?? [];

          return users;
        } catch (error) {
          console.error("usersByDay error:", error);
          throw new Error("Failed to load users by day");
        }
      },
      todayClosestSchedule: async (_parent, _args, ctx) => {
        try {
          const now = new Date();

          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);

          const todaySchedule = await ctx.prisma.daySchedule.findFirst({
            where: {
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            include: {
              users: {
                include: { user: true },
                orderBy: { user: { startTime: "asc" } },
              },
            },
          });
          if (!todaySchedule) return null;

          const users = todaySchedule.users.map((dsu) => dsu.user);

          const totalScheduleRecords = users.length;

          const pastScheduleRecords = users.filter((u) => u.endTime < now).length;

          const current =
            users.find((u) => now >= u.startTime && now <= u.endTime) ??
            users.find((u) => u.startTime > now) ??
            null;

          if (!current) return null;

          return {
            ...current,
            totalScheduleRecords: String(totalScheduleRecords),
            pastScheduleRecords: String(pastScheduleRecords),
          };
        } catch (error) {
          console.error("usersByDay error:", error);
          throw new Error("Failed to load users by day");
        }
      },
    },

    User: {
      startTime: (parent) => getFormatTime(parent.startTime),
      endTime: (parent) => getFormatTime(parent.endTime),
      telegram: (parent) => (parent.telegram ? `@${parent.telegram}` : null),
    },

    UserWithTotalScheduleRecords: {
      startTime: (parent) => getFormatTime(parent.startTime),
      endTime: (parent) => getFormatTime(parent.endTime),
    },

    Mutation: {
      createSchedule: async (_parent, { scheduleId, input }, ctx) => {
        try {
          const { startTime, endTime } = parseAndValidateTime(
            input.startTime,
            input.endTime,
            input.date
          );

          const conflict = await ctx.prisma.dayScheduleUser.findFirst({
            where: {
              dayScheduleId: scheduleId,
              user: {
                startTime: { lt: endTime },
                endTime: { gt: startTime },
              },
            },
          });

          if (conflict) {
            throw new GraphQLError("Данное время уже занято другой записью", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }

          const user = await ctx.prisma.user.create({
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              telegram: input.telegram,
              startTime,
              endTime,
              address: input.address,
            },
          });

          if (input.telegram) {
            await ctx.prisma.telegramAccount.updateMany({
              where: { username: input.telegram },
              data: { userId: user.id },
            });
          }

          await ctx.prisma.dayScheduleUser.create({
            data: {
              userId: user.id,
              dayScheduleId: scheduleId,
            },
          });

          return user;
        } catch (error) {
          console.error("createSchedule error:", error);

          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError("Ошибка при обновлении записи", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
      updateSchedule: async (_parent, { userId, scheduleId, input }, ctx) => {
        try {
          const { startTime, endTime } = parseAndValidateTime(
            input.startTime,
            input.endTime,
            input.date
          );

          const conflict = await ctx.prisma.dayScheduleUser.findFirst({
            where: {
              dayScheduleId: scheduleId,
              NOT: {
                userId: userId,
              },
              user: {
                startTime: { lt: endTime },
                endTime: { gt: startTime },
              },
            },
          });

          if (conflict) {
            throw new GraphQLError("Данное время уже занято другой записью", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }

          const updatedUser = await ctx.prisma.user.update({
            where: { id: userId },
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              telegram: input.telegram,
              startTime,
              endTime,
              address: input.address,
            },
          });

          if (input.telegram) {
            await ctx.prisma.telegramAccount.updateMany({
              where: { username: input.telegram },
              data: { userId: userId },
            });
          }

          return updatedUser;
        } catch (error) {
          console.error("updateSchedule error:", error);

          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError("Ошибка при обновлении записи", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
      deleteScheduleById: async (_parent, { userId }, ctx) => {
        try {
          await ctx.prisma.dayScheduleUser.deleteMany({
            where: { userId },
          });

          const deletedUser = await ctx.prisma.user.delete({
            where: { id: userId },
          });

          return deletedUser;
        } catch (error) {
          console.error("deleteScheduleById error:", error);

          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError("Ошибка при обновлении записи", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    },
  },
});

function parseAndValidateTime(start: string, end: string, date: string) {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const now = new Date();

  const startTime = new Date(date);
  startTime.setHours(startHours, startMinutes, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHours, endMinutes, 0, 0);

  if (startTime <= now) {
    throw new GraphQLError("Нельзя установить приём на уже прошедшее время", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (endTime <= startTime) {
    throw new GraphQLError("Время окончания должно быть позже времени начала", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return { startTime, endTime };
}

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/",
  context: createContext,
  maskedErrors: false,
});

export { yoga as GET, yoga as POST };
