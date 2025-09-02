import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

const appRoutes = app.basePath("/api").route("/genres", genresRoute);

export type AppType = typeof appRoutes;

app.get("*", serveStatic({ root: "./client/.output/public" }));
app.get("*", serveStatic({ path: "./client/.output/public/_shell.html" }));

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
