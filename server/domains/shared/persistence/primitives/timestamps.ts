import { timestamp as pgTimestamp } from "drizzle-orm/pg-core";

export const timestamp = (name: string) =>
  pgTimestamp(name).notNull();

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};