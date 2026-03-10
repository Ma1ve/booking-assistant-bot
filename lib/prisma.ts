import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { isDev } from "./env";

const adapter = isDev
  ? new PrismaPg({ connectionString: process.env.DATABASE_URL_LOCAL! })
  : new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

export const prisma = new PrismaClient({ adapter });

// Для взаимодействия с graphgl yoga
export type GraphQLContext = {
  prisma: PrismaClient;
};

export async function createContext(): Promise<GraphQLContext> {
  return { prisma };
}
