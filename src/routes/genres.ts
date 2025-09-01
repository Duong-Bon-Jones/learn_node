import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const genresSchema = z.object({
  body: z.string(),
});

const fakeGenres = [
  {
    id: 1,
    name: "React",
  },
];

const genresRoute = new Hono()
  .get("/", (c) => {
    return c.json(fakeGenres);
  })
  .get("/:id", (c) => {
    const id = c.req.param("id");

    const sortQuery = c.req.query("sort");

    const foundCourse = fakeGenres.find((c) => c.id === Number(id));

    if (!foundCourse) {
      return c.notFound();
    }

    return c.json({ ...foundCourse, sort: sortQuery });
  })
  .post("/", zValidator("json", genresSchema), async (c) => {
    const body = await c.req.json();
  });

export default genresRoute;
