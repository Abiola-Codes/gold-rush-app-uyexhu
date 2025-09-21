
import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, Stats, User } from '../types';
import { StorageService } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export const useHabits = () => {
  const { user, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from storage when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    } else {
      // Clear data when not authenticated
      setHabits([]);
      setCompletions([]);
      setLoading(false);
      setInitialized(false);
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      console.log('Loading habits data for user:', user?.name);
      setLoading(true);
      
      const [loadedHabits, loadedCompletions] = await Promise.all([
        StorageService.loadHabits(),
        StorageService.loadCompletions(),
      ]);

      setHabits(loadedHabits);
      setCompletions(loadedCompletions);
      setInitialized(true);
      console.log(`Loaded ${loadedHabits.length} habits and ${loadedCompletions.length} completions`);
    } catch (error) {
      console.error('Error loading habits data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save habits whenever they change
  useEffect(() => {
    if (initialized && isAuthenticated && habits.length >= 0) {
      StorageService.saveHabits(habits);
    }
  }, [habits, initialized, isAuthenticated]);

  // Save completions whenever they change
  useEffect(() => {
    if (initialized && isAuthenticated && completions.length >= 0) {
      StorageService.saveCompletions(completions);
    }
  }, [completions, initialized, isAuthenticated]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak'>) => {
    if (!isAuthenticated || !user) {
      console.error('User not authenticated');
      return;
    }

    console.log('Adding new habit:', habitData.title);
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const completeHabit = async (habitId: string, count: number = 1, notes?: string) => {
    if (!isAuthenticated || !user) {
      console.error('User not authenticated');
      return;
    }

    console.log('Completing habit:', habitId, 'count:', count);
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      console.error('Habit not found:', habitId);
      return;
    }

    const completion: HabitCompletion = {
      id: Date.now().toString(),
      habitId,
      completedAt: new Date(),
      count,
      notes,
    };
    
    setCompletions(prev => [...prev, completion]);
    
    // Update habit streak
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newStreak = h.currentStreak + 1;
        const newLongestStreak = Math.max(h.longestStreak, newStreak);
        
        return {
          ...h,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
        };
      }
      return h;
    }));
  };

  const deleteHabit = async (habitId: string) => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    console.log('Deleting habit:', habitId);
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setCompletions(prev => prev.filter(completion => completion.habitId !== habitId));
  };

  const toggleHabitActive = async (habitId: string) => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    console.log('Toggling habit active status:', habitId);
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, isActive: !habit.isActive } : habit
    ));
  };

  const getTodayCompletions = () => {
    const today = new Date().toDateString();
    return completions.filter(completion => 
      completion.completedAt.toDateString() === today
    );
  };

  const getHabitProgress = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completed: 0, target: 0, percentage: 0 };

    const todayCompletions = getTodayCompletions();
    const habitCompletions = todayCompletions.filter(c => c.habitId === habitId);
    const completed = habitCompletions.reduce((sum, c) => sum + c.count, 0);
    
    return {
      completed,
      target: habit.targetCount,
      percentage: Math.min((completed / habit.targetCount) * 100, 100),
    };
  };

  const getWeeklyProgress = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekCompletions = completions.filter(completion => 
      completion.completedAt >= weekStart
    );

    const dailyProgress = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dayString = day.toDateString();
      
      const dayCompletions = weekCompletions.filter(c => 
        c.completedAt.toDateString() === dayString
      );
      
      return {
        day: day.getDay(),
        completions: dayCompletions.length,
        percentage: habits.length > 0 ? (dayCompletions.length / habits.length) * 100 : 0,
      };
    });

    return dailyProgress;
  };

  const getStats = (): Stats => {
    const activeHabits = habits.filter(h => h.isActive);
    const todayCompletions = getTodayCompletions();
    const completedToday = todayCompletions.length;
    const weeklyProgress = getWeeklyProgress();
    const avgWeeklyProgress = weeklyProgress.reduce((sum, day) => sum + day.percentage, 0) / 7;
    
    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completedToday,
      currentStreak: user?.currentStreak || 0,
      totalPoints: user?.totalPoints || 0,
      level: user?.level || 1,
      weeklyProgress: Math.round(avgWeeklyProgress),
    };
  };

  const resetAllData = async () => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    console.log('Resetting all habits data');
    await StorageService.clearAllData();
    setHabits([]);
    setCompletions([]);
  };

  return {
    habits,
    completions,
    user,
    loading,
    addHabit,
    completeHabit,
    deleteHabit,
    toggleHabitActive,
    getTodayCompletions,
    getHabitProgress,
    getWeeklyProgress,
    getStats,
    resetAllData,
  };
};
