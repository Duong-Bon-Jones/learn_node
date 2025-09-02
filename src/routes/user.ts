import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userInsertSchema } from "../db/schema/userSchema.js";
import { db } from "../db/index.js";
import { users as usersTable } from "../db/schema/userSchema.js";
import { eq } from "drizzle-orm";
import { pick } from "lodash-es";
import bcrypt from "bcrypt";

const usersRoute = new Hono().post(
  "/",
  zValidator("json", userInsertSchema),
  async (c) => {
    const validated = c.req.valid("json");

    const existingUser = await db.query.users.findFirst({
      where: eq(usersTable.email, validated.email),
    });

    if (existingUser) {
      c.status(400);
      return c.json({ message: "Error: User already exists" });
    }

    const saltedPassword = await bcrypt.hash(validated.password, 10);

    const result = await db
      .insert(usersTable)
      .values({ ...validated, password: saltedPassword })
      .returning()
      .then((res) => res[0]);
    c.status(201);

    return c.json({ user: pick(result, ["id", "name", "email"]) });
  }
);

export default usersRoute;
