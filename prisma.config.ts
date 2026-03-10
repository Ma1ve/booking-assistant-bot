import "dotenv/config";
import { defineConfig } from "prisma/config";
import { isDev } from "./lib/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isDev ? process.env["DATABASE_URL_LOCAL"] : process.env["DATABASE_URL"],
  },
});
