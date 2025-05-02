import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/contexts/SettingsContext';
import { getAiMentalPeaceTechnique } from '@/lib/openai';

const MentalPeace: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [technique, setTechnique] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('mindfulness');
  const { aiTone } = useSettings();

  const categories = [
    { id: 'mindfulness', name: 'Mindfulness', icon: 'brain', color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
    { id: 'stress', name: 'Stress Relief', icon: 'wind', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'breathing', name: 'Breathing', icon: 'lungs', color: 'text-teal-500', bgColor: 'bg-teal-100 dark:bg-teal-900/20' },
    { id: 'affirmations', name: 'Affirmations', icon: 'comment', color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/20' },
    { id: 'meditation', name: 'Meditation', icon: 'om', color: 'text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/20' },
  ];

  const fetchTechnique = async () => {
    setIsLoading(true);
    try {
      const result = await getAiMentalPeaceTechnique(currentCategory, aiTone);
      setTechnique(result);
    } catch (error) {
      console.error('Error fetching mental peace technique:', error);
      setTechnique('Sorry, I could not generate a mental peace technique at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setTechnique(''); // Clear previous technique when changing categories
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mental Peace</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full">
              <i className="fas fa-om text-indigo-500 text-xl"></i>
            </div>
            <h2 className="ml-4 text-xl font-semibold">Inner Calm Techniques</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Discover techniques for cultivating mental peace and emotional balance. Select a category to receive guidance that can help bring tranquility to your busy life.
          </p>
          
          <Tabs defaultValue={currentCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <i className={`fas fa-${category.icon} ${category.color} mr-2`}></i>
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="pt-2">
                <div className="flex items-center mb-4">
                  <div className={`${category.bgColor} p-2 rounded-full`}>
                    <i className={`fas fa-${category.icon} ${category.color}`}></i>
                  </div>
                  <h3 className="ml-2 font-medium">{category.name}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {category.id === 'mindfulness' && 'Present-moment awareness practices to calm your mind.'}
                  {category.id === 'stress' && 'Techniques to reduce stress and anxiety in daily life.'}
                  {category.id === 'breathing' && 'Breathing exercises to center yourself and find calm.'}
                  {category.id === 'affirmations' && 'Positive statements to transform your mindset and outlook.'}
                  {category.id === 'meditation' && 'Guided practices to deepen your awareness and inner peace.'}
                </p>
                
                <Button onClick={fetchTechnique} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating technique...
                    </>
                  ) : (
                    <>
                      <i className={`fas fa-${category.icon} mr-2`}></i>
                      Get {category.name} Technique
                    </>
                  )}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {technique && (
        <Card className="mb-6 border-t-4 border-t-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <i className="fas fa-feather-alt text-primary mr-2"></i>
              {categories.find(c => c.id === currentCategory)?.name} Practice
            </h3>
            <div className="text-muted-foreground whitespace-pre-wrap">
              {technique}
            </div>
            <div className="text-xs text-muted-foreground mt-4 flex items-center">
              <i className="fas fa-info-circle mr-1"></i>
              <span>Try to practice this technique regularly for the best results.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p><i className="fas fa-om text-indigo-400 mr-1"></i> For persistent mental health concerns, please consult with a qualified professional.</p>
      </div>
    </div>
  );
};

export default MentalPeace;