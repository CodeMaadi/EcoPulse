
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  groundingUrls?: Array<{ uri: string; title: string }>;
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
