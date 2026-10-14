import { varchar } from "drizzle-orm/pg-core";

export const primaryId = (name: string = "id", length: number = 36,) => varchar(name, { length }).primaryKey();