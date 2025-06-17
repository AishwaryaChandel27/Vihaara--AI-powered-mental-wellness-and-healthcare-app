// Fallback wellness content when AI is unavailable
export const fallbackContent = {
  journalInsights: [
    "Reflecting on your thoughts and feelings is a powerful step toward self-awareness and mental clarity.",
    "Writing down your experiences helps process emotions and can reveal patterns in your thinking.",
    "Regular journaling has been shown to reduce stress and improve emotional well-being.",
    "Your willingness to document your thoughts shows commitment to personal growth and mindfulness.",
    "Taking time to reflect through writing can help you better understand your emotional responses."
  ],

  moodInsights: [
    "Tracking your mood helps identify patterns and triggers that affect your well-being.",
    "Being aware of your emotional states is the first step toward managing them effectively.",
    "Regular mood monitoring can help you recognize what activities or situations impact your mental health.",
    "Your commitment to tracking emotions shows self-awareness and dedication to mental wellness.",
    "Understanding your mood patterns can help you make informed decisions about self-care."
  ],

  chatResponses: {
    friendly: [
      "I'm here to support your wellness journey! While AI features are temporarily limited, you can still use the journal and mood tracking to maintain your mental health practices.",
      "Your mental health matters! Consider taking a few deep breaths, going for a walk, or writing in your journal to center yourself.",
      "Remember that small daily actions toward wellness can make a big difference over time. How can you care for yourself today?",
      "Taking time for self-reflection and mood awareness shows real commitment to your well-being. Keep up the great work!",
      "Even when technology has limitations, your inner wisdom and self-care practices remain powerful tools for wellness."
    ],
    clinical: [
      "Consistent self-monitoring through journaling and mood tracking provides valuable data for understanding your mental health patterns.",
      "Evidence-based wellness practices include regular reflection, mindfulness, and emotional awareness - all available through this app's core features.",
      "Maintaining routine wellness practices, even during technical limitations, demonstrates healthy coping strategies and resilience.",
      "Self-reported mood and journal data can be valuable information to discuss with healthcare providers if needed.",
      "Regular engagement with wellness tools supports the development of healthy habits and emotional regulation skills."
    ],
    spiritual: [
      "Your journey of self-discovery through journaling and reflection connects you with your inner wisdom and peace.",
      "Each moment of mindful awareness, whether through mood tracking or writing, brings you closer to your authentic self.",
      "The practice of regular reflection creates space for gratitude, growth, and deeper understanding of your emotional landscape.",
      "Trust in your ability to find peace and clarity through the simple acts of writing and self-awareness.",
      "Your commitment to wellness practices nurtures both your mind and spirit, creating harmony within yourself."
    ]
  },

  healthAdvice: {
    general: "• Stay hydrated by drinking 8 glasses of water daily\n• Aim for 7-9 hours of quality sleep each night\n• Include 30 minutes of physical activity in your routine\n• Practice stress management through deep breathing or meditation\n• Maintain regular meals with balanced nutrition",
    diet: "• Focus on whole foods: fruits, vegetables, lean proteins, and whole grains\n• Limit processed foods and added sugars\n• Practice portion control and mindful eating\n• Include healthy fats like avocados, nuts, and olive oil\n• Stay consistent with meal timing to support metabolism",
    sleep: "• Establish a consistent bedtime routine\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens 1 hour before bedtime\n• Limit caffeine intake after 2 PM\n• Create a relaxing pre-sleep ritual like reading or gentle stretching",
    hydration: "• Start your day with a glass of water\n• Carry a water bottle to track intake\n• Eat water-rich foods like fruits and vegetables\n• Set reminders to drink water throughout the day\n• Monitor urine color as a hydration indicator",
    posture: "• Take breaks every 30 minutes when sitting\n• Keep your computer screen at eye level\n• Strengthen your core muscles with regular exercises\n• Practice shoulder blade squeezes throughout the day\n• Be mindful of your posture during daily activities"
  },

  mentalPeaceTechniques: {
    mindfulness: "**Simple Mindfulness Practice**\n\n1. Find a comfortable position and close your eyes\n2. Focus on your breath without trying to change it\n3. When your mind wanders, gently return attention to breathing\n4. Start with 5 minutes and gradually increase duration\n5. Practice daily, preferably at the same time\n\n**Benefits:** Reduces stress, improves focus, and increases emotional awareness.",
    
    stress: "**4-7-8 Breathing Technique**\n\n1. Exhale completely through your mouth\n2. Close your mouth and inhale through nose for 4 counts\n3. Hold your breath for 7 counts\n4. Exhale through mouth for 8 counts\n5. Repeat 3-4 times\n\n**When to use:** During stressful moments, before bed, or when feeling anxious.",
    
    breathing: "**Box Breathing Exercise**\n\n1. Inhale for 4 counts\n2. Hold breath for 4 counts\n3. Exhale for 4 counts\n4. Hold empty for 4 counts\n5. Repeat for 5-10 cycles\n\n**Benefits:** Calms the nervous system and improves concentration.",
    
    affirmations: "**Daily Positive Affirmations**\n\n• I am capable of handling whatever comes my way\n• I choose peace and calm in this moment\n• I am worthy of love, respect, and happiness\n• I trust in my ability to make good decisions\n• I am growing stronger with each challenge I face\n\n**Practice:** Repeat these affirmations morning and evening, speaking them aloud with intention.",
    
    meditation: "**Simple Meditation Guide**\n\n1. Sit comfortably with your back straight\n2. Close your eyes and relax your body\n3. Focus on a word, phrase, or your breath\n4. When thoughts arise, acknowledge them and return to your focus\n5. Start with 10 minutes daily\n\n**Benefits:** Reduces anxiety, improves emotional regulation, and enhances self-awareness."
  },

  dailyTips: [
    "Take three deep breaths before starting any stressful task.",
    "Practice gratitude by writing down three things you're thankful for today.",
    "Step outside for a few minutes to connect with nature and fresh air.",
    "Drink a glass of water mindfully, focusing on the sensation and taste.",
    "Stretch your body gently to release tension and improve circulation.",
    "Send a kind message to someone you care about.",
    "Take a brief walk, even if it's just around your home or office.",
    "Practice the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
    "Set an intention for your day that focuses on kindness to yourself.",
    "Take a moment to appreciate something beautiful around you."
  ]
};

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getJournalInsight(): string {
  return getRandomItem(fallbackContent.journalInsights);
}

export function getMoodInsight(): string {
  return getRandomItem(fallbackContent.moodInsights);
}

export function getChatResponse(tone: string = 'friendly'): string {
  const responses = fallbackContent.chatResponses[tone as keyof typeof fallbackContent.chatResponses] || fallbackContent.chatResponses.friendly;
  return getRandomItem(responses);
}

export function getHealthAdviceContent(category: string): string {
  return fallbackContent.healthAdvice[category as keyof typeof fallbackContent.healthAdvice] || fallbackContent.healthAdvice.general;
}

export function getMentalPeaceTechnique(category: string): string {
  return fallbackContent.mentalPeaceTechniques[category as keyof typeof fallbackContent.mentalPeaceTechniques] || fallbackContent.mentalPeaceTechniques.mindfulness;
}

export function getDailyTip(): string {
  return getRandomItem(fallbackContent.dailyTips);
}