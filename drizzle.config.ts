import type { Config } from "drizzle-kit";

export default {
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "postgresql",

  schemaFilter: ["public"],

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;