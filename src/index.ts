import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";

const app = new Hono();

const appRoutes = app.basePath("/api").route("/genres", genresRoute);

export type AppType = typeof appRoutes;

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
