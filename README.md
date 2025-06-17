# Vihaara - Mindful Digital Sanctuary

A privacy-focused mental wellness application that serves as your personal sanctuary for mental clarity and emotional well-being. Vihaara provides AI-powered journaling insights, mood tracking, an intelligent chat companion, and wellness resources while keeping all your data completely private and stored locally on your device.

## What Makes Vihaara Special

**Privacy First**: Your personal data never leaves your device. All journals, mood entries, and conversations stay completely private.

**Intelligent AI Support**: Dual AI system with OpenAI GPT-4o and Google Gemini ensures you always get thoughtful, personalized responses.

**Comprehensive Wellness Tools**: Everything you need for mental wellness in one beautiful, easy-to-use application.

## Features

### Mental Wellness Tools
- **Smart Journaling** - Write your thoughts and get AI-powered emotional insights and analysis
- **Mood Tracking** - Log daily moods with pattern recognition and helpful visualizations  
- **AI Chat Companion** - Have meaningful conversations with an AI trained in mental wellness
- **Health Guidance** - Get personalized advice on sleep, nutrition, exercise, and more
- **Mindfulness Techniques** - Learn breathing exercises, meditation, and stress relief practices
- **Daily Wellness Tips** - Receive personalized insights to improve your mental health

### Privacy & Control
- All your data stays on your device - never uploaded to servers
- Export your data anytime you want
- Delete everything with one click
- No tracking, no ads, no data collection

### Advanced AI Features
- Dual AI system for maximum reliability (OpenAI + Google Gemini)
- Automatic backup when one AI service has issues
- Choose your preferred AI tone: friendly, clinical, or spiritual
- Adjustable response length for your preferences

## Quick Start Guide

### Step 1: Prerequisites
You need these installed on your computer:
- **Node.js 20 or newer** - Download from [nodejs.org](https://nodejs.org)
- **npm** - Comes with Node.js automatically

### Step 2: Get the Code
```bash
# Download the project
git clone https://github.com/AishwaryaChandel27/Vihaara--AI-powered-mental-wellness-and-healthcare-app
cd vihaara

# Install all required packages
npm install
```

### Step 3: Get Your AI Keys (Required for AI features)

#### Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your account
3. Click "API" in the sidebar
4. Click "Create new secret key"
5. Copy the key that starts with "sk-"

#### Get Google Gemini API Key  
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign up or log in with your Google account
3. Click "Get API key" button
4. Click "Create API key"
5. Copy the key

### Step 4: Configure Your Keys
Create a file called `.env` in the main project folder and add your keys:

```env
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
```

**Important**: Keep these keys private. Never share them or commit them to version control.

### Step 5: Start the Application
```bash
npm run dev
```

Open your browser and go to: `http://localhost:5000`

That's it! You now have your personal wellness sanctuary running.

## How to Use Vihaara

### Using the Journal
1. Click "Journal" in the sidebar
2. Write about your day, thoughts, or feelings
3. Click "Analyze Entry" to get AI insights about your emotional state
4. View all your entries and insights over time

### Tracking Your Mood
1. Go to "Mood Tracking" 
2. Select how you're feeling today
3. Add context about what influenced your mood
4. View patterns and get AI insights about your mood trends

### Chatting with AI
1. Open the "Chat" section
2. Talk to your AI companion about anything on your mind
3. Adjust the tone (friendly/clinical/spiritual) in Settings
4. Change response length if you prefer brief or detailed answers

### Getting Wellness Advice
1. Visit "Health Advice" for tips on sleep, nutrition, exercise
2. Check "Mental Peace" for mindfulness and stress relief techniques
3. See your daily wellness tip on the home page

### Managing Your Data
1. Go to Settings to export all your data
2. Clear your data anytime if needed
3. All data stays on your device - nothing is uploaded to servers

## Troubleshooting

### App Won't Start
- Make sure Node.js 20+ is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again
- Check that you're in the correct directory

### AI Features Not Working
- Verify your API keys are correctly set in the `.env` file
- Check that your OpenAI account has available credits
- Make sure your Gemini API key is active
- The app will show helpful messages if there are API issues

### Browser Issues
- Try refreshing the page
- Clear browser cache and localStorage
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Data Not Saving
- Check that your browser allows localStorage
- Disable private/incognito mode
- Make sure you have enough storage space

## Technical Details

### How the AI System Works
- Tries OpenAI GPT-4o first for the highest quality responses
- Automatically switches to Google Gemini if OpenAI has quota issues
- Falls back to helpful pre-written content if both AI services are unavailable
- Your conversations are processed but never stored on our servers

### Data Storage
- Everything stored in your browser's localStorage
- No databases, no cloud storage, no tracking
- Data export creates a JSON file you can save anywhere
- Clearing data removes everything permanently from your device

## Advanced Configuration

### Customizing AI Responses
In the Settings page, you can adjust:
- **AI Tone**: Choose friendly, clinical, or spiritual response styles
- **Response Length**: Brief, balanced, or detailed answers
- **Theme**: Switch between light and dark modes

### Development Setup
If you want to modify or contribute to Vihaara:

```bash
# Development mode with hot reloading
npm run dev

# Build for production
npm run build

# View project structure
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types
└── README.md        # This file
```

### API Endpoints
The app uses these internal endpoints:
- `/api/ai/chat` - AI conversations
- `/api/ai/analyze-journal` - Journal analysis
- `/api/ai/mood-insights` - Mood pattern analysis
- `/api/ai/health-advice` - Wellness guidance
- `/api/ai/mental-peace` - Mindfulness techniques
- `/api/ai/daily-tip` - Daily wellness tips

## Contributing

Want to help improve Vihaara? Here's how:

1. Fork the project on GitHub
2. Create a feature branch: `git checkout -b amazing-feature`
3. Make your changes and test them
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin amazing-feature`
6. Open a Pull Request

## Privacy & Security

Your privacy is our top priority:
- No user data is ever sent to our servers
- All personal information stays on your device
- AI processing is temporary and not stored
- No tracking, analytics, or data collection
- Open source code for complete transparency

## Support

Need help? Here are your options:
- Check the troubleshooting section above
- Open an issue on GitHub for bugs or feature requests
- Review the code - it's open source and well-documented

## License

This project is open source under the MIT License. You're free to use, modify, and distribute it.

---

**Vihaara** - Your personal, private sanctuary for mental wellness and emotional well-being.
