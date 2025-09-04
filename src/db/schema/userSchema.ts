import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type z from "zod";

export const roleEnum = pgEnum("role", ["admin"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
    role: roleEnum(),
  },
  (table) => [index("email").on(table.email)]
);

const userSelectSchema = createSelectSchema(users).omit({ password: true });

export type User = z.infer<typeof userSelectSchema>;

export const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.max(255).min(3),
  email: (schema) => schema.max(255),
  password: (schema) => schema.max(255).min(5),
}).omit({ id: true, created_at: true, updated_at: true });

export const userAuthSchema = userInsertSchema.omit({ name: true });

export type CreateUser = z.infer<typeof userInsertSchema>;
