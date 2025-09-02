import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";
import usersRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";

const app = new Hono();

const appRoutes = app
  .basePath("/api")
  .route("/genres", genresRoute)
  .route("/users", usersRoute)
  .route("/auth", authRoute);
export type AppType = typeof appRoutes;

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
