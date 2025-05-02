import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "DEMO_KEY" 
});

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
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    } catch (error) {
      console.error("Error analyzing journal:", error);
      res.status(500).json({ error: "Failed to analyze journal entry" });
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
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    } catch (error) {
      console.error("Error generating mood insights:", error);
      res.status(500).json({ error: "Failed to generate mood insights" });
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
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: formattedMessages
      });
      
      return res.json({
        response: response.choices[0].message.content || 'I apologize, but I could not generate a response at this time. Please try again.'
      });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ error: "Failed to generate chat response" });
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
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    } catch (error) {
      console.error("Error generating daily tip:", error);
      res.status(500).json({ error: "Failed to generate daily tip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
