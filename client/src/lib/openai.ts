// Compatibility facade: existing callers keep their interfaces; personal text never goes to a server.
import type { ChatMessage, MoodEntry } from "@/types";
import { generateLocal } from "./local-ai";
import {
  guidedReply,
  healthTips,
  journalReflection,
  moodSummary,
  needsUrgentSupport,
  techniques,
  tips,
  urgentMessage,
} from "./wellness";
export async function getAiJournalAnalysis(content: string) {
  const fallback = journalReflection(content);
  if (needsUrgentSupport(content)) return fallback;
  const result = await generateLocal(
    [{ role: "user", content }],
    "Offer one tentative reflection and one open question about this journal entry. Do not infer a diagnosis.",
  );
  return {
    ...fallback,
    insights: result
      ? `On-device AI reflection · ${result}`
      : fallback.insights,
  };
}
export async function getMoodInsightAnalysis(entries: MoodEntry[]) {
  return moodSummary(entries);
}
export async function getAiChatResponse(
  messages: ChatMessage[],
  tone: string,
  length: number,
) {
  const text = messages.filter((m) => m.role === "user").at(-1)?.content || "";
  if (needsUrgentSupport(text)) return urgentMessage;
  if (
    /medicat|diagnos|dose|bipolar|schizophren|hallucin|voices|poison|chest pain/i.test(
      text,
    )
  )
    return guidedReply(messages, tone, length);
  return (
    (await generateLocal(
      messages,
      `Use a ${tone === "clinical" ? "clear and practical" : tone === "spiritual" ? "gentle and mindful" : "warm and friendly"} tone. Write ${length === 1 ? "two short sentences" : length === 3 ? "up to three short paragraphs" : "one short paragraph and one question"}.`,
    )) ?? guidedReply(messages, tone, length)
  );
}
let tipIndex = new Date().getDate() % tips.length;
export async function getDailyWellnessTip(_tone: string) {
  return tips[tipIndex++ % tips.length];
}
export async function getAiHealthAdvice(category: string, _tone: string) {
  return healthTips[category] || healthTips.general;
}
export async function getAiMentalPeaceTechnique(
  category: string,
  _tone: string,
) {
  return techniques[category] || techniques.mindfulness;
}
