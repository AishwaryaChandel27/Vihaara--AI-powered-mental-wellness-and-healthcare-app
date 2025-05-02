// Activity types
export interface Activity {
  id: string;
  type: 'journal' | 'mood' | 'chat';
  title: string;
  timestamp: string;
  icon: string;
}

// Journal types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  analysis: string | null;
}

export interface JournalAnalysis {
  insights: string;
  tags: string[];
}

// Mood types
export type MoodType = 'amazing' | 'happy' | 'neutral' | 'sad' | 'terrible';

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  context: string | null;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Settings types
export interface AppSettings {
  theme: 'light' | 'dark';
  aiTone: 'friendly' | 'professional' | 'supportive' | 'clinical';
  responseLength: number;
}
