import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerRoutes } from "../server/routes";
import type { AddressInfo } from "node:net";
test("server starts without provider keys and retires cloud AI routes", async () => {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const health = await fetch(base + "/api/health");
    assert.deepEqual(await health.json(), { status: "ok", mode: "local-only" });
    const retired = await fetch(base + "/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    assert.equal(retired.status, 410);
    assert.match((await retired.json()).error, /retired/);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    );
  }
});
