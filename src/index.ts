import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";
import usersRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import { logger } from "hono/logger";
import { onAppError } from "./utils.js";
import type { GlobalHono } from "./types.js";

const app = new Hono<GlobalHono>().use(logger()).onError(onAppError);

export const appRoutes = app
  .basePath("/api")
  .route("/genres", genresRoute)
  .route("/users", usersRoute)
  .route("/auth", authRoute);

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
