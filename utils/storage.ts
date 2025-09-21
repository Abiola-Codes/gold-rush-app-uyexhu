
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion, User } from '../types';

const STORAGE_KEYS = {
  HABITS: '@habitflow_habits',
  COMPLETIONS: '@habitflow_completions',
  USER: '@habitflow_user',
  ONBOARDING: '@habitflow_onboarding',
} as const;

export class StorageService {
  // User methods
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      console.log('User saved to storage');
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async loadUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData);
        // Convert date strings back to Date objects
        user.joinedAt = new Date(user.joinedAt);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  }

  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      console.log('User cleared from storage');
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  }

  static async initializeDefaultUser(): Promise<User> {
    const defaultUser: User = {
      id: `user_${Date.now()}`,
      name: 'HabitFlow User',
      email: '',
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: new Date(),
      isPremium: false,
    };

    await this.saveUser(defaultUser);
    return defaultUser;
  }

  // Habits methods
  static async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      console.log(`Saved ${habits.length} habits to storage`);
    } catch (error) {
      console.error('Error saving habits:', error);
      throw error;
    }
  }

  static async loadHabits(): Promise<Habit[]> {
    try {
      const habitsData = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      if (habitsData) {
        const habits = JSON.parse(habitsData);
        // Convert date strings back to Date objects
        return habits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          completions: habit.completions.map((completion: any) => ({
            ...completion,
            completedAt: new Date(completion.completedAt),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  }

  // Completions methods
  static async saveCompletions(completions: HabitCompletion[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
      console.log(`Saved ${completions.length} completions to storage`);
    } catch (error) {
      console.error('Error saving completions:', error);
      throw error;
    }
  }

  static async loadCompletions(): Promise<HabitCompletion[]> {
    try {
      const completionsData = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      if (completionsData) {
        const completions = JSON.parse(completionsData);
        // Convert date strings back to Date objects
        return completions.map((completion: any) => ({
          ...completion,
          completedAt: new Date(completion.completedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading completions:', error);
      return [];
    }
  }

  // Onboarding methods
  static async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
      console.log('Onboarding marked as complete');
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
      throw error;
    }
  }

  static async isOnboardingComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HABITS,
        STORAGE_KEYS.COMPLETIONS,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ONBOARDING,
      ]);
      console.log('All data cleared from storage');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get storage info
  static async getStorageInfo(): Promise<{
    habitsCount: number;
    completionsCount: number;
    hasUser: boolean;
    onboardingComplete: boolean;
  }> {
    try {
      const [habits, completions, user, onboarding] = await Promise.all([
        this.loadHabits(),
        this.loadCompletions(),
        this.loadUser(),
        this.isOnboardingComplete(),
      ]);

      return {
        habitsCount: habits.length,
        completionsCount: completions.length,
        hasUser: !!user,
        onboardingComplete: onboarding,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        habitsCount: 0,
        completionsCount: 0,
        hasUser: false,
        onboardingComplete: false,
      };
    }
  }
}
