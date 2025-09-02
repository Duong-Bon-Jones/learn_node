import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod";

export const genres = pgTable(
  "genres",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("name_idx").on(table.name)]
);

export type Genre = typeof genres.$inferSelect;

export const genreInsertSchema = createInsertSchema(genres, {
  name: (schema) => schema.max(200).min(3),
}).omit({ id: true, created_at: true, updated_at: true });

export type CreateGenre = z.infer<typeof genreInsertSchema>;
