import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { getRecentActivities, getDailyTip, generateNewTip } from '@/lib/storage';
import { Activity } from '@/types';

const Home: React.FC = () => {
  const [dailyTip, setDailyTip] = useState('');
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const { aiTone } = useSettings();
  
  // Use for debugging
  console.log('Home component rendered');

  useEffect(() => {
    const tip = getDailyTip();
    setDailyTip(tip);
    
    const activities = getRecentActivities();
    setRecentActivities(activities);
  }, []);

  const handleRefreshTip = async () => {
    const newTip = await generateNewTip(aiTone);
    setDailyTip(newTip);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2 bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">Welcome to Vihaara</h1>
        <p className="text-lg text-muted-foreground">Your sanctuary for mental clarity and emotional well-being</p>
      </div>
      
      {/* Daily Tip Card */}
      <Card className="mb-8 border border-primary/10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl pointer-events-none"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center mb-5">
            <div className="bg-primary/10 p-3 rounded-full shadow-inner">
              <i className="fas fa-lightbulb text-primary text-xl"></i>
            </div>
            <h2 className="ml-4 text-xl font-semibold font-heading">Daily Insight</h2>
          </div>
          <p className="text-muted-foreground italic py-2 border-l-2 border-primary/30 pl-4">{dailyTip}</p>
          <div className="mt-6 text-sm text-muted-foreground flex items-center">
            <span className="flex items-center"><i className="fas fa-calendar-alt mr-2"></i>Today's Tip</span>
            <Button variant="outline" size="sm" className="ml-auto hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleRefreshTip}>
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Access Grid */}
      <h2 className="text-xl font-semibold font-heading mb-4 flex items-center">
        <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></div>
        Quick Access
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Journal Card */}
        <a href="/journal" className="bg-background dark:bg-card border border-primary/10 rounded-xl shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 p-6 flex flex-col items-center text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3 shadow-inner">
            <i className="fas fa-book text-purple-500 text-xl"></i>
          </div>
          <h3 className="font-medium font-heading mb-1">Journal</h3>
          <p className="text-sm text-muted-foreground">Reflect and get AI insights</p>
        </a>
        
        {/* AI Chat Card */}
        <a href="/chat" className="bg-background dark:bg-card border border-primary/10 rounded-xl shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3 shadow-inner">
            <i className="fas fa-comment-dots text-primary text-xl"></i>
          </div>
          <h3 className="font-medium font-heading mb-1">AI Chat</h3>
          <p className="text-sm text-muted-foreground">Talk to your wellness AI</p>
        </a>
        
        {/* Mood Tracker Card */}
        <a href="/mood" className="bg-background dark:bg-card border border-primary/10 rounded-xl shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 p-6 flex flex-col items-center text-center">
          <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full mb-3 shadow-inner">
            <i className="fas fa-smile text-pink-500 text-xl"></i>
          </div>
          <h3 className="font-medium font-heading mb-1">Mood Tracker</h3>
          <p className="text-sm text-muted-foreground">Track and analyze your emotions</p>
        </a>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold font-heading mb-4 flex items-center">
        <div className="w-2 h-8 bg-gradient-to-b from-secondary to-primary rounded-full mr-2"></div>
        Recent Activity
      </h2>
      <Card className="border border-primary/10 shadow-sm">
        <CardContent className="p-4">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="bg-muted/50 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <i className="fas fa-history text-2xl text-muted-foreground/70"></i>
              </div>
              <p className="font-medium">No recent activities yet</p>
              <p className="text-sm mt-2">Start using the app to see your activity here!</p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`${index !== recentActivities.length - 1 ? 'border-b border-border pb-3 mb-3' : ''} hover:bg-muted/20 rounded-lg transition-colors p-2`}
              >
                <div className="flex items-center">
                  <div className="bg-muted/70 p-3 rounded-full shadow-inner">
                    <i className={`fas fa-${activity.icon} text-primary/80 text-lg`}></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
