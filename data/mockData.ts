
import { Habit, User, Achievement, HabitCompletion } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  level: 12,
  totalPoints: 2450,
  currentStreak: 7,
  longestStreak: 23,
  joinedAt: new Date('2024-01-15'),
  isPremium: false,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
};

export const habitCategories = [
  { id: 'health', name: 'Health', icon: 'heart', color: '#EF4444' },
  { id: 'fitness', name: 'Fitness', icon: 'fitness', color: '#F59E0B' },
  { id: 'productivity', name: 'Productivity', icon: 'briefcase', color: '#8B5CF6' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf', color: '#10B981' },
  { id: 'learning', name: 'Learning', icon: 'book', color: '#3B82F6' },
  { id: 'social', name: 'Social', icon: 'people', color: '#EC4899' },
  { id: 'creativity', name: 'Creativity', icon: 'brush', color: '#F97316' },
  { id: 'finance', name: 'Finance', icon: 'card', color: '#059669' },
];

export const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    category: 'mindfulness',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 7,
    longestStreak: 15,
    completions: [],
    createdAt: new Date('2024-01-01'),
    color: '#10B981',
    icon: 'leaf',
    isActive: true,
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '2',
    title: 'Read 30 Pages',
    description: 'Read at least 30 pages of a book',
    category: 'learning',
    frequency: 'daily',
    targetCount: 30,
    currentStreak: 5,
    longestStreak: 12,
    completions: [],
    createdAt: new Date('2024-01-05'),
    color: '#3B82F6',
    icon: 'book',
    isActive: true,
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '3',
    title: 'Workout Session',
    description: '45 minutes of exercise',
    category: 'fitness',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 3,
    longestStreak: 8,
    completions: [],
    createdAt: new Date('2024-01-10'),
    color: '#F59E0B',
    icon: 'fitness',
    isActive: true,
    difficulty: 'hard',
    points: 25,
  },
  {
    id: '4',
    title: 'Drink Water',
    description: 'Drink 8 glasses of water',
    category: 'health',
    frequency: 'daily',
    targetCount: 8,
    currentStreak: 12,
    longestStreak: 20,
    completions: [],
    createdAt: new Date('2023-12-20'),
    color: '#06B6D4',
    icon: 'water',
    isActive: true,
    difficulty: 'easy',
    points: 5,
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first habit',
    icon: 'trophy',
    points: 50,
    category: 'milestone',
    unlockedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    points: 100,
    category: 'streak',
    unlockedAt: new Date('2024-01-07'),
  },
  {
    id: '3',
    title: 'Consistency King',
    description: 'Complete 100 habits',
    icon: 'star',
    points: 200,
    category: 'completion',
  },
  {
    id: '4',
    title: 'Habit Master',
    description: 'Maintain a 30-day streak',
    icon: 'medal',
    points: 500,
    category: 'streak',
  },
];

// Generate some mock completions for today
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const mockCompletions: HabitCompletion[] = [
  {
    id: '1',
    habitId: '1',
    completedAt: today,
    count: 1,
    notes: 'Great morning session!',
  },
  {
    id: '2',
    habitId: '4',
    completedAt: today,
    count: 6,
  },
  {
    id: '3',
    habitId: '1',
    completedAt: yesterday,
    count: 1,
  },
  {
    id: '4',
    habitId: '2',
    completedAt: yesterday,
    count: 35,
  },
];
