
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useHabits } from '../hooks/useHabits';
import { mockUser } from '../data/mockData';
import HabitCard from '../components/HabitCard';
import StatsCard from '../components/StatsCard';
import Icon from '../components/Icon';
import ProgressRing from '../components/ProgressRing';

export default function HomeScreen() {
  const { habits, completeHabit, getHabitProgress, getStats } = useHabits();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const stats = getStats();
  const activeHabits = habits.filter(h => h.isActive);
  
  const filteredHabits = activeHabits.filter(habit => {
    const progress = getHabitProgress(habit.id);
    switch (selectedFilter) {
      case 'pending': return progress.percentage < 100;
      case 'completed': return progress.percentage >= 100;
      default: return true;
    }
  });

  const completedToday = activeHabits.filter(habit => 
    getHabitProgress(habit.id).percentage >= 100
  ).length;

  const overallProgress = activeHabits.length > 0 
    ? (completedToday / activeHabits.length) * 100 
    : 0;

  console.log('Home screen rendered with', activeHabits.length, 'active habits');

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={commonStyles.title}>{mockUser.name}</Text>
          </View>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="person" size={24} color={colors.text} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Daily Progress */}
        <View style={[commonStyles.card, styles.progressCard]}>
          <View style={commonStyles.spaceBetween}>
            <View>
              <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
              <Text style={styles.progressSubtitle}>
                {completedToday} of {activeHabits.length} habits completed
              </Text>
            </View>
            <ProgressRing
              progress={overallProgress}
              size={80}
              strokeWidth={8}
              color={colors.primary}
              text={`${completedToday}/${activeHabits.length}`}
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="days in a row"
            icon="flame"
            color={colors.warning}
            trend="up"
          />
          <StatsCard
            title="Total Points"
            value={stats.totalPoints.toLocaleString()}
            subtitle={`Level ${stats.level}`}
            icon="trophy"
            color={colors.accent}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Active Habits"
            value={stats.activeHabits}
            subtitle="habits tracking"
            icon="list"
            color={colors.primary}
          />
          <StatsCard
            title="Weekly Progress"
            value={`${stats.weeklyProgress}%`}
            subtitle="this week"
            icon="trending-up"
            color={colors.success}
            trend="up"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <Text style={commonStyles.subtitle}>Your Habits</Text>
          <View style={styles.filterTabs}>
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Done' },
            ].map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.key && styles.filterTabActive
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedFilter === filter.key && styles.filterTabTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.habitsList}>
          {filteredHabits.length > 0 ? (
            filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                progress={getHabitProgress(habit.id)}
                onComplete={() => completeHabit(habit.id)}
                onPress={() => console.log('Habit pressed:', habit.title)}
              />
            ))
          ) : (
            <View style={[commonStyles.card, commonStyles.center, { padding: 40 }]}>
              <Icon name="checkmark-circle" size={48} color={colors.success} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                {selectedFilter === 'completed' 
                  ? 'Great job! All habits completed for today!' 
                  : 'No habits found. Add some to get started!'}
              </Text>
            </View>
          )}
        </View>

        {/* Add Habit Button */}
        <Link href="/add-habit" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add New Habit</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressCard: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.card,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  habitsList: {
    gap: 12,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
