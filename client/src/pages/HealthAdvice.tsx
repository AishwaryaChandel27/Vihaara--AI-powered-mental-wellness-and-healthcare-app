import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/contexts/SettingsContext';
import { getAiHealthAdvice } from '@/lib/openai';

const HealthAdvice: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('general');
  const { aiTone } = useSettings();

  const categories = [
    { id: 'general', name: 'General Wellness', icon: 'heart', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' },
    { id: 'diet', name: 'Nutrition', icon: 'utensils', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'sleep', name: 'Sleep', icon: 'moon', color: 'text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { id: 'hydration', name: 'Hydration', icon: 'tint', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'posture', name: 'Posture', icon: 'walking', color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/20' },
  ];

  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const result = await getAiHealthAdvice(currentCategory, aiTone);
      setAdvice(result);
    } catch (error) {
      console.error('Error fetching health advice:', error);
      setAdvice('Sorry, I could not generate health advice at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setAdvice(''); // Clear previous advice when changing categories
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Health Advice</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
              <i className="fas fa-heart text-red-500 text-xl"></i>
            </div>
            <h2 className="ml-4 text-xl font-semibold">Physical Wellness Tips</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Get evidence-based advice for improving your physical health and wellbeing. Select a category below to receive personalized suggestions that align with your needs.
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
                  <h3 className="ml-2 font-medium">{category.name} Tips</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {category.id === 'general' && 'Overall wellness advice for a balanced, healthy lifestyle.'}
                  {category.id === 'diet' && 'Nutritional guidance for better energy and health.'}
                  {category.id === 'sleep' && 'Tips for improving sleep quality and duration.'}
                  {category.id === 'hydration' && 'Advice for staying properly hydrated throughout the day.'}
                  {category.id === 'posture' && 'Guidance for maintaining good posture and preventing pain.'}
                </p>
                
                <Button onClick={fetchAdvice} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating advice...
                    </>
                  ) : (
                    <>
                      <i className={`fas fa-${category.icon} mr-2`}></i>
                      Get {category.name} Advice
                    </>
                  )}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {advice && (
        <Card className="mb-6 border-t-4 border-t-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <i className="fas fa-lightbulb text-primary mr-2"></i>
              {categories.find(c => c.id === currentCategory)?.name} Recommendation
            </h3>
            <div className="text-muted-foreground whitespace-pre-wrap">
              {advice}
            </div>
            <div className="text-xs text-muted-foreground mt-4 flex items-center">
              <i className="fas fa-info-circle mr-1"></i>
              <span>This advice is generated by AI and should not replace professional medical guidance.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p><i className="fas fa-heart text-red-400 mr-1"></i> Always consult healthcare professionals for personalized medical advice.</p>
      </div>
    </div>
  );
};

export default HealthAdvice;