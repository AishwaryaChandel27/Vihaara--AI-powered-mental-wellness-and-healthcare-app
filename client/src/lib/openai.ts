import { ChatMessage, MoodEntry } from '@/types';

// For browser-based app, we'll proxy OpenAI calls through our server
const API_ENDPOINT = '/api/ai';

export async function getAiJournalAnalysis(journalContent: string) {
  try {
    const response = await fetch(`${API_ENDPOINT}/analyze-journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: journalContent })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing journal:', error);
    throw error;
  }
}

export async function getMoodInsightAnalysis(moodEntries: MoodEntry[]) {
  try {
    const response = await fetch(`${API_ENDPOINT}/mood-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries: moodEntries })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('Error getting mood insights:', error);
    throw error;
  }
}

export async function getAiChatResponse(
  messages: ChatMessage[],
  tone: string,
  responseLength: number
) {
  try {
    // Format messages for OpenAI API format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const response = await fetch(`${API_ENDPOINT}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages: formattedMessages,
        tone,
        responseLength 
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
}

export async function getDailyWellnessTip(tone: string) {
  try {
    const response = await fetch(`${API_ENDPOINT}/daily-tip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tone })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.tip;
  } catch (error) {
    console.error('Error getting daily tip:', error);
    throw error;
  }
}
