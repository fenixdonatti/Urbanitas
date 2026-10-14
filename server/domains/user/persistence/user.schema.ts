import { pgTable, varchar } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../../shared/persistence/primitives";

export const users = pgTable("users", {
    id: primaryId(),
    name: varchar("name", {length: 100}).notNull(),
    email: varchar("email", {length: 100}).notNull(),
    ...timestamps
})