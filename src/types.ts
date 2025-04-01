// src/types.ts
export type MoodType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'tired'
  | 'excited'
  | 'silly'
  | 'anxious'
  | 'peaceful'
  | 'confident'
  | 'curious';

export interface MoodData {
  message: string;
  joke: string;
  action: string;
  color: string;
  emoji: string;
  soundEffect: string;
}

export type MoodResponses = Record<MoodType, MoodData>;

export interface MoodStats {
  mood: MoodType;
  timestamp: string;
}