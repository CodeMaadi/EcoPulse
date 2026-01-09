
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile } from "../types";

// Always use the process.env.API_KEY directly as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEcoAdvice = async (
  prompt: string, 
  userProfile: UserProfile,
  image?: string,
  location?: { lat: number; lng: number },
  isKidMode: boolean = false
) => {
  const ai = getAI();
  // Use gemini-flash-latest (2.5) for maps grounding when location is provided, otherwise gemini-3-flash-preview.
  const model = location ? 'gemini-flash-latest' : 'gemini-3-flash-preview';

  const parts: any[] = [{ text: prompt }];
  if (image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: image.split(',')[1],
      }
    });
  }

  const personaInfo = `The user's name is ${userProfile.name}, they are ${userProfile.age} years old and use ${userProfile.pronouns} pronouns. Their favorite color is ${userProfile.favColor}, their favorite food is ${userProfile.favFood}, and their favorite animal is ${userProfile.favAnimal}.`;

  const systemInstruction = isKidMode 
    ? `You are Leafy, a super friendly and bubbly robot friend for kids (ages 5-10). ${personaInfo} CRITICAL RULE: Always mention the user's name occasionally and respect their pronouns (${userProfile.pronouns}). Try to relate environmental tips to their favorite color, food, or animal. Always give a very short answer first (1 or 2 simple sentences). Use very simple words, lots of emojis, and keep it happy!`
    : `You are EcoPulse, a world-class environmental expert. ${personaInfo} CRITICAL RULE: Use the user's profile to make your advice more relatable (e.g., mention their name, or how certain climate issues affect their favorite animal). Respect their pronouns (${userProfile.pronouns}). Your initial response must be extremely concise (maximum 2 sentences). Provide the direct answer immediately. Only provide a detailed scientific explanation if the user asks.`;

  const config: any = {
    systemInstruction,
    // Google Maps grounding is used alongside search when location is provided.
    tools: location ? [{ googleMaps: {} }, { googleSearch: {} }] : [{ googleSearch: {} }]
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
    // response.text is a getter property, used correctly here.
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
  // Use gemini-flash-latest (2.5) for tasks requiring location-based grounding.
  const model = location ? 'gemini-flash-latest' : 'gemini-3-flash-preview';

  const prompt = isKidMode 
    ? `Find 3-4 super cool teams that help "${query}" ${location ? 'near this location' : 'globally'}. Explain what they do in very simple words for a 7-year-old. Focus on groups that kids can follow or learn from, like animal shelters or tree planting groups.`
    : `Find reputable environmental organizations or charities related to "${query}" ${location ? 'near this location' : 'globally'}. For each, provide a short 2-sentence description of their mission. Focus on organizations that are currently active and well-regarded.`;

  const config: any = {
    systemInstruction: isKidMode
      ? "You are Leafy, a friendly robot helping kids find 'Earth Teams'. Use simple language, talk about 'helping animals' or 'planting seeds'. Always include the website link. Use Google Search."
      : "You are a green directory assistant. Your job is to help people find credible environmental organizations. Always include URLs for the organizations you find. Use Google Search to ensure the data is current.",
    // Combine googleMaps and googleSearch when location is available.
    tools: location ? [{ googleMaps: {} }, { googleSearch: {} }] : [{ googleSearch: {} }]
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
  
  // Use gemini-3-pro-preview for complex reasoning and high-token generation tasks.
  const model = isUltimate ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const prompt = isKidMode
    ? `Generate ${count} fun and very simple environmental quiz questions for a child. ${isUltimate ? 'Cover MANY different topics like recycling, animals, saving water, and cleaning up parks.' : `Focus on the topic of "${topic}".`} Each question must be unique. Include 3 options, the index of the correct one (0-based), and a short fun explanation.`
    : `Generate ${count} challenging environmental quiz questions for an adult. ${isUltimate ? 'Provide a massive marathon test covering a wide range of topics including climate policy, circular economy, renewable tech, marine biology, and biodiversity.' : `Focus on the specific topic of "${topic}".`} Each question must be scientifically accurate and unique. Include 4 options, the index of the correct one (0-based), and a detailed scientific explanation.`;

  const response = await ai.models.generateContent({
    model,
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
