
export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completions: HabitCompletion[];
  createdAt: Date;
  color: string;
  icon: string;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  count: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: Date;
  isPremium: boolean;
  avatar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
  category: 'streak' | 'completion' | 'consistency' | 'milestone';
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'mindfulness'
  | 'learning'
  | 'social'
  | 'creativity'
  | 'finance';

export type HabitFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly';

export interface Stats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
  weeklyProgress: number;
}
