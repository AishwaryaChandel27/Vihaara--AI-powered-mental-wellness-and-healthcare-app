import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">About MindMate AI</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">Your Private Wellness Companion</h2>
          <p className="text-muted-foreground mb-4">
            MindMate AI is a private, intelligent wellness companion designed to support your mental health and personal growth. Using advanced AI technology, MindMate offers journaling, mood tracking, personalized self-care tips, and chat-based mental support — all while keeping your data completely private.
          </p>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <i className="fas fa-lock text-primary"></i>
            </div>
            <div>
              <h3 className="font-medium">Privacy First</h3>
              <p className="text-sm text-muted-foreground">All your data stays on your device. Nothing is sent to the cloud.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <i className="fas fa-brain text-purple-500"></i>
            </div>
            <div>
              <h3 className="font-medium">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">Advanced AI helps you understand patterns and provides personalized guidance.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</div>
              <div className="ml-4">
                <h3 className="font-medium">Journal Your Thoughts</h3>
                <p className="text-sm text-muted-foreground">Write down your feelings and experiences. MindMate's AI will analyze the emotions and provide insights.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</div>
              <div className="ml-4">
                <h3 className="font-medium">Track Your Mood</h3>
                <p className="text-sm text-muted-foreground">Log your daily mood with simple emoji selections. Discover patterns over time.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</div>
              <div className="ml-4">
                <h3 className="font-medium">Chat with Your AI</h3>
                <p className="text-sm text-muted-foreground">Have supportive conversations with MindMate's AI assistant for guidance and mental wellness tips.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">4</div>
              <div className="ml-4">
                <h3 className="font-medium">Receive Daily Tips</h3>
                <p className="text-sm text-muted-foreground">Get personalized wellness suggestions based on your mood patterns and journal content.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">Privacy Commitment</h2>
          <p className="text-muted-foreground mb-4">
            MindMate AI runs entirely in your browser. Your journal entries, conversations, and mood data are stored only on your device using localStorage. We have no servers collecting your information, no accounts to create, and no data being shared with third parties.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important Note</h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                  While MindMate provides support for emotional well-being, it is not a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact a healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
