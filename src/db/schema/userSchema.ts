import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("email").on(table.email)]
);

export type User = typeof users.$inferSelect;

export const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.max(200).min(3),
}).omit({ id: true, created_at: true, updated_at: true });

export type CreateUser = z.infer<typeof userInsertSchema>;
