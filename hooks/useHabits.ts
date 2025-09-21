
import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, Stats } from '../types';
import { mockHabits, mockCompletions, mockUser } from '../data/mockData';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(mockCompletions);
  const [loading, setLoading] = useState(false);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak'>) => {
    console.log('Adding new habit:', habit.title);
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const completeHabit = (habitId: string, count: number = 1, notes?: string) => {
    console.log('Completing habit:', habitId, 'count:', count);
    const completion: HabitCompletion = {
      id: Date.now().toString(),
      habitId,
      completedAt: new Date(),
      count,
      notes,
    };
    
    setCompletions(prev => [...prev, completion]);
    
    // Update habit streak
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newStreak = habit.currentStreak + 1;
        return {
          ...habit,
          currentStreak: newStreak,
          longestStreak: Math.max(habit.longestStreak, newStreak),
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    console.log('Deleting habit:', habitId);
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setCompletions(prev => prev.filter(completion => completion.habitId !== habitId));
  };

  const toggleHabitActive = (habitId: string) => {
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

  const getStats = (): Stats => {
    const activeHabits = habits.filter(h => h.isActive);
    const todayCompletions = getTodayCompletions();
    const completedToday = todayCompletions.length;
    
    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completedToday,
      currentStreak: mockUser.currentStreak,
      totalPoints: mockUser.totalPoints,
      level: mockUser.level,
      weeklyProgress: Math.round((completedToday / activeHabits.length) * 100) || 0,
    };
  };

  return {
    habits,
    completions,
    loading,
    addHabit,
    completeHabit,
    deleteHabit,
    toggleHabitActive,
    getTodayCompletions,
    getHabitProgress,
    getStats,
  };
};
