import { sign } from "hono/jwt";
import type { HTTPResponseError } from "hono/types";
import { PostHog } from "posthog-node";
import type { AppJWTPayload, GlobalHono } from "./types.js";
import type { Context } from "hono";

export const createJWT = async (payload: AppJWTPayload) => {
  return await sign(payload, process.env.JWT_PRIVATE_KEY!);
};

export const captureErrorWithPostHog = (
  err: Error | HTTPResponseError,
  c?: Context<GlobalHono, any, {}>
) => {
  if (!process.env.POSTHOG_PUBLIC_KEY) {
    return;
  }

  const posthog = new PostHog(process.env.POSTHOG_PUBLIC_KEY, {
    host: "https://us.i.posthog.com",
  });

  if (c) {
    const { id } = c.get("jwtPayload");

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
  } else {
    posthog.captureException(new Error(err.message, { cause: err }));
  }

  posthog.shutdown();
};
