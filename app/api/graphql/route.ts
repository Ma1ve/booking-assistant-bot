import { GraphQLError } from "graphql";
import { createYoga, createSchema } from "graphql-yoga";
import { DateTime } from "luxon";

import { createContext, GraphQLContext } from "@/lib/prisma";

import { getFormatTime } from "@/components/shared/lib/getFormatTime";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

const schema = createSchema<GraphQLContext>({
  typeDefs: `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    date: String!
    startTime: String!
    endTime: String!
    address: String!
    person: Person
    telegram: String
  }

  type Person {
    id: ID!
    telegram: TelegramAccount
    users: [User!]!
  }

  type TelegramAccount {
    id: ID!
    chatId: String!
    username: String
  }

  type UserWithTotalScheduleRecords {
    id: ID!
    firstName: String!
    lastName: String!
    startTime: String!
    endTime: String!
    address: String!
    person: Person
    telegram: String

    totalScheduleRecords: String!
    pastScheduleRecords: String!
  }

  type Query {
    usersByDay(date: String!): [User!]!
    todayClosestSchedule: UserWithTotalScheduleRecords
    getAllUserSchedules(chatId: String!): [User!]!
  }

  type Mutation {
    updateSchedule(
      userId: Int!
      input: UserInput!
    ): User!

    createSchedule(
      input: UserInput!
    ): User!

    deleteScheduleById(
      userId: Int!
    ): User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    startTime: String!
    endTime: String!
    address: String!
    telegram: String
    date: String!
  }
`,
  resolvers: {
    Query: {
      getAllUserSchedules: async (_parent, { chatId }, ctx) => {
        try {
          const now = DateTime.now().setZone(TIME_ZONE);
          const nowJSDate = now.toJSDate();
          const startOfToday = now.startOf("day").toJSDate();
          const endOfToday = now.endOf("day").toJSDate();
          const endOfMonth = now.endOf("month").toJSDate();

          return await ctx.prisma.user.findMany({
            where: {
              person: {
                telegram: {
                  is: { chatId: String(chatId) },
                },
              },
              OR: [
                {
                  date: { gt: endOfToday, lte: endOfMonth },
                },
                {
                  date: { gte: startOfToday, lte: endOfToday },
                  endTime: { gt: nowJSDate },
                },
              ],
            },
            include: {
              person: { include: { telegram: true } },
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
          });
        } catch (error) {
          console.error("getAllUserSchedules error:", error);
          throw new Error("Failed to load user schedules");
        }
      },

      usersByDay: async (_parent, { date }, ctx) => {
        const startDate = DateTime.fromISO(date).setZone(TIME_ZONE).startOf("day").toJSDate();
        const endDate = DateTime.fromISO(date).setZone(TIME_ZONE).endOf("day").toJSDate();

        try {
          return await ctx.prisma.user.findMany({
            where: {
              date: { gte: startDate, lte: endDate },
            },
            include: {
              person: { include: { telegram: true } },
            },
            orderBy: { startTime: "asc" },
          });
        } catch (error) {
          console.error("usersByDay error:", error);
          throw new Error("Failed to load users by day");
        }
      },

      todayClosestSchedule: async (_parent, _args, ctx) => {
        try {
          const now = DateTime.now().setZone(TIME_ZONE);
          const nowJSDate = now.toJSDate();
          const startOfDay = now.startOf("day").toJSDate();
          const endOfDay = now.endOf("day").toJSDate();

          const users = await ctx.prisma.user.findMany({
            where: {
              date: { gte: startOfDay, lte: endOfDay },
            },
            orderBy: { startTime: "asc" },
          });

          if (users.length === 0) return null;

          const totalScheduleRecords = users.length;
          const pastScheduleRecords = users.filter((u) => u.endTime < nowJSDate).length;

          const current =
            users.find((u) => nowJSDate >= u.startTime && nowJSDate <= u.endTime) ??
            users.find((u) => u.startTime > nowJSDate) ??
            null;

          if (!current) return null;

          return {
            ...current,
            totalScheduleRecords: String(totalScheduleRecords),
            pastScheduleRecords: String(pastScheduleRecords),
          };
        } catch (error) {
          console.error("todayClosestSchedule error:", error);
          throw new Error("Failed to load today schedule");
        }
      },
    },

    User: {
      date: (parent) =>
        DateTime.fromJSDate(parent.date).setZone(TIME_ZONE).startOf("day").toISO()!,
      startTime: (parent) => getFormatTime(parent.startTime),
      endTime: (parent) => getFormatTime(parent.endTime),

      telegram: (parent) => {
        const username = parent.person?.telegram?.username;
        return username ? `@${username}` : null;
      },
    },

    UserWithTotalScheduleRecords: {
      startTime: (parent) => getFormatTime(parent.startTime),
      endTime: (parent) => getFormatTime(parent.endTime),
    },

    Mutation: {
      createSchedule: async (_parent, { input }, ctx) => {
        try {
          const { startTime, endTime, date } = parseAndValidateTime(
            input.startTime,
            input.endTime,
            input.date
          );

          const conflict = await ctx.prisma.user.findFirst({
            where: {
              date,
              startTime: { lt: endTime },
              endTime: { gt: startTime },
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
              date,
              startTime,
              endTime,
              address: input.address,
            },
          });

          if (input.telegram) {
            let telegramAccount = await ctx.prisma.telegramAccount.findFirst({
              where: { username: input.telegram },
            });

            let personId: number | null = null;

            if (telegramAccount) {
              if (!telegramAccount.personId) {
                const person = await ctx.prisma.person.create({});
                personId = person.id;

                await ctx.prisma.telegramAccount.update({
                  where: { id: telegramAccount.id },
                  data: { personId },
                });
              } else {
                personId = telegramAccount.personId;
              }
            } else {
              const person = await ctx.prisma.person.create({ data: {} });
              personId = person.id;

              telegramAccount = await ctx.prisma.telegramAccount.create({
                data: {
                  username: input.telegram,
                  personId,
                },
              });
            }

            await ctx.prisma.user.update({
              where: { id: user.id },
              data: { personId },
            });
          }

          return user;
        } catch (error) {
          console.error("createSchedule error:", error);

          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError("Ошибка при создании записи", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },

      updateSchedule: async (_parent, { userId, input }, ctx) => {
        try {
          const { startTime, endTime, date } = parseAndValidateTime(
            input.startTime,
            input.endTime,
            input.date
          );

          const conflict = await ctx.prisma.user.findFirst({
            where: {
              date,
              NOT: { id: userId },
              startTime: { lt: endTime },
              endTime: { gt: startTime },
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
              startTime,
              endTime,
              address: input.address,
            },
          });

          if (input.telegram) {
            let telegramAccount = await ctx.prisma.telegramAccount.findFirst({
              where: { username: input.telegram },
            });

            let personId: number | null = null;

            if (telegramAccount) {
              if (!telegramAccount.personId) {
                const person = await ctx.prisma.person.create({});
                personId = person.id;

                await ctx.prisma.telegramAccount.update({
                  where: { id: telegramAccount.id },
                  data: { personId },
                });
              } else {
                personId = telegramAccount.personId;
              }
            } else {
              const person = await ctx.prisma.person.create({});
              personId = person.id;

              telegramAccount = await ctx.prisma.telegramAccount.create({
                data: {
                  username: input.telegram,
                  personId,
                },
              });
            }

            await ctx.prisma.user.update({
              where: { id: userId },
              data: { personId },
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
          return await ctx.prisma.user.delete({
            where: { id: userId },
          });
        } catch (error) {
          console.error("deleteScheduleById error:", error);

          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError("Ошибка при удалении записи", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    },
  },
});

function parseAndValidateTime(start: string, end: string, date: string) {
  const baseDate = DateTime.fromISO(date).setZone(TIME_ZONE);

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTime = baseDate.set({
    hour: startHours,
    minute: startMinutes,
    second: 0,
    millisecond: 0,
  });

  const endTime = baseDate.set({
    hour: endHours,
    minute: endMinutes,
    second: 0,
    millisecond: 0,
  });

  const now = DateTime.now().setZone(TIME_ZONE);

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

  return {
    date: baseDate.startOf("day").toJSDate(),
    startTime: startTime.toJSDate(),
    endTime: endTime.toJSDate(),
  };
}

const yoga = createYoga({
  schema,
  context: createContext,
  maskedErrors: false,
});

export { yoga as GET, yoga as POST };
