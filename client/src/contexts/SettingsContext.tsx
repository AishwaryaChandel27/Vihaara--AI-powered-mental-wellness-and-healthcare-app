import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';
type AiToneType = 'friendly' | 'clinical' | 'spiritual';

interface SettingsContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  aiTone: AiToneType;
  setAiTone: (tone: AiToneType) => void;
  responseLength: number;
  setResponseLength: (length: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Initialize settings from localStorage or defaults
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('mindmate-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (savedTheme as ThemeType) || (prefersDark ? 'dark' : 'light');
  });

  const [aiTone, setAiTone] = useState<AiToneType>(() => {
    return (localStorage.getItem('mindmate-ai-tone') as AiToneType) || 'friendly';
  });

  const [responseLength, setResponseLength] = useState<number>(() => {
    return parseInt(localStorage.getItem('mindmate-response-length') || '2', 10);
  });

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mindmate-theme', theme);
  }, [theme]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mindmate-ai-tone', aiTone);
  }, [aiTone]);

  useEffect(() => {
    localStorage.setItem('mindmate-response-length', responseLength.toString());
  }, [responseLength]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
    aiTone,
    setAiTone,
    responseLength,
    setResponseLength
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
