import { 
  Activity, 
  JournalEntry, 
  MoodEntry, 
  ChatMessage, 
  JournalAnalysis
} from '@/types';
import { getAiJournalAnalysis, getDailyWellnessTip, getMoodInsightAnalysis, getAiChatResponse } from './openai';

// Local storage keys
const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'mindmate-journal-entries',
  MOOD_ENTRIES: 'mindmate-mood-entries',
  CHAT_HISTORY: 'mindmate-chat-history',
  RECENT_ACTIVITIES: 'mindmate-recent-activities',
  DAILY_TIP: 'mindmate-daily-tip',
  DAILY_TIP_DATE: 'mindmate-daily-tip-date'
};

// Journal Functions
export function getJournalEntries(): JournalEntry[] {
  const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
  return entries ? JSON.parse(entries) : [];
}

export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  entries.unshift(entry); // Add to beginning
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  
  // Add to recent activities
  addActivity({
    id: entry.id,
    type: 'journal',
    title: 'Journal Entry',
    timestamp: new Date().toLocaleString(),
    icon: 'book'
  });
}

export async function analyzeJournalEntry(content: string): Promise<JournalAnalysis> {
  try {
    return await getAiJournalAnalysis(content);
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    return {
      insights: "Unable to analyze journal entry at this time.",
      tags: ['unanalyzed']
    };
  }
}

// Mood Functions
export function getMoodEntries(): MoodEntry[] {
  const entries = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
  return entries ? JSON.parse(entries) : [];
}

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  
  // Check if already logged mood today
  const today = new Date().toDateString();
  const todayEntryIndex = entries.findIndex(e => 
    new Date(e.date).toDateString() === today
  );
  
  if (todayEntryIndex !== -1) {
    // Update today's entry
    entries[todayEntryIndex] = entry;
  } else {
    // Add new entry
    entries.unshift(entry);
  }
  
  localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
  
  // Add to recent activities
  addActivity({
    id: entry.id,
    type: 'mood',
    title: `Mood Tracked: ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}`,
    timestamp: new Date().toLocaleString(),
    icon: 'smile'
  });
}

export async function getMoodInsights(entries: MoodEntry[]): Promise<string> {
  try {
    return await getMoodInsightAnalysis(entries);
  } catch (error) {
    console.error('Error getting mood insights:', error);
    return "Track your mood regularly to get personalized insights.";
  }
}

// Chat Functions
export function getChatHistory(): ChatMessage[] {
  const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return history ? JSON.parse(history) : [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  
  // Only add to activities when a new message is added
  if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
    addActivity({
      id: Date.now().toString(),
      type: 'chat',
      title: 'AI Chat Session',
      timestamp: new Date().toLocaleString(),
      icon: 'comment-dots'
    });
  }
}

export async function getChatResponse(
  messages: ChatMessage[], 
  tone: string,
  responseLength: number
): Promise<string> {
  try {
    return await getAiChatResponse(messages, tone, responseLength);
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

// Daily Tip Functions
export function getDailyTip(): string {
  const lastDate = localStorage.getItem(STORAGE_KEYS.DAILY_TIP_DATE);
  const today = new Date().toDateString();
  
  // Check if tip was generated today
  if (lastDate === today) {
    const tip = localStorage.getItem(STORAGE_KEYS.DAILY_TIP);
    if (tip) return tip;
  }
  
  // Default tip if none exists or is outdated
  return "Taking a few minutes for mindful breathing can reset your nervous system and improve your focus throughout the day.";
}

export async function generateNewTip(tone: string): Promise<string> {
  try {
    const tip = await getDailyWellnessTip(tone);
    localStorage.setItem(STORAGE_KEYS.DAILY_TIP, tip);
    localStorage.setItem(STORAGE_KEYS.DAILY_TIP_DATE, new Date().toDateString());
    return tip;
  } catch (error) {
    console.error('Error generating daily tip:', error);
    return "Remember to take care of your mental health as much as your physical health.";
  }
}

// Activity Functions
export function getRecentActivities(): Activity[] {
  const activities = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITIES);
  return activities ? JSON.parse(activities) : [];
}

function addActivity(activity: Activity): void {
  const activities = getRecentActivities();
  activities.unshift(activity);
  
  // Limit to 10 recent activities
  const limitedActivities = activities.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITIES, JSON.stringify(limitedActivities));
}

// Data Management Functions
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

export function exportData(): boolean {
  try {
    const data = {
      journalEntries: getJournalEntries(),
      moodEntries: getMoodEntries(),
      chatHistory: getChatHistory(),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `mindmate-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
}
