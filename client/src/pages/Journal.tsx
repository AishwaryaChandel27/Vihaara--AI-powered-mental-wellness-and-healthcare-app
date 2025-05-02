import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { saveJournalEntry, getJournalEntries, analyzeJournalEntry } from '@/lib/storage';
import { JournalEntry } from '@/types';
import { formatDate } from '@/lib/utils';

const Journal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const journalEntries = getJournalEntries();
    setEntries(journalEntries);
  };

  const handleSaveDraft = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        description: "Please add both a title and content for your journal entry.",
        variant: "destructive"
      });
      return;
    }
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
      tags: [],
      analysis: null
    };
    
    saveJournalEntry(entry);
    toast({
      description: "Journal entry saved successfully!",
    });
    
    // Reset form and reload entries
    setTitle('');
    setContent('');
    loadEntries();
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        description: "Please write something in your journal to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const entryTitle = title || "Untitled Entry";
      const analysis = await analyzeJournalEntry(content);
      
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: entryTitle,
        content,
        date: new Date().toISOString(),
        tags: analysis.tags || [],
        analysis: analysis.insights || "No insights available"
      };
      
      saveJournalEntry(entry);
      toast({
        description: "Journal entry analyzed and saved!",
      });
      
      // Reset form and reload entries
      setTitle('');
      setContent('');
      loadEntries();
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your journal entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Journal</h1>
      
      {/* Journal entry form */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">New Entry</h2>
          <div className="mb-4">
            <Input
              placeholder="Entry title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Textarea
              placeholder="How are you feeling today? Write your thoughts here..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-brain mr-2"></i> Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Previous entries */}
      <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
      
      {entries.length === 0 ? (
        <EmptyState
          icon="fas fa-book"
          title="No Journal Entries Yet"
          description="Write your first journal entry above to get started. Your entries will appear here."
        />
      ) : (
        entries.map(entry => (
          <Card key={entry.id} className="mb-4 hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{entry.title}</h3>
                <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
              </div>
              <p className="text-muted-foreground line-clamp-2 mb-3">{entry.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {entry.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Read more
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Journal;
