import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userAuthSchema } from "../db/schema/userSchema.js";
import { db } from "../db/index.js";
import { users as usersTable } from "../db/schema/userSchema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createJWT } from "../utils.js";

const authRoute = new Hono().post(
  "/",
  zValidator("json", userAuthSchema),
  async (c) => {
    const validated = c.req.valid("json");

    const existingUser = await db.query.users.findFirst({
      where: eq(usersTable.email, validated.email),
    });

    if (!existingUser) {
      return c.json({ message: "Error: Wrong email/password" }, 401);
    }

    const isPasswordMatch = await bcrypt.compare(
      validated.password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return c.json({ message: "Error: Wrong email/password" }, 401);
    }

    const accessToken = await createJWT({
      id: existingUser.id,
      role: existingUser.role,
    });

    return c.json({
      message: "Authenticated successfully",
      accessToken,
    });
  }
);

export default authRoute;
