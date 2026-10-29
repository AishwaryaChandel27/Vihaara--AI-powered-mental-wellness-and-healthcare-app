import { createLocalId } from "@/lib/utils";
import LocalAIControl from "@/components/LocalAIControl";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "@/components/EmptyState";
import {
  saveJournalEntry,
  getJournalEntries,
  analyzeJournalEntry,
} from "@/lib/storage";
import { JournalEntry } from "@/types";
import { formatDate } from "@/lib/utils";

const Journal: React.FC = () => {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        description:
          "Please add both a title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    const entry: JournalEntry = {
      id: createLocalId(),
      title,
      content,
      date: new Date().toISOString(),
      tags: [],
      analysis: null,
    };

    try {
      saveJournalEntry(entry);
    } catch {
      toast({
        description:
          "Could not save this entry. Your text is still here. Check available browser storage.",
        variant: "destructive",
      });
      return;
    }
    toast({
      description: "Journal entry saved successfully!",
    });

    // Reset form and reload entries
    setTitle("");
    setContent("");
    loadEntries();
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        description: "Please write something in your journal to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const entryTitle = title || "Untitled Entry";
      const analysis = await analyzeJournalEntry(content);
      if (!mounted.current) return;

      const entry: JournalEntry = {
        id: createLocalId(),
        title: entryTitle,
        content,
        date: new Date().toISOString(),
        tags: analysis.tags || [],
        analysis: analysis.insights || "No insights available",
      };

      saveJournalEntry(entry);
      toast({
        description: "Journal entry analyzed and saved!",
      });

      // Reset form and reload entries
      setTitle("");
      setContent("");
      loadEntries();
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Your reflection journal
      </h1>
      <p className="text-sm text-muted-foreground mb-5">
        A place for unfinished thoughts. You don’t have to find the right words.
      </p>
      <LocalAIControl />

      {/* Journal entry form */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">
            Make a little room on the page
          </h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {[
              "What is taking up space in my mind?",
              "One small thing I appreciated today…",
              "What do I need a little more of?",
            ].map((prompt) => (
              <button
                className="text-xs border rounded-full px-3 py-2 hover:bg-muted"
                key={prompt}
                disabled={isAnalyzing}
                onClick={() =>
                  setContent((v) => (v ? v + "\n\n" + prompt : prompt))
                }
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <Input
              className="text-lg font-heading border-2 border-primary/10 h-12 px-4 focus-visible:ring-primary/30"
              disabled={isAnalyzing}
              aria-label="Entry title"
              maxLength={200}
              placeholder="Entry title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Textarea
              className="journal text-lg leading-relaxed border-2 border-primary/10 p-4 min-h-[200px] focus-visible:ring-primary/30"
              disabled={isAnalyzing}
              aria-label="Journal thoughts"
              maxLength={20000}
              placeholder="How are you feeling today? Write your thoughts here..."
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={isAnalyzing}
              onClick={handleSaveDraft}
              className="btn rounded-full hover:bg-primary/10"
            >
              <i className="fas fa-save mr-2"></i> Save Draft
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-brain mr-2"></i> Reflect & save
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
        entries.map((entry) => (
          <Card
            key={entry.id}
            className="mb-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary overflow-hidden"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-xl font-heading">
                  {entry.title}
                </h3>
                <span className="text-sm text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                  {formatDate(entry.date)}
                </span>
              </div>
              <p
                className={`font-journal text-muted-foreground mb-4 leading-relaxed ${expanded === entry.id ? "journal-expanded" : "line-clamp-2"}`}
              >
                {entry.content}
              </p>
              {expanded === entry.id && entry.analysis && (
                <div className="p-4 mb-4 rounded-xl bg-accent/40 text-sm whitespace-pre-wrap">
                  <h4 className="font-sans font-semibold mb-2">Reflection</h4>
                  {entry.analysis}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  aria-expanded={expanded === entry.id}
                  onClick={() =>
                    setExpanded(expanded === entry.id ? null : entry.id)
                  }
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10 rounded-full"
                >
                  <i className="fas fa-book-open mr-1"></i>{" "}
                  {expanded === entry.id ? "Close entry" : "Read more"}
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
