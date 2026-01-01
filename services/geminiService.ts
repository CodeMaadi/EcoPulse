
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getEcoAdvice = async (
  prompt: string, 
  image?: string,
  location?: { lat: number; lng: number },
  isKidMode: boolean = false
) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const parts: any[] = [{ text: prompt }];
  if (image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: image.split(',')[1],
      }
    });
  }

  const systemInstruction = isKidMode 
    ? "You are Leafy, a super friendly and bubbly robot friend for kids (ages 5-10). CRITICAL RULE: Always give a very short answer first (1 or 2 simple sentences). Only if the user asks for more details or says 'tell me more', you can provide a longer, fun story or explanation. Use very simple words, lots of emojis, and keep it happy! If they show an image, identify it quickly and wait for them to ask to learn more."
    : "You are EcoPulse, a world-class environmental expert. CRITICAL RULE: Your initial response must be extremely concise (maximum 2 sentences). Provide the direct answer immediately. Only provide a detailed scientific explanation, data, or long-form advice if the user explicitly asks follow-up questions like 'why?', 'tell me more', or 'elaborate'. If the user asks about local resources, find them via Google Search but keep the summary brief initially.";

  const config: any = {
    systemInstruction,
    tools: [{ googleSearch: {} }]
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config
  });

  return {
    text: response.text || "I'm sorry, I couldn't process that request.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

export const getEcoNews = async (isKidMode: boolean = false) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const prompt = isKidMode
    ? "Find 3 happy stories about animals or trees that were saved recently. Explain them like a bedtime story for a 6-year-old."
    : "What are the most significant and positive environmental news stories happening right now or in the last 7 days? Look for breakthroughs in renewable energy, major conservation wins, or significant climate policy changes. Provide a list of 4-5 items with a headline and a 2-sentence summary for each.";

  const config: any = {
    systemInstruction: isKidMode 
      ? "You are a storyteller for children. Tell happy stories about nature." 
      : "You are an environmental news curator. Focus on verified, current events from reputable sources. Use Google Search to get the absolute latest information. Group the news logically.",
    tools: [{ googleSearch: {} }]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config
  });

  return {
    text: response.text || "No news found at the moment.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

export const searchOrganizations = async (query: string, location?: { lat: number; lng: number }, isKidMode: boolean = false) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const prompt = isKidMode
    ? `Find 3 amazing groups that help animals or trees related to "${query}". Describe them in 1 very simple sentence each using words a 6-year-old would know. Make it sound like they are superheroes for nature!`
    : `Find reputable environmental organizations or charities related to "${query}" ${location ? 'near this location' : 'globally'}. For each, provide a short 2-sentence description of their mission. Focus on organizations that are currently active and well-regarded.`;

  const config: any = {
    systemInstruction: isKidMode 
      ? "You are Leafy, helping a child find nature heroes. Use lots of emojis and very simple, happy words. Only find groups that are safe and positive for children to learn about. Always include URLs."
      : "You are a green directory assistant. Your job is to help people find credible environmental organizations. Always include URLs for the organizations you find. Use Google Search to ensure the data is current.",
    tools: [{ googleSearch: {} }]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config
  });

  return {
    text: response.text || "No organizations found for this query.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

export const generateMissions = async (isKidMode: boolean = false): Promise<any[]> => {
  const ai = getAI();
  const prompt = isKidMode
    ? "Generate 5 super fun 'Eco-Quests' for a kid. Examples: 'Find a cool leaf', 'Turn off a light like a ninja', 'Ask a grown-up to recycle a bottle'. Include a title, description, category, and point value."
    : "Generate 5 daily environmental missions for a user. Include a title, short description, category (Waste, Energy, Water, or Food), and a point value (10-50).";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            points: { type: Type.NUMBER }
          },
          required: ["title", "description", "category", "points"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const generateQuizQuestions = async (topic: string, isKidMode: boolean = false, count: number = 5): Promise<any[]> => {
  const ai = getAI();
  const isUltimate = topic.toLowerCase().includes('ultimate');
  
  const prompt = isKidMode
    ? `Generate ${count} fun and very simple environmental quiz questions for a child. ${isUltimate ? 'Cover MANY different topics like recycling, animals, saving water, and cleaning up parks.' : `Focus on the topic of "${topic}".`} Each question must be unique. Include 3 options, the index of the correct one (0-based), and a short fun explanation.`
    : `Generate ${count} challenging environmental quiz questions for an adult. ${isUltimate ? 'Provide a massive marathon test covering a wide range of topics including climate policy, circular economy, renewable tech, marine biology, and biodiversity.' : `Focus on the specific topic of "${topic}".`} Each question must be scientifically accurate and unique. Include 4 options, the index of the correct one (0-based), and a detailed scientific explanation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};
