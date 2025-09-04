import { sign } from "hono/jwt";
import type { User } from "./db/schema/userSchema.js";
import type { JWTPayload } from "hono/utils/jwt/types";

export type AppJWTPayload = JWTPayload & Pick<User, "id" | "role">;

export const createJWT = async (payload: AppJWTPayload) => {
  return await sign(payload, process.env.JWT_PRIVATE_KEY!);
};
