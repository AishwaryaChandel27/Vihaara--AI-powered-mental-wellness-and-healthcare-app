import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
test("production offline shell serves cached navigation and excludes API requests", async (t) => {
  if (!existsSync("dist/public/sw.js")) {
    t.skip("Run npm run build first");
    return;
  }
  const handlers: Record<string, Function> = {};
  const deleted: string[] = [];
  let installed: string[] = [];
  const cached = new Response("<html>offline</html>");
  const self = {
    location: { origin: "https://vihaara.test" },
    clients: { claim: async () => {} },
    addEventListener: (name: string, fn: Function) => {
      handlers[name] = fn;
    },
  };
  vm.runInNewContext(readFileSync("dist/public/sw.js", "utf8"), {
    self,
    URL,
    fetch: () => {
      throw Error("Unexpected network request");
    },
    caches: {
      open: async () => ({
        addAll: async (paths: string[]) => {
          installed = paths;
        },
        match: async () => cached,
      }),
      keys: async () => ["vihaara-shell-old", "unrelated-cache"],
      delete: async (key: string) => {
        deleted.push(key);
      },
    },
  });
  let pending: Promise<unknown> = Promise.resolve();
  handlers.install({
    waitUntil: (p: Promise<unknown>) => {
      pending = p;
    },
  });
  await pending;
  assert.ok(installed.includes("/index.html"));
  assert.ok(installed.some((p) => p.endsWith(".js")));
  assert.equal(
    installed.some((p) => p.includes("/api/")),
    false,
  );
  for (const asset of installed)
    assert.ok(existsSync("dist/public" + asset), asset);
  handlers.activate({
    waitUntil: (p: Promise<unknown>) => {
      pending = p;
    },
  });
  await pending;
  assert.deepEqual(deleted, ["vihaara-shell-old"]);
  let response: Promise<Response> | undefined;
  handlers.fetch({
    request: {
      url: "https://vihaara.test/journal",
      method: "GET",
      mode: "navigate",
    },
    respondWith: (p: Promise<Response>) => {
      response = p;
    },
  });
  assert.equal(await (await response)?.text(), "<html>offline</html>");
  let intercepted = false;
  for (const url of [
    "https://vihaara.test/api/ai/chat",
    "https://huggingface.co/model",
  ])
    handlers.fetch({
      request: { url, method: "GET" },
      respondWith: () => {
        intercepted = true;
      },
    });
  assert.equal(intercepted, false);
});
