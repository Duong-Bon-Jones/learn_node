import type { JWTPayload } from "hono/utils/jwt/types";
import type { User } from "./db/schema/userSchema.js";
import type { JwtVariables } from "hono/jwt";

export type AppEnv = {
  DATABASE_URL: string;
  JWT_PRIVATE_KEY: string;
  POSTHOG_PUBLIC_KEY: string;
};

export type AppJWTPayload = JWTPayload & Pick<User, "id" | "role">;

export type GlobalHono = { Variables: JwtVariables<AppJWTPayload> };
