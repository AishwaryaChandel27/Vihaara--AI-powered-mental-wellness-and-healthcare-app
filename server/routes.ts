import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  getJournalInsight, 
  getMoodInsight, 
  getChatResponse, 
  getHealthAdviceContent, 
  getMentalPeaceTechnique, 
  getDailyTip 
} from "./fallback-content";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Google Gemini client
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Check which AI services are available
const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
const hasGemini = Boolean(process.env.GEMINI_API_KEY);

if (!hasOpenAI && !hasGemini) {
  console.warn("WARNING: No AI API keys configured. Using fallback content only.");
} else if (!hasOpenAI) {
  console.log("Using Google Gemini AI");
} else if (!hasGemini) {
  console.log("Using OpenAI GPT-4o");
} else {
  console.log("Using OpenAI GPT-4o with Gemini AI fallback");
}

// AI service calling function with fallback
async function callAIService(prompt: string, systemMessage: string, useJSON = false): Promise<string> {
  // Try OpenAI first if available
  if (hasOpenAI) {
    try {
      const messages = [
        { role: "system" as const, content: systemMessage },
        { role: "user" as const, content: prompt }
      ];
      
      const requestOptions: any = {
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages
      };
      
      if (useJSON) {
        requestOptions.response_format = { type: "json_object" };
      }
      
      const response = await openai.chat.completions.create(requestOptions);
      return response.choices[0].message.content || '';
    } catch (error: any) {
      console.log("OpenAI failed, trying Gemini...", error.message);
      // Fall through to try Gemini
    }
  }
  
  // Try Gemini if OpenAI failed or isn't available
  if (hasGemini && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${systemMessage}\n\nUser: ${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text() || '';
    } catch (error: any) {
      console.log("Gemini also failed:", error.message);
    }
  }
  
  // If both fail, throw error to use fallback content
  throw new Error("All AI services unavailable");
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

      const systemMessage = "You are an empathetic wellness assistant analyzing a journal entry. Extract emotional themes, identify potential mood states, and provide brief, supportive insights that might help the user. Respond in JSON format with 'insights' (string) and 'tags' (array of 2-3 emotional themes as single words).";
      
      const aiResponse = await callAIService(content, systemMessage, true);
      
      let result;
      try {
        result = JSON.parse(aiResponse);
      } catch {
        // If JSON parsing fails, create a structured response
        result = {
          insights: aiResponse || "Your journal entry shows thoughtful reflection on your experiences.",
          tags: ["reflection", "mindfulness", "self-awareness"]
        };
      }

      return res.json({
        insights: result.insights || '',
        tags: result.tags || ["reflection", "mindfulness", "self-awareness"]
      });
    } catch (error: any) {
      console.error("Error analyzing journal:", error);
      
      return res.json({
        insights: getJournalInsight(),
        tags: ["reflection", "mindfulness", "self-awareness"]
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

      const systemMessage = "You are an empathetic wellness assistant analyzing mood entries. Based on the provided mood data, identify patterns and provide supportive, helpful insights. Keep your response concise (max 2-3 sentences). Respond in JSON format with an 'insights' field containing your analysis.";
      
      const aiResponse = await callAIService(JSON.stringify(entries), systemMessage, true);
      
      let result;
      try {
        result = JSON.parse(aiResponse);
      } catch {
        result = { insights: aiResponse || "Your mood patterns show important insights about your well-being journey." };
      }

      return res.json({
        insights: result.insights || ''
      });
    } catch (error: any) {
      console.error("Error generating mood insights:", error);
      
      return res.json({
        insights: getMoodInsight()
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

      const systemMessage = `You are Vihaara AI, a mental wellness assistant. ${toneInstruction} ${lengthInstruction} Always prioritize user well-being and safety. For serious mental health concerns, suggest seeking professional help.`;

      // Get the last user message for the prompt
      const lastMessage = messages[messages.length - 1];
      const conversationContext = messages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = conversationContext ? `${conversationContext}\n\nuser: ${lastMessage.content}` : lastMessage.content;

      const aiResponse = await callAIService(prompt, systemMessage);

      return res.json({
        response: aiResponse || 'I apologize, but I could not generate a response at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating chat response:", error);
      
      return res.json({
        response: getChatResponse(req.body.tone || 'friendly')
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

      const systemMessage = `You are Vihaara AI, a wellness assistant. ${toneInstruction} Provide practical, evidence-based advice about ${categoryPrompt}. Give 3-5 actionable tips formatted with bullet points. Each tip should have a brief explanation. Respond in a clear, helpful manner.`;
      const prompt = `I would like some advice about ${categoryPrompt}. What are some practical tips I can incorporate into my daily life?`;
      
      const aiResponse = await callAIService(prompt, systemMessage);

      return res.json({
        advice: aiResponse || 'I apologize, but I could not generate health advice at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating health advice:", error);
      
      return res.json({
        advice: getHealthAdviceContent(req.body.category || 'general')
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

      const systemMessage = `You are Vihaara AI, a mental wellness assistant. ${toneInstruction} Provide a practical technique for ${categoryPrompt}. Include step-by-step instructions on how to practice it, when to use it, and what benefits to expect. Make the technique accessible for beginners. Use paragraphs and bullet points for clear formatting.`;
      const prompt = `I would like to learn a technique for ${categoryPrompt}. Can you share a practice I could try today?`;
      
      const aiResponse = await callAIService(prompt, systemMessage);

      return res.json({
        technique: aiResponse || 'I apologize, but I could not generate a mental peace technique at this time. Please try again.'
      });
    } catch (error: any) {
      console.error("Error generating mental peace technique:", error);
      
      return res.json({
        technique: getMentalPeaceTechnique(req.body.category || 'mindfulness')
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

      const systemMessage = `You are Vihaara AI, a mental wellness assistant. ${toneInstruction} Generate a single-sentence daily wellness tip that is practical, positive, and actionable. Focus on mental health, mindfulness, stress reduction, or emotional well-being. Respond in JSON format with a 'tip' field.`;
      
      const aiResponse = await callAIService("Generate today's wellness tip.", systemMessage, true);
      
      let result;
      try {
        result = JSON.parse(aiResponse);
      } catch {
        result = { tip: aiResponse || 'Take a moment to breathe deeply and center yourself.' };
      }

      return res.json({
        tip: result.tip || 'Take a moment to breathe deeply and center yourself.'
      });
    } catch (error: any) {
      console.error("Error generating daily tip:", error);
      
      return res.json({
        tip: getDailyTip()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}