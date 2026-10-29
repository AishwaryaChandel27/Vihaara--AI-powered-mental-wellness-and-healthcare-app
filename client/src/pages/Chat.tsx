import { createLocalId } from "@/lib/utils";
import LocalAIControl from "@/components/LocalAIControl";
import { useLocalAI } from "@/lib/local-ai";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/contexts/SettingsContext";
import {
  getChatHistory,
  saveChatHistory,
  getChatResponse,
} from "@/lib/storage";
import { ChatMessage } from "@/types";

const Chat: React.FC = () => {
  const aiStatus = useLocalAI();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { aiTone, responseLength } = useSettings();

  useEffect(() => {
    // Initialize chat with welcome message if no history exists
    const history = getChatHistory();
    if (history.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: createLocalId(),
        role: "assistant",
        content:
          "Welcome to your quiet corner. I can help you reflect on what is on your mind. I am an AI tool or prepared offline guide, not a therapist. What would you like to make space for today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      saveChatHistory([welcomeMessage]);
    } else {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: createLocalId(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    // Update UI immediately with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsProcessing(true);

    try {
      // Get AI response
      const response = await getChatResponse(
        updatedMessages,
        aiTone,
        responseLength,
      );

      if (!mounted.current) return;
      const assistantMessage: ChatMessage = {
        id: createLocalId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      // Update with assistant response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      // Handle error
      const errorMessage: ChatMessage = {
        id: createLocalId(),
        role: "assistant",
        content:
          "I'm sorry, I had trouble processing your message. Could you try again?",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    const welcomeMessage: ChatMessage = {
      id: createLocalId(),
      role: "assistant",
      content:
        "Welcome to your quiet corner. I can help you reflect on what is on your mind. I am an AI tool or prepared offline guide, not a therapist. What would you like to make space for today?",
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">A space to talk</h1>
      <LocalAIControl />

      <Card className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg border-2 border-primary/10">
        {/* Chat header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center">
            <div className="bg-white dark:bg-card p-3 rounded-full shadow-sm">
              <i className="fas fa-robot text-primary text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-heading font-medium text-lg">
                Vihaara companion
              </h3>
              <p className="text-xs text-muted-foreground">
                {aiStatus.state === "ready"
                  ? "On-device AI · may make mistakes"
                  : "Offline guide · prepared reflection prompts"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={isProcessing}
            aria-label="Reset conversation"
            onClick={handleReset}
            title="Reset conversation"
            className="rounded-full hover:bg-white/20 dark:hover:bg-card/20"
          >
            <i className="fas fa-redo-alt"></i>
          </Button>
        </div>

        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {[
            "I feel overwhelmed",
            "I need help winding down",
            "Something went well today",
          ].map((text) => (
            <button
              key={text}
              disabled={isProcessing}
              onClick={() => setInput(text)}
              className="text-xs rounded-full border px-3 py-2 hover:bg-muted"
            >
              {text}
            </button>
          ))}
        </div>
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[240px] max-h-[50vh]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="bg-white dark:bg-card p-2 rounded-full shadow-sm border border-primary/20">
                  <i className="fas fa-robot text-primary text-lg"></i>
                </div>
              )}

              <div
                className={`mx-3 py-3 px-5 rounded-xl max-w-[80%] shadow-sm chat-message ${
                  message.role === "user"
                    ? "chat-message-user bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-br-none"
                    : "chat-message-ai bg-muted/50 rounded-bl-none"
                }`}
              >
                <p>{message.content}</p>
              </div>

              {message.role === "user" && (
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-full shadow-sm">
                  <i className="fas fa-user text-white text-lg"></i>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message to your companion"
              maxLength={4000}
              placeholder="What’s on your mind?"
              disabled={isProcessing}
              className="flex-1 h-12 pl-4 pr-4 border-2 border-primary/10 focus-visible:ring-primary/30 rounded-full text-lg"
            />
            <Button
              aria-label="Send message"
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="btn rounded-full h-12 w-12 p-0 bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white"
            >
              {isProcessing ? (
                <i className="fas fa-spinner fa-spin text-lg"></i>
              ) : (
                <i className="fas fa-paper-plane text-lg"></i>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            <i className="fas fa-lock mr-1"></i> Saved in this browser,
            unencrypted. Avoid shared devices for sensitive conversations.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
