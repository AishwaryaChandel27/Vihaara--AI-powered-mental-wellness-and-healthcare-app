import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
  console.error("WARNING: OPENAI_API_KEY is not set. AI features will not work.");
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AI routes for MindMate

  // Journal analysis endpoint
  app.post("/api/ai/analyze-journal", async (req, res) => {
    try {
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Journal content is required" });
      }

      // Call OpenAI API for journal analysis
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: [
          {
            role: "system",
            content: "You are an empathetic wellness assistant analyzing a journal entry. Extract emotional themes, identify potential mood states, and provide brief, supportive insights that might help the user. Respond in JSON format with 'insights' (string) and 'tags' (array of 2-3 emotional themes as single words)."
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return res.json({
        insights: result.insights || '',
        tags: result.tags || []
      });
    } catch (error: any) {
      console.error("Error analyzing journal:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          insights: "Your journal entry has been saved. AI analysis is temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later.",
          tags: ["reflection", "mindfulness"]
        });
      }
      
      return res.json({
        insights: "Your journal entry has been saved successfully. AI analysis is temporarily unavailable.",
        tags: ["reflection"]
      });
    }
  });

  // Mood insights endpoint
  app.post("/api/ai/mood-insights", async (req, res) => {
    try {
      const { entries } = req.body;

      if (!entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: "Mood entries are required" });
      }

      // Call OpenAI API for mood analysis
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: [
          {
            role: "system",
            content: "You are an empathetic wellness assistant analyzing mood entries. Based on the provided mood data, identify patterns and provide supportive, helpful insights. Keep your response concise (max 2-3 sentences). Respond in JSON format with an 'insights' field containing your analysis."
          },
          {
            role: "user",
            content: JSON.stringify(entries)
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return res.json({
        insights: result.insights || ''
      });
    } catch (error: any) {
      console.error("Error generating mood insights:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          insights: "Your mood data has been saved. AI insights are temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later."
        });
      }
      
      return res.json({
        insights: "Your mood data has been saved successfully. AI insights are temporarily unavailable."
      });
    }
  });

  // Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, tone, responseLength } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Chat messages are required" });
      }

      let lengthInstruction = "Keep your responses balanced in length.";
      if (responseLength === 1) {
        lengthInstruction = "Keep your responses brief and concise.";
      } else if (responseLength === 3) {
        lengthInstruction = "Provide detailed, thorough responses.";
      }

      let toneInstruction = "Use a friendly, conversational tone.";
      switch (tone) {
        case 'clinical':
          toneInstruction = "Use a clinical, objective tone with medical accuracy. Focus on evidence-based practices and healthcare information.";
          break;
        case 'spiritual':
          toneInstruction = "Use a mindful, spiritual tone that emphasizes inner peace, meditation, and harmony with nature. Include concepts of mindfulness and spiritual well-being.";
          break;
      }

      // Add system message for wellness context
      const systemMessage = {
        role: "system",
        content: `You are MindMate AI, a mental wellness assistant. ${toneInstruction} ${lengthInstruction} Always prioritize user well-being and safety. For serious mental health concerns, suggest seeking professional help.`
      };

      // Format the messages array for OpenAI
      const formattedMessages = [systemMessage, ...messages];

      // Call OpenAI API for chat response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: formattedMessages
      });

      return res.json({
        response: response.choices[0].message.content || 'I apologize, but I could not generate a response at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating chat response:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          response: "I'm temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later. In the meantime, feel free to use the journal and mood tracking features!"
        });
      }
      
      return res.json({
        response: "I'm temporarily unavailable right now. Please try again in a few moments, or use the other wellness features in the app."
      });
    }
  });

  // Health advice endpoint
  app.post("/api/ai/health-advice", async (req, res) => {
    try {
      const { category, tone } = req.body;

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      let toneInstruction = "Use a friendly, conversational tone.";
      switch (tone) {
        case 'clinical':
          toneInstruction = "Use a clinical, objective tone with medical accuracy. Focus on evidence-based practices and healthcare information.";
          break;
        case 'spiritual':
          toneInstruction = "Use a mindful, spiritual tone that emphasizes inner peace, meditation, and harmony with nature. Include concepts of mindfulness and spiritual well-being.";
          break;
      }

      let categoryPrompt = "";
      switch (category) {
        case 'general':
          categoryPrompt = "general wellness and overall physical health";
          break;
        case 'diet':
          categoryPrompt = "nutrition, healthy eating habits, and dietary best practices";
          break;
        case 'sleep':
          categoryPrompt = "sleep hygiene, quality rest, and healthy sleep patterns";
          break;
        case 'hydration':
          categoryPrompt = "proper hydration, water intake, and fluid balance";
          break;
        case 'posture':
          categoryPrompt = "proper posture, ergonomics, and body alignment";
          break;
        default:
          categoryPrompt = "general wellness and physical health";
      }

      // Call OpenAI API for health advice
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: [
          {
            role: "system",
            content: `You are MindMate AI, a wellness assistant. ${toneInstruction} Provide practical, evidence-based advice about ${categoryPrompt}. Give 3-5 actionable tips formatted with bullet points. Each tip should have a brief explanation. Respond in a clear, helpful manner.`
          },
          {
            role: "user",
            content: `I would like some advice about ${categoryPrompt}. What are some practical tips I can incorporate into my daily life?`
          }
        ]
      });

      return res.json({
        advice: response.choices[0].message.content || 'I apologize, but I could not generate health advice at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating health advice:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          advice: "AI health advice is temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later. For immediate health concerns, please consult with a healthcare professional."
        });
      }
      
      return res.json({
        advice: "AI health advice is temporarily unavailable. Please consult with a healthcare professional for personalized guidance."
      });
    }
  });

  // Mental peace techniques endpoint
  app.post("/api/ai/mental-peace", async (req, res) => {
    try {
      const { category, tone } = req.body;

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      let toneInstruction = "Use a friendly, conversational tone.";
      switch (tone) {
        case 'clinical':
          toneInstruction = "Use a clinical, objective tone with medical accuracy. Focus on evidence-based practices and healthcare information.";
          break;
        case 'spiritual':
          toneInstruction = "Use a mindful, spiritual tone that emphasizes inner peace, meditation, and harmony with nature. Include concepts of mindfulness and spiritual well-being.";
          break;
      }

      let categoryPrompt = "";
      switch (category) {
        case 'mindfulness':
          categoryPrompt = "mindfulness and present-moment awareness practices";
          break;
        case 'stress':
          categoryPrompt = "stress reduction and anxiety management techniques";
          break;
        case 'breathing':
          categoryPrompt = "breathing exercises for relaxation and centering";
          break;
        case 'affirmations':
          categoryPrompt = "positive affirmations and self-talk for mental well-being";
          break;
        case 'meditation':
          categoryPrompt = "meditation practices for inner peace and mental clarity";
          break;
        default:
          categoryPrompt = "mindfulness and mental well-being";
      }

      // Call OpenAI API for mental peace technique
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: [
          {
            role: "system",
            content: `You are MindMate AI, a mental wellness assistant. ${toneInstruction} Provide a practical technique for ${categoryPrompt}. Include step-by-step instructions on how to practice it, when to use it, and what benefits to expect. Make the technique accessible for beginners. Use paragraphs and bullet points for clear formatting.`
          },
          {
            role: "user",
            content: `I would like to learn a technique for ${categoryPrompt}. Can you share a practice I could try today?`
          }
        ]
      });

      return res.json({
        technique: response.choices[0].message.content || 'I apologize, but I could not generate a mental peace technique at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating mental peace technique:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          technique: "AI-generated techniques are temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later. In the meantime, try this simple breathing exercise: Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts. Repeat 5 times."
        });
      }
      
      return res.json({
        technique: "AI-generated techniques are temporarily unavailable. Try this simple mindfulness exercise: Take 5 deep breaths, focusing only on the sensation of breathing."
      });
    }
  });

  // Daily tip endpoint
  app.post("/api/ai/daily-tip", async (req, res) => {
    try {
      const { tone } = req.body;

      let toneInstruction = "Use a friendly, conversational tone.";
      switch (tone) {
        case 'clinical':
          toneInstruction = "Use a clinical, objective tone with medical accuracy. Focus on evidence-based practices and healthcare information.";
          break;
        case 'spiritual':
          toneInstruction = "Use a mindful, spiritual tone that emphasizes inner peace, meditation, and harmony with nature. Include concepts of mindfulness and spiritual well-being.";
          break;
      }

      // Call OpenAI API for daily tip
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo model
        messages: [
          {
            role: "system",
            content: `You are MindMate AI, a mental wellness assistant. ${toneInstruction} Generate a single-sentence daily wellness tip that is practical, positive, and actionable. Focus on mental health, mindfulness, stress reduction, or emotional well-being. Respond in JSON format with a 'tip' field.`
          },
          {
            role: "user",
            content: "Generate today's wellness tip."
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return res.json({
        tip: result.tip || 'Take a moment to breathe deeply and center yourself.'
      });
    } catch (error: any) {
      console.error("Error generating daily tip:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.json({
          tip: "AI tips are temporarily unavailable due to API quota limits. Please check your OpenAI account billing or try again later."
        });
      }
      
      return res.json({
        tip: "Take a moment to breathe deeply and center yourself."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}