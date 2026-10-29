import type { ChatMessage, MoodEntry } from "../types";

export const urgentMessage =
  "I'm glad you said something. If you might hurt yourself or someone else, or have already taken something or been injured, contact your local emergency services or go to the nearest emergency department now. If you can, move away from anything you could use to hurt yourself and ask someone you trust to stay with you. You deserve real, immediate support; this app cannot provide emergency care. Are you in immediate danger right now?";
export function needsUrgentSupport(text: string) {
  return /suicid|self[ -]?harm|kill (myself|me|someone|them)|end (my|it all)|hurt (myself|someone)|want to die|wish .*dead|better off (dead|without me)|can't go on|cannot go on|overdos|cutting myself|not want to (live|be here)|don't want to (live|be here)/i.test(
    text,
  );
}
const topics = [
  {
    tag: "pressure",
    pattern: /stress|overwhelm|deadline|work|exam|burn.?out/i,
    reflection: "It sounds like there may be a lot asking for your attention.",
    action:
      "Write down what is pressing on you. Choose one small thing you can influence, and let the rest wait for a moment.",
    question: "What feels most urgent, and what could wait until later?",
  },
  {
    tag: "worry",
    pattern: /anxi|panic|worr|afraid|fear|nervous/i,
    reflection: "Uncertainty can take up a lot of space.",
    action:
      "If it feels comfortable, notice the support beneath your feet and name three things you can see. There is no need to force your breathing.",
    question: "Is there a particular thought that keeps returning?",
  },
  {
    tag: "rest",
    pattern: /sleep|tired|exhaust|insomnia/i,
    reflection: "Rest seems to be on your mind.",
    action:
      "Try a quiet transition: lower the light, set aside one task for tomorrow, and give yourself permission to pause.",
    question: "What usually makes winding down easier for you?",
  },
  {
    tag: "connection",
    pattern: /lonely|alone|friend|relationship|break.?up|miss/i,
    reflection: "Connection can matter especially when things feel difficult.",
    action:
      "Consider a small, low-pressure message to someone you trust, such as “Could we talk sometime?”",
    question: "Who feels safe or easy to reach out to?",
  },
  {
    tag: "low mood",
    pattern: /sad|depress|hopeless|empty|cry|grief|lost/i,
    reflection: "That sounds difficult to sit with.",
    action:
      "You do not need to fix everything at once. A drink of water, a comfortable place to sit, or a conversation with someone you trust could be a first step.",
    question: "What would make the next few minutes a little gentler?",
  },
  {
    tag: "frustration",
    pattern: /angry|anger|frustrat|irritat/i,
    reflection: "It sounds like something may be testing your limits.",
    action:
      "If you can, take a little distance from the situation before responding. Notice where tension is showing up without judging it.",
    question: "What boundary or need might deserve attention here?",
  },
  {
    tag: "appreciation",
    pattern: /happy|grateful|thankful|proud|joy|excited/i,
    reflection: "There may be something here worth appreciating.",
    action:
      "Capture one specific detail you would like to remember. You can return to it another day without needing to recreate the feeling.",
    question: "What helped make this moment possible?",
  },
];
export function journalReflection(content: string) {
  if (needsUrgentSupport(content))
    return { insights: urgentMessage, tags: ["support"] };
  const found = topics.filter((t) => t.pattern.test(content));
  return {
    tags: found.length ? found.slice(0, 3).map((t) => t.tag) : ["reflection"],
    insights: found.length
      ? `Offline reflection · ${found[0].reflection} ${found[0].question} This is a word-based prompt, not an assessment of your feelings.`
      : "Offline reflection · What mattered most in this moment? Try separating what happened, what you felt, and what you need next. Only you can decide what this entry means.",
  };
}
export function guidedReply(
  messages: ChatMessage[],
  tone = "friendly",
  length = 2,
) {
  const users = messages.filter((m) => m.role === "user");
  const text = users.at(-1)?.content ?? "";
  if (needsUrgentSupport(text)) return urgentMessage;
  if (
    /medicat|diagnos|dose|bipolar|schizophren|hallucin|voices|poison|chest pain/i.test(
      text,
    )
  )
    return "I cannot diagnose symptoms, recommend medication, or confirm what is causing this. A qualified healthcare professional can help you assess it safely. If you feel unsafe or have severe or sudden physical symptoms, seek urgent medical help. Would you like to write down what you want to tell a professional?";
  const topic = topics.find((t) => t.pattern.test(text));
  const opening =
    tone === "clinical"
      ? "Let’s take this one step at a time."
      : tone === "spiritual"
        ? "You can make room for this moment without solving it all."
        : "Thank you for putting that into words.";
  if (!topic)
    return `${opening} ${users.length > 1 ? "I may not fully understand the context. " : ""}I’m the offline guide, so my responses are limited to prepared reflection prompts. Would you like to explore what happened, name a feeling, or choose one small next step?`;
  return `${opening} ${topic.reflection}\n\n${length === 1 ? topic.question : topic.action + "\n\n" + topic.question}${length === 3 ? "\n\nIf this keeps affecting daily life, consider talking with a qualified professional or someone you trust." : ""}`;
}
export function moodSummary(entries: MoodEntry[]) {
  if (!entries.length)
    return "No moods recorded yet. Start whenever you feel ready.";
  const recent = [...entries]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 7);
  const counts = recent.reduce<Record<string, number>>(
    (out, e) => ({ ...out, [e.mood]: (out[e.mood] || 0) + 1 }),
    {},
  );
  const most = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const tied = most
    .filter((e) => e[1] === most[0][1])
    .map((e) => e[0])
    .join(" and ");
  return `Across your latest ${recent.length} check-in${recent.length === 1 ? "" : "s"}, ${tied} ${tied.includes(" and ") ? "were the most frequent labels" : "was the most frequent label"} (${most[0][1]} each). These are your recorded choices, not a diagnosis or a prediction. Notice what was happening on those days; gaps are okay.`;
}
export const tips = [
  "You do not have to earn a pause. Make a little room for one today.",
  "Choose one small task. Finishing everything is not the only kind of progress.",
  "Name one thing you need today, without explaining it away.",
  "Send a small hello to someone whose company feels comfortable.",
  "Let your shoulders soften, if that feels comfortable. Nothing else to do right now.",
  "Notice one ordinary detail around you: light, texture, or a familiar sound.",
];
export const techniques: Record<string, string> = {
  mindfulness:
    "A moment of noticing\n\nSit or stand in a way that feels comfortable. Look for one shape, one colour, and one texture around you. Notice them without needing to change anything. When your attention wanders, gently return to the room. You can keep your eyes open and stop whenever you want.",
  stress:
    "Make a little space\n\nWrite down one thing weighing on you. Separate what is within your control from what is not. Choose a small next action, or ask someone you trust for support. If stress is persistently affecting daily life, consider a conversation with a qualified professional.",
  breathing:
    "A comfortable breath\n\nLet your breath move gently without forcing its depth. If helpful, count slowly as you breathe in and out. Use a pace that feels easy; you do not need to match the animation. Stop if you feel dizzy or uncomfortable. The Quiet Room has an optional visual guide.",
  affirmations:
    "A kinder sentence\n\nChoose a phrase you can honestly believe: “I can take one small step”, “It is okay to ask for help”, or “This moment does not define my whole day”. Write it down. You do not need to feel positive for the practice to count.",
  meditation:
    "An open-eyed pause\n\nChoose a comfortable position. Rest your attention on an ordinary object. Notice its edges and the light around it. When thoughts appear, acknowledge them and gently return. Try a minute, or less. If focusing inward feels uncomfortable, keep your attention on the room.",
};
export const healthTips: Record<string, string> = {
  general:
    "Everyday wellbeing\n\n• Make space for rest and activities you enjoy.\n• Try movement that fits your ability and comfort.\n• Keep in touch with people you trust.\n• Speak with a healthcare professional about persistent changes in your wellbeing.",
  diet: "A gentler approach to meals\n\n• Aim for regular, varied meals where possible.\n• Notice what is accessible and enjoyable, without labelling foods as good or bad.\n• A qualified clinician or dietitian can help with allergies, eating difficulties, or medical dietary needs.",
  sleep:
    "Make room for rest\n\n• Choose a reasonably consistent wind-down time.\n• Make your space comfortable, quiet, and dim if possible.\n• Put tomorrow’s worries on paper.\n• Discuss persistent sleep problems with a healthcare professional.",
  hydration:
    "Everyday hydration\n\n• Keep a drink nearby as a gentle reminder.\n• Take breaks to notice thirst.\n• Needs vary with activity, weather, and health. Follow your clinician’s advice if you have fluid restrictions.",
  posture:
    "Comfort at your desk\n\n• Adjust your screen so you can see it comfortably.\n• Support your feet and back where possible.\n• Change position and take short movement breaks.\n• Stop any movement that hurts and seek advice for persistent pain.",
};
