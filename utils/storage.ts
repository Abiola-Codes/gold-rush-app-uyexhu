
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion, User } from '../types';

const STORAGE_KEYS = {
  HABITS: '@habitflow_habits',
  COMPLETIONS: '@habitflow_completions',
  USER: '@habitflow_user',
};

export const StorageService = {
  // Habits
  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      console.log('Saving habits to storage:', habits.length);
      const serializedHabits = JSON.stringify(habits.map(habit => ({
        ...habit,
        createdAt: habit.createdAt.toISOString(),
      })));
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, serializedHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  async loadHabits(): Promise<Habit[]> {
    try {
      console.log('Loading habits from storage');
      const serializedHabits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      if (!serializedHabits) {
        console.log('No habits found in storage, returning empty array');
        return [];
      }
      
      const habits = JSON.parse(serializedHabits);
      return habits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
      }));
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  // Completions
  async saveCompletions(completions: HabitCompletion[]): Promise<void> {
    try {
      console.log('Saving completions to storage:', completions.length);
      const serializedCompletions = JSON.stringify(completions.map(completion => ({
        ...completion,
        completedAt: completion.completedAt.toISOString(),
      })));
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETIONS, serializedCompletions);
    } catch (error) {
      console.error('Error saving completions:', error);
    }
  },

  async loadCompletions(): Promise<HabitCompletion[]> {
    try {
      console.log('Loading completions from storage');
      const serializedCompletions = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      if (!serializedCompletions) {
        console.log('No completions found in storage, returning empty array');
        return [];
      }
      
      const completions = JSON.parse(serializedCompletions);
      return completions.map((completion: any) => ({
        ...completion,
        completedAt: new Date(completion.completedAt),
      }));
    } catch (error) {
      console.error('Error loading completions:', error);
      return [];
    }
  },

  // User
  async saveUser(user: User): Promise<void> {
    try {
      console.log('Saving user to storage:', user.name);
      const serializedUser = JSON.stringify({
        ...user,
        joinedAt: user.joinedAt.toISOString(),
      });
      await AsyncStorage.setItem(STORAGE_KEYS.USER, serializedUser);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async loadUser(): Promise<User | null> {
    try {
      console.log('Loading user from storage');
      const serializedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (!serializedUser) {
        console.log('No user found in storage');
        return null;
      }
      
      const user = JSON.parse(serializedUser);
      return {
        ...user,
        joinedAt: new Date(user.joinedAt),
      };
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  // Initialize default user if none exists
  async initializeDefaultUser(): Promise<User> {
    console.log('Initializing default user');
    const defaultUser: User = {
      id: Date.now().toString(),
      name: 'HabitFlow User',
      email: 'user@habitflow.com',
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: new Date(),
      isPremium: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    };
    
    await this.saveUser(defaultUser);
    return defaultUser;
  },

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      console.log('Clearing all storage data');
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HABITS,
        STORAGE_KEYS.COMPLETIONS,
        STORAGE_KEYS.USER,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
