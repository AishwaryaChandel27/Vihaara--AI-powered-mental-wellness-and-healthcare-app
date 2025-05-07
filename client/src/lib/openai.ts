import { ChatMessage, MoodEntry } from '@/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAi(messages: { role: string; content: string }[], temperature = 0.7, max_tokens = 500) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4', // or 'gpt-3.5-turbo'
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Example function for journal analysis
export async function getAiJournalAnalysis(journalContent: string) {
  const messages = [
    { role: 'system', content: 'You are a helpful mental health assistant.' },
    { role: 'user', content: `Analyze this journal entry and provide emotional insights:\n\n${journalContent}` },
  ];
  return await callOpenAi(messages);
}

export async function getMoodInsightAnalysis(moodEntries: MoodEntry[]) {
  const formatted = moodEntries.map((entry, idx) => `Entry ${idx + 1}: ${JSON.stringify(entry)}`).join('\n');
  const messages = [
    { role: 'system', content: 'You are an emotional wellness analyst.' },
    { role: 'user', content: `Analyze these mood entries and summarize patterns:\n\n${formatted}` },
  ];
  return await callOpenAi(messages);
}

export async function getAiChatResponse(
  messages: ChatMessage[],
  tone: string,
  responseLength: number
) {
  const prompt = [
    { role: 'system', content: `You are a chatbot. Maintain a ${tone} tone and reply in about ${responseLength} words.` },
    ...messages.map(msg => ({ role: msg.role, content: msg.content })),
  ];
  return await callOpenAi(prompt, 0.7, responseLength * 2); // adjust token length
}

export async function getDailyWellnessTip(tone: string) {
  const messages = [
    { role: 'system', content: `You are a wellness coach. Give a short daily wellness tip in a ${tone} tone.` },
    { role: 'user', content: 'Give me a wellness tip for today.' },
  ];
  return await callOpenAi(messages, 0.6, 100);
}

export async function getAiHealthAdvice(category: string, tone: string) {
  const messages = [
    { role: 'system', content: `You are a healthcare advisor. Provide concise advice for the category "${category}" in a ${tone} tone.` },
    { role: 'user', content: `I need advice on: ${category}` },
  ];
  return await callOpenAi(messages, 0.7, 200);
}

export async function getAiMentalPeaceTechnique(category: string, tone: string) {
  const messages = [
    { role: 'system', content: `You are a meditation coach. Give a mental peace technique for "${category}" in a ${tone} tone.` },
    { role: 'user', content: `I want to calm my mind using techniques in the category: ${category}` },
  ];
  return await callOpenAi(messages, 0.7, 200);
}
