import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MoodEmoji from '@/components/MoodEmoji';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { getMoodEntries, saveMoodEntry, getMoodInsights } from '@/lib/storage';
import { MoodEntry, MoodType } from '@/types';
import { formatDate } from '@/lib/utils';

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'amazing', emoji: '😁', label: 'Amazing' },
  { type: 'happy', emoji: '🙂', label: 'Happy' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'sad', emoji: '😔', label: 'Sad' },
  { type: 'terrible', emoji: '😢', label: 'Terrible' }
];

const Mood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [context, setContext] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    
    if (entries.length >= 3) {
      const moodInsights = await getMoodInsights(entries);
      setInsights(moodInsights);
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast({
        description: "Please select how you're feeling today.",
        variant: "destructive"
      });
      return;
    }
    
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      context: context.trim() || null
    };
    
    saveMoodEntry(entry);
    toast({
      description: "Your mood has been saved!",
    });
    
    // Reset form and reload data
    setSelectedMood(null);
    setContext('');
    loadMoodData();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mood Tracker</h1>
      
      {/* Today's mood section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
          
          {/* Mood selection grid */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {MOODS.map(({ type, emoji, label }) => (
              <MoodEmoji
                key={type}
                emoji={emoji}
                label={label}
                selected={selectedMood === type}
                onClick={() => handleMoodSelect(type)}
              />
            ))}
          </div>
          
          {/* Optional mood context */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              What's contributing to this feeling? (optional)
            </label>
            <Input
              placeholder="e.g., Work stress, Good news, etc."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSaveMood} 
            className="w-full"
          >
            Save Today's Mood
          </Button>
        </CardContent>
      </Card>
      
      {/* Mood insights */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Mood Insights</h2>
          
          {moodEntries.length < 3 ? (
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground">Track at least 3 moods to see insights</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {moodEntries.length} / 3 entries recorded
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-48 mb-6 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Mood visualization will appear here</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">AI Insights</h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">{insights}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Mood history */}
      <h2 className="text-xl font-semibold mb-4">Recent Mood History</h2>
      
      {moodEntries.length === 0 ? (
        <EmptyState
          icon="fas fa-smile"
          title="No Mood Entries Yet"
          description="Track your first mood above to get started. Your mood history will appear here."
        />
      ) : (
        <Card>
          <div className="grid grid-cols-3 divide-x divide-border">
            {moodEntries.slice(0, 6).map((entry, index) => (
              <div 
                key={entry.id} 
                className={`p-4 text-center ${index < 3 ? 'border-b border-border' : ''}`}
              >
                <p className="text-sm text-muted-foreground">
                  {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : formatDate(entry.date)}
                </p>
                <p className="text-2xl mt-1">
                  {MOODS.find(m => m.type === entry.mood)?.emoji || '😐'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {entry.context || 'No context provided'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Mood;
