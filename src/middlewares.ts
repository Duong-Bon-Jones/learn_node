import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import type { AppEnv, GlobalHono } from "./types.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  const { JWT_PRIVATE_KEY } = env<AppEnv>(c);

  const jwtMiddleware = jwt({
    secret: JWT_PRIVATE_KEY,
  });

  return jwtMiddleware(c, next);
});

export const adminMiddleware = createMiddleware<GlobalHono>(async (c, next) => {
  const { role } = c.get("jwtPayload");

  if (role !== "admin") {
    return c.text("Access denied", 403);
  }

  await next();
});
