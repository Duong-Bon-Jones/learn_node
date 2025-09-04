import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "./index.js";
import { jwt, type JwtVariables } from "hono/jwt";
import type { AppJWTPayload } from "./utils.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  const { JWT_PRIVATE_KEY } = env<AppEnv>(c);

  const jwtMiddleware = jwt({
    secret: JWT_PRIVATE_KEY,
  });

  return jwtMiddleware(c, next);
});

export const adminMiddleware = createMiddleware<{
  Variables: JwtVariables<AppJWTPayload>;
}>(async (c, next) => {
  const { role } = c.get("jwtPayload");

  if (role !== "admin") {
    return c.text("Access denied", 403);
  }

  await next();
});
