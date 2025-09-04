import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";
import usersRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import { logger } from "hono/logger";

const app = new Hono();

const appRoutes = app
  .basePath("/api")
  .use(logger())
  .route("/genres", genresRoute)
  .route("/users", usersRoute)
  .route("/auth", authRoute);
export type AppType = typeof appRoutes;

export type AppEnv = {
  DATABASE_URL: string;
  JWT_PRIVATE_KEY: string;
};

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
