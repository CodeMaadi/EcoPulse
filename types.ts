
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  groundingUrls?: Array<{ uri: string; title: string }>;
}

export interface UserProfile {
  name: string;
  age: string;
  favColor: string;
  favFood: string;
  favAnimal: string;
  pronouns: string;
  avatarIcon: string;
}

// UserAvatarData defines the configuration for the SVG-based avatar rendering system
export interface UserAvatarData {
  skinColor: string;
  hairStyle: 'bald' | 'short' | 'long' | 'spiky' | 'curly';
  hairColor: string;
  clothingColor: string;
  expression: 'happy' | 'neutral';
}

export interface EcoMission {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Waste' | 'Energy' | 'Water' | 'Food';
  completed: boolean;
  coinReward: number;
}

export interface ImpactData {
  name: string;
  savings: number;
  target: number;
}

export type EcoLevel = {
  rank: number;
  name: string;
  cost: number;
  icon: string;
};
