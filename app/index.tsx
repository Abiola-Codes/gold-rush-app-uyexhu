
import React, { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import HabitCard from '../components/HabitCard';
import { commonStyles, colors } from '../styles/commonStyles';
import StatsCard from '../components/StatsCard';
import ProgressRing from '../components/ProgressRing';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  progressDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  habitsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authPromptIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  authPromptDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  authPromptButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authPromptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function HomeScreen() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { habits, loading, completeHabit, getHabitProgress, getStats } = useHabits();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [authLoading, isAuthenticated]);

  const stats = getStats();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      console.log('Data refreshed');
    }, 1000);
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'active') return habit.isActive;
    if (filter === 'completed') {
      const progress = getHabitProgress(habit.id);
      return progress.percentage >= 100;
    }
    return true;
  });

  const todayProgress = habits.length > 0 ? 
    (habits.filter(h => getHabitProgress(h.id).percentage >= 100).length / habits.length) * 100 : 0;

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ProgressRing
            progress={50}
            size={60}
            strokeWidth={6}
            color={colors.primary}
            showText={false}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <View style={styles.authPromptIcon}>
            <Icon name="person" size={40} color="white" />
          </View>
          <Text style={styles.authPromptTitle}>Welcome to HabitFlow</Text>
          <Text style={styles.authPromptDescription}>
            Sign in to start tracking your habits, earn points, and build better routines.
          </Text>
          <TouchableOpacity 
            style={styles.authPromptButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.authPromptButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ProgressRing
            progress={50}
            size={60}
            strokeWidth={6}
            color={colors.primary}
            showText={false}
          />
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'HabitFlow User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <Link href="/analytics" asChild>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="analytics" size={20} color={colors.text} />
            </TouchableOpacity>
          </Link>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="person" size={20} color={colors.text} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatsCard
              title="Level"
              value={stats.level}
              icon="trophy"
              color={colors.primary}
              style={styles.statsCard}
            />
            <StatsCard
              title="Streak"
              value={`${stats.currentStreak} days`}
              icon="flame"
              color="#F59E0B"
              style={styles.statsCard}
            />
            <StatsCard
              title="Points"
              value={stats.totalPoints}
              icon="star"
              color="#10B981"
              style={styles.statsCard}
            />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
            <Text style={styles.progressSubtitle}>
              {Math.round(todayProgress)}% of habits completed
            </Text>
            <ProgressRing
              progress={todayProgress}
              size={120}
              strokeWidth={12}
              color={colors.primary}
              showText={true}
              text={`${stats.completedToday}/${stats.activeHabits}`}
            />
            <View style={styles.progressDetails}>
              <Icon name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.progressText}>
                {stats.completedToday} of {stats.activeHabits} habits completed
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Habits</Text>
            <Link href="/add-habit" asChild>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="add" size={20} color="white" />
              </TouchableOpacity>
            </Link>
          </View>

          {habits.length > 0 && (
            <View style={styles.filterTabs}>
              <TouchableOpacity
                style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === 'all' && styles.filterTabTextActive
                ]}>
                  All ({habits.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
                onPress={() => setFilter('active')}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === 'active' && styles.filterTabTextActive
                ]}>
                  Active ({habits.filter(h => h.isActive).length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
                onPress={() => setFilter('completed')}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === 'completed' && styles.filterTabTextActive
                ]}>
                  Done ({habits.filter(h => getHabitProgress(h.id).percentage >= 100).length})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Icon name="checkmark-circle" size={40} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>
                {habits.length === 0 ? 'No habits yet' : 'No habits in this filter'}
              </Text>
              <Text style={styles.emptyDescription}>
                {habits.length === 0 
                  ? 'Start building better habits today.\nCreate your first habit to get started!'
                  : 'Try switching to a different filter to see your habits.'
                }
              </Text>
              {habits.length === 0 && (
                <Link href="/add-habit" asChild>
                  <TouchableOpacity style={styles.emptyButton}>
                    <Text style={styles.emptyButtonText}>Create First Habit</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          ) : (
            <View style={styles.habitsList}>
              {filteredHabits.map((habit) => {
                const progress = getHabitProgress(habit.id);
                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    progress={progress}
                    onComplete={() => {
                      if (progress.completed < habit.targetCount) {
                        completeHabit(habit.id, 1);
                        console.log(`Completed habit: ${habit.title}`);
                      }
                    }}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
