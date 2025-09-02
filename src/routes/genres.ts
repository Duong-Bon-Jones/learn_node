import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { genreInsertSchema } from "../db/schema/genreSchema.js";
import { db } from "../db/index.js";
import { genres as genresTable } from "../db/schema/genreSchema.js";
import { eq } from "drizzle-orm";

const genresRoute = new Hono()
  .get("/", async (c) => {
    const result = await db.query.genres.findMany({
      orderBy: (genres, { desc }) => [desc(genres.created_at)],
    });

    const sortQuery = c.req.query("sort");

    return c.json({ genres: result });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const foundGenre = await db.query.genres.findFirst({
      where: eq(genresTable.id, Number(id)),
    });

    if (!foundGenre) {
      return c.notFound();
    }

    return c.json({ genre: foundGenre });
  })
  .post("/", zValidator("json", genreInsertSchema), async (c) => {
    const validated = c.req.valid("json");

    const result = await db.insert(genresTable).values(validated).returning();
    c.status(201);

    return c.json({ genres: result });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    const deletedGenre = await db
      .delete(genresTable)
      .where(eq(genresTable.id, Number(id)))
      .returning()
      .then((res) => res[0]);

    if (!deletedGenre) {
      return c.notFound();
    }

    return c.text("Deleted successfully");
  })
  .put("/:id", zValidator("json", genreInsertSchema), async (c) => {
    const validated = c.req.valid("json");

    const id = c.req.param("id");

    const updatedGenre = await db
      .update(genresTable)
      .set(validated)
      .where(eq(genresTable.id, Number(id)))
      .returning()
      .then((res) => res[0]);

    if (!updatedGenre) {
      return c.notFound();
    }

    return c.json({ genre: updatedGenre });
  });

export default genresRoute;
