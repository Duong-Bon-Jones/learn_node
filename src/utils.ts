import { sign } from "hono/jwt";
import type { ErrorHandler } from "hono/types";
import { env } from "hono/adapter";
import { winstonLogger } from "./logger.js";
import { PostHog } from "posthog-node";
import type { AppEnv, AppJWTPayload, GlobalHono } from "./types.js";

export const createJWT = async (payload: AppJWTPayload) => {
  return await sign(payload, process.env.JWT_PRIVATE_KEY!);
};

export const onAppError: ErrorHandler<GlobalHono> = (err, c) => {
  winstonLogger.error("Internal server error", err);

  const { POSTHOG_PUBLIC_KEY } = env<AppEnv>(c);
  const { id } = c.get("jwtPayload");
  const posthog = new PostHog(POSTHOG_PUBLIC_KEY, {
    host: "https://us.i.posthog.com",
  });

  posthog.captureException(
    new Error(err.message, { cause: err }),
    id?.toString(),
    {
      path: c.req.path,
      method: c.req.method,
      url: c.req.url,
      headers: c.req.header(),
    }
  );
  posthog.shutdown();

  return c.text("Internal server error", 500);
};
