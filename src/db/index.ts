import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as genreSchema from "./schema/genreSchema.js";
import * as userSchema from "./schema/userSchema.js";

import { config } from "dotenv";
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({
  client: sql,
  schema: { ...genreSchema, ...userSchema },
});
