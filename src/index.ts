import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";

const app = new Hono();

app.basePath("/api").route("/genres", genresRoute);

serve(
  {
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
