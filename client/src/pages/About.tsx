import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 gap-3">
        <i className="fas fa-om text-primary text-3xl"></i>
        <h1 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">🧘‍♀️ About Vihaara</h1>
      </div>
      
      <Card className="mb-6 border border-primary/10 shadow-md">
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Vihaara — derived from Sanskrit, meaning lifestyle or mindful dwelling — is your personal sanctuary for mental clarity and emotional well-being. Inspired by ancient concepts of balance and modern intelligence, Vihaara blends the wisdom of mindful living with the power of advanced AI.
          </p>
          
          <h2 className="text-xl font-semibold font-heading mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            Our mission is simple: To provide a private, intelligent, and comforting space for daily self-care, reflection, and emotional support — without judgment, tracking, or cloud storage.
          </p>
          
          <p className="text-muted-foreground mb-6">
            Whether you're journaling your thoughts, checking in on your mood, or seeking health and wellness tips, Vihaara is designed to meet you with calm, insight, and compassion — every single day.
          </p>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-full shadow-inner">
              <i className="fas fa-lock text-primary"></i>
            </div>
            <div>
              <h3 className="font-medium font-heading">Privacy First</h3>
              <p className="text-sm text-muted-foreground">All your data stays on your device. Nothing is sent to the cloud.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full shadow-inner">
              <i className="fas fa-brain text-purple-500"></i>
            </div>
            <div>
              <h3 className="font-medium font-heading">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">Advanced AI helps you understand patterns and provides personalized guidance.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="italic text-lg font-medium text-primary/90 font-heading">"Live gently. Think clearly. Feel deeply."</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6 border border-primary/10 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold font-heading mb-5 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></div>
            How Vihaara Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex p-3 hover:bg-muted/20 rounded-lg transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">1</div>
              <div className="ml-4">
                <h3 className="font-medium font-heading">Journal Your Thoughts</h3>
                <p className="text-sm text-muted-foreground">Write down your feelings and experiences. Vihaara's AI will analyze the emotions and provide insights.</p>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-muted/20 rounded-lg transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">2</div>
              <div className="ml-4">
                <h3 className="font-medium font-heading">Track Your Mood</h3>
                <p className="text-sm text-muted-foreground">Log your daily mood with simple emoji selections. Discover patterns over time.</p>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-muted/20 rounded-lg transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">3</div>
              <div className="ml-4">
                <h3 className="font-medium font-heading">Chat with Your AI</h3>
                <p className="text-sm text-muted-foreground">Have supportive conversations with Vihaara's AI assistant for guidance and mental wellness tips.</p>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-muted/20 rounded-lg transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">4</div>
              <div className="ml-4">
                <h3 className="font-medium font-heading">Receive Daily Tips</h3>
                <p className="text-sm text-muted-foreground">Get personalized wellness suggestions based on your mood patterns and journal content.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-primary/10 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold font-heading mb-5 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-secondary to-primary rounded-full mr-2"></div>
            Privacy Commitment
          </h2>
          <p className="text-muted-foreground mb-6">
            Vihaara runs entirely in your browser. Your journal entries, conversations, and mood data are stored only on your device using localStorage. We have no servers collecting your information, no accounts to create, and no data being shared with third parties.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-yellow-500"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 font-heading">Important Note</h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                  While Vihaara provides support for emotional well-being, it is not a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact a healthcare professional.
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
