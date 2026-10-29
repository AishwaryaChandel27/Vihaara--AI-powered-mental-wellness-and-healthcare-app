import { test } from "node:test";
import assert from "node:assert/strict";
import {
  guidedReply,
  journalReflection,
  moodSummary,
  needsUrgentSupport,
  urgentMessage,
} from "../client/src/lib/wellness";
const message = (content: string) => [
  {
    id: "test",
    role: "user" as const,
    content,
    timestamp: "2026-10-29T08:00:00Z",
  },
];
test("urgent language bypasses ordinary reflection", () => {
  for (const text of [
    "I want to die",
    "I might hurt myself",
    "I took an overdose",
    "I want to kill someone",
    "I don't want to live",
    "I am suicidal",
  ]) {
    assert.equal(needsUrgentSupport(text), true, text);
    assert.equal(guidedReply(message(text)), urgentMessage);
    assert.equal(journalReflection(text).insights, urgentMessage);
  }
});
test("ordinary daily stress receives a relevant non-medical prompt", () => {
  assert.equal(needsUrgentSupport("My work deadline is stressful"), false);
  assert.match(
    guidedReply(message("My work deadline is stressful")),
    /small thing you can influence/,
  );
  assert.match(guidedReply(message("I feel lonely")), /someone you trust/);
});
test("medication and diagnosis queries are referred to a professional", () => {
  assert.match(
    guidedReply(message("What medication dose should I take?")),
    /cannot diagnose/,
  );
});
test("unmatched input honestly identifies the prepared guide", () => {
  assert.match(
    guidedReply(message("Can we talk about my day?")),
    /offline guide/,
  );
});
test("journal tags reflect words without asserting a diagnosis", () => {
  assert.deepEqual(journalReflection("I feel grateful and proud").tags, [
    "appreciation",
  ]);
  assert.deepEqual(journalReflection("An ordinary day").tags, ["reflection"]);
  assert.match(journalReflection("I am tired").insights, /not an assessment/);
});
test("mood summaries use actual data, ties, and no fabricated trend", () => {
  assert.match(moodSummary([]), /No moods/);
  const entries = [
    { id: "1", date: "2026-10-28", mood: "happy" as const, context: null },
    { id: "2", date: "2026-10-29", mood: "sad" as const, context: null },
  ];
  assert.match(moodSummary(entries), /sad and happy/);
  assert.match(moodSummary(entries), /latest 2/);
  assert.match(moodSummary(entries), /not a diagnosis/);
});
