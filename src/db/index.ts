import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { config } from "dotenv";
config({ path: ".env" });

import * as genreSchema from "./schema/genreSchema.js";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema: { ...genreSchema } });
