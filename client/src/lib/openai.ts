import { ChatMessage, MoodEntry } from '@/types';

async function apiCall(endpoint: string, data: any) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Journal analysis function
export async function getAiJournalAnalysis(journalContent: string) {
  const result = await apiCall('/api/ai/analyze-journal', { content: journalContent });
  return result;
}

export async function getMoodInsightAnalysis(moodEntries: MoodEntry[]) {
  const result = await apiCall('/api/ai/mood-insights', { entries: moodEntries });
  return result.insights;
}

export async function getAiChatResponse(
  messages: ChatMessage[],
  tone: string,
  responseLength: number
) {
  const result = await apiCall('/api/ai/chat', { messages, tone, responseLength });
  return result.response;
}

export async function getDailyWellnessTip(tone: string) {
  const result = await apiCall('/api/ai/daily-tip', { tone });
  return result.tip;
}

export async function getAiHealthAdvice(category: string, tone: string) {
  const result = await apiCall('/api/ai/health-advice', { category, tone });
  return result.advice;
}

export async function getAiMentalPeaceTechnique(category: string, tone: string) {
  const result = await apiCall('/api/ai/mental-peace', { category, tone });
  return result.technique;
}
