import { test } from "node:test";
import assert from "node:assert/strict";
import { readRecords } from "../client/src/lib/device-storage";
const data = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: { getItem: (key: string) => data.get(key) ?? null },
});
const valid = (v: unknown): v is string => typeof v === "string";
test("missing data starts empty", () =>
  assert.deepEqual(readRecords("empty", valid), []));
test("valid legacy records are preserved", () => {
  data.set("legacy", '["a","b"]');
  assert.deepEqual(readRecords("legacy", valid), ["a", "b"]);
});
test("corrupt data is not silently replaced by an empty array", () => {
  data.set("corrupt", "bad json");
  assert.throws(() => readRecords("corrupt", valid));
  assert.equal(data.get("corrupt"), "bad json");
});
test("invalid record shapes are rejected without mutation", () => {
  data.set("shape", '[{"bad":1}]');
  assert.throws(() => readRecords("shape", valid));
  assert.equal(data.get("shape"), '[{"bad":1}]');
});
