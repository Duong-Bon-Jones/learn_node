import { serve } from "@hono/node-server";
import { Hono } from "hono";
import genresRoute from "./routes/genres.js";
import usersRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import { logger } from "hono/logger";
import { captureErrorWithPostHog } from "./utils.js";
import type { GlobalHono } from "./types.js";

// Init app
const app = new Hono<GlobalHono>().onError((err, c) => {
  captureErrorWithPostHog(err, c);

  return c.text("Internal server error", 500);
});

// Global error handlings
process.on("uncaughtException", (err) => {
  captureErrorWithPostHog(err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  captureErrorWithPostHog(
    new Error("We got unhandled rejection", { cause: reason })
  );
  process.exit(1);
});

// Routes
app
  .basePath("/api")
  .use(logger())
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
