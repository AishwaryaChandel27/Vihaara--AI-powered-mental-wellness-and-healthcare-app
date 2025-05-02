import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/contexts/SettingsContext';
import { getChatHistory, saveChatHistory, getChatResponse } from '@/lib/storage';
import { ChatMessage } from '@/types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { aiTone, responseLength } = useSettings();

  useEffect(() => {
    // Initialize chat with welcome message if no history exists
    const history = getChatHistory();
    if (history.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm your MindMate AI assistant. I'm here to listen, provide support, and offer wellness guidance. How are you feeling today?",
        timestamp: new Date().toISOString()
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    // Update UI immediately with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Get AI response
      const response = await getChatResponse(updatedMessages, aiTone, responseLength);
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      // Update with assistant response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      // Handle error
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I had trouble processing your message. Could you try again?",
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Hello! I'm your MindMate AI assistant. I'm here to listen, provide support, and offer wellness guidance. How are you feeling today?",
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">AI Chat</h1>
      
      <Card className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg border-2 border-primary/10">
        {/* Chat header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center">
            <div className="bg-white dark:bg-card p-3 rounded-full shadow-sm">
              <i className="fas fa-robot text-primary text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-heading font-medium text-lg">MindMate Assistant</h3>
              <p className="text-xs text-muted-foreground">AI-powered wellness support</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset conversation" className="rounded-full hover:bg-white/20 dark:hover:bg-card/20">
            <i className="fas fa-redo-alt"></i>
          </Button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="bg-white dark:bg-card p-2 rounded-full shadow-sm border border-primary/20">
                  <i className="fas fa-robot text-primary text-lg"></i>
                </div>
              )}
              
              <div 
                className={`mx-3 py-3 px-5 rounded-xl max-w-[80%] shadow-sm chat-message ${
                  message.role === 'user' 
                    ? 'chat-message-user bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-br-none' 
                    : 'chat-message-ai bg-muted/50 rounded-bl-none'
                }`}
              >
                <p>{message.content}</p>
              </div>
              
              {message.role === 'user' && (
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
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1 h-12 pl-4 pr-4 border-2 border-primary/10 focus-visible:ring-primary/30 rounded-full text-lg"
            />
            <Button 
              type="submit" 
              disabled={isProcessing}
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
            <i className="fas fa-lock mr-1"></i> Your conversations are private and stored locally on your device only.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
