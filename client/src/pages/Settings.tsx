import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { clearAllData, exportData } from '@/lib/storage';

const Settings: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    aiTone, 
    setAiTone, 
    responseLength, 
    setResponseLength 
  } = useSettings();
  
  const { toast } = useToast();

  const handleExportData = () => {
    const success = exportData();
    if (success) {
      toast({
        description: "Your data has been exported successfully!",
      });
    } else {
      toast({
        title: "Export failed",
        description: "Could not export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      clearAllData();
      toast({
        description: "All data has been cleared from your device.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
        
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
          
          {/* AI Tone setting */}
          <div className="mb-6">
            <Label className="mb-2">Assistant Tone</Label>
            <p className="text-sm text-muted-foreground mb-3">Choose how your AI assistant communicates with you</p>
            
            <RadioGroup value={aiTone} onValueChange={(value) => setAiTone(value as any)}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className={`p-3 border rounded-lg cursor-pointer ${aiTone === 'friendly' ? 'bg-primary/10 border-primary' : 'border-border'}`}>
                  <RadioGroupItem value="friendly" id="friendly" className="sr-only" />
                  <Label htmlFor="friendly" className="cursor-pointer flex items-center">
                    <span className={`w-4 h-4 mr-2 rounded-full border ${aiTone === 'friendly' ? 'border-primary' : 'border-muted-foreground'} flex items-center justify-center`}>
                      {aiTone === 'friendly' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </span>
                    Friendly
                  </Label>
                </div>
                
                <div className={`p-3 border rounded-lg cursor-pointer ${aiTone === 'professional' ? 'bg-primary/10 border-primary' : 'border-border'}`}>
                  <RadioGroupItem value="professional" id="professional" className="sr-only" />
                  <Label htmlFor="professional" className="cursor-pointer flex items-center">
                    <span className={`w-4 h-4 mr-2 rounded-full border ${aiTone === 'professional' ? 'border-primary' : 'border-muted-foreground'} flex items-center justify-center`}>
                      {aiTone === 'professional' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </span>
                    Professional
                  </Label>
                </div>
                
                <div className={`p-3 border rounded-lg cursor-pointer ${aiTone === 'supportive' ? 'bg-primary/10 border-primary' : 'border-border'}`}>
                  <RadioGroupItem value="supportive" id="supportive" className="sr-only" />
                  <Label htmlFor="supportive" className="cursor-pointer flex items-center">
                    <span className={`w-4 h-4 mr-2 rounded-full border ${aiTone === 'supportive' ? 'border-primary' : 'border-muted-foreground'} flex items-center justify-center`}>
                      {aiTone === 'supportive' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </span>
                    Supportive
                  </Label>
                </div>
                
                <div className={`p-3 border rounded-lg cursor-pointer ${aiTone === 'clinical' ? 'bg-primary/10 border-primary' : 'border-border'}`}>
                  <RadioGroupItem value="clinical" id="clinical" className="sr-only" />
                  <Label htmlFor="clinical" className="cursor-pointer flex items-center">
                    <span className={`w-4 h-4 mr-2 rounded-full border ${aiTone === 'clinical' ? 'border-primary' : 'border-muted-foreground'} flex items-center justify-center`}>
                      {aiTone === 'clinical' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </span>
                    Clinical
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Response Length setting */}
          <div>
            <Label className="mb-2">Response Length</Label>
            <p className="text-sm text-muted-foreground mb-3">Choose how detailed the AI responses should be</p>
            
            <div className="relative w-full px-1">
              <Slider
                value={[responseLength]}
                min={1}
                max={3}
                step={1}
                onValueChange={(value) => setResponseLength(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1 mt-1">
                <span>Brief</span>
                <span>Balanced</span>
                <span>Detailed</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          
          {/* Data export */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-medium">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">Download a copy of all your journal entries and mood data</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <i className="fas fa-download mr-1"></i> Export
            </Button>
          </div>
          
          {/* Clear data */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear All Data</h3>
              <p className="text-sm text-muted-foreground">Remove all your stored data from this device</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleClearData}
            >
              <i className="fas fa-trash-alt mr-1"></i> Clear Data
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>MindMate AI v1.0.0</p>
        <p className="mt-1">Created with ❤️ for better mental health</p>
      </div>
    </div>
  );
};

export default Settings;
