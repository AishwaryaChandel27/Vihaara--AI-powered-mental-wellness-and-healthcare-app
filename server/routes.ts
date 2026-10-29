import type { Express } from "express";
import { createServer } from "http";
// Wellness processing now runs in the browser. The server only serves the app.
export async function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", mode: "local-only" }),
  );
  app.use("/api/ai", (_req, res) =>
    res
      .status(410)
      .json({
        error:
          "Cloud AI endpoints have been retired. Reload Vihaara to use on-device processing.",
      }),
  );
  return createServer(app);
}
