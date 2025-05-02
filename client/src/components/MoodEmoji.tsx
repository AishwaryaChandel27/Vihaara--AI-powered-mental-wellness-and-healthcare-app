import React from 'react';
import { cn } from '@/lib/utils';

interface MoodEmojiProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const MoodEmoji: React.FC<MoodEmojiProps> = ({ emoji, label, selected, onClick }) => {
  return (
    <button 
      className={cn(
        "mood-emoji p-3 rounded-lg transition-all",
        selected 
          ? "bg-primary/10 text-primary scale-110" 
          : "hover:bg-muted text-foreground hover:scale-105"
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <span className="text-2xl">{emoji}</span>
    </button>
  );
};

export default MoodEmoji;
