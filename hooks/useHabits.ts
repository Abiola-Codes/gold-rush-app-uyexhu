
import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, Stats, User } from '../types';
import { StorageService } from '../utils/storage';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from storage...');
        setLoading(true);
        
        const [loadedHabits, loadedCompletions, loadedUser] = await Promise.all([
          StorageService.loadHabits(),
          StorageService.loadCompletions(),
          StorageService.loadUser(),
        ]);

        setHabits(loadedHabits);
        setCompletions(loadedCompletions);
        
        // Initialize user if none exists
        if (!loadedUser) {
          const defaultUser = await StorageService.initializeDefaultUser();
          setUser(defaultUser);
        } else {
          setUser(loadedUser);
        }
        
        setInitialized(true);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    if (initialized && habits.length >= 0) {
      StorageService.saveHabits(habits);
    }
  }, [habits, initialized]);

  // Save completions whenever they change
  useEffect(() => {
    if (initialized && completions.length >= 0) {
      StorageService.saveCompletions(completions);
    }
  }, [completions, initialized]);

  // Save user whenever they change
  useEffect(() => {
    if (initialized && user) {
      StorageService.saveUser(user);
    }
  }, [user, initialized]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak'>) => {
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
    
    // Award points for creating a habit
    if (user) {
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + 10,
        level: Math.floor((user.totalPoints + 10) / 100) + 1,
      };
      setUser(updatedUser);
    }
  };

  const completeHabit = async (habitId: string, count: number = 1, notes?: string) => {
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
    
    // Update habit streak and calculate points
    const pointsEarned = habit.points * count;
    let streakBonus = 0;
    
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newStreak = h.currentStreak + 1;
        const newLongestStreak = Math.max(h.longestStreak, newStreak);
        
        // Streak bonus calculation
        if (newStreak >= 7) streakBonus = 20;
        if (newStreak >= 30) streakBonus = 50;
        if (newStreak >= 100) streakBonus = 100;
        
        return {
          ...h,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
        };
      }
      return h;
    }));

    // Update user points and streak
    if (user) {
      const totalPointsEarned = pointsEarned + streakBonus;
      const newTotalPoints = user.totalPoints + totalPointsEarned;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      
      // Calculate overall streak (simplified - based on daily completions)
      const today = new Date().toDateString();
      const todayCompletions = [...completions, completion].filter(c => 
        c.completedAt.toDateString() === today
      );
      
      const updatedUser = {
        ...user,
        totalPoints: newTotalPoints,
        level: newLevel,
        currentStreak: todayCompletions.length > 0 ? user.currentStreak + 1 : 0,
        longestStreak: Math.max(user.longestStreak, user.currentStreak + 1),
      };
      
      setUser(updatedUser);
      console.log(`Points earned: ${totalPointsEarned} (base: ${pointsEarned}, bonus: ${streakBonus})`);
    }
  };

  const deleteHabit = async (habitId: string) => {
    console.log('Deleting habit:', habitId);
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setCompletions(prev => prev.filter(completion => completion.habitId !== habitId));
  };

  const toggleHabitActive = async (habitId: string) => {
    console.log('Toggling habit active status:', habitId);
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, isActive: !habit.isActive } : habit
    ));
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    console.log('Updating user profile:', updates);
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
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
    console.log('Resetting all data');
    await StorageService.clearAllData();
    setHabits([]);
    setCompletions([]);
    const defaultUser = await StorageService.initializeDefaultUser();
    setUser(defaultUser);
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
    updateUserProfile,
    getTodayCompletions,
    getHabitProgress,
    getWeeklyProgress,
    getStats,
    resetAllData,
  };
};
