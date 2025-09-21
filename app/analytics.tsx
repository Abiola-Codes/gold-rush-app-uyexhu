
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import React from 'react';
import ProgressRing from '../components/ProgressRing';
import StatsCard from '../components/StatsCard';
import { useHabits } from '../hooks/useHabits';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  premiumBanner: {
    backgroundColor: colors.primary,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  premiumTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  premiumDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  premiumButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 8,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  habitBreakdown: {
    gap: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  habitStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    alignItems: 'center',
  },
});

export default function AnalyticsScreen() {
  const { habits, user, getStats, getWeeklyProgress, completions } = useHabits();
  const stats = getStats();
  const weeklyProgress = getWeeklyProgress();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate habit-specific analytics
  const habitAnalytics = habits.map(habit => {
    const habitCompletions = completions.filter(c => c.habitId === habit.id);
    const last7Days = habitCompletions.filter(c => {
      const daysDiff = (Date.now() - c.completedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    const completionRate = last7Days.length / 7 * 100;
    const totalCompleted = habitCompletions.reduce((sum, c) => sum + c.count, 0);
    
    return {
      ...habit,
      completionRate,
      totalCompleted,
      weeklyCompletions: last7Days.length,
    };
  });

  // Calculate monthly stats
  const last30Days = completions.filter(c => {
    const daysDiff = (Date.now() - c.completedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  const monthlyCompletions = last30Days.length;
  const monthlyAverage = monthlyCompletions / 30;
  const bestDay = weeklyProgress.reduce((best, day) => 
    day.completions > best.completions ? day : best, weeklyProgress[0]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!user?.isPremium && (
          <View style={styles.premiumBanner}>
            <Icon name="analytics" size={32} color="white" />
            <Text style={styles.premiumTitle}>Unlock Advanced Analytics</Text>
            <Text style={styles.premiumDescription}>
              Get detailed insights, trends, and personalized recommendations with HabitFlow Premium
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatsCard
              title="This Week"
              value={`${weeklyProgress.reduce((sum, day) => sum + day.completions, 0)}`}
              subtitle="completions"
              icon="calendar"
              color={colors.primary}
              style={styles.statsCard}
            />
            <StatsCard
              title="Monthly Avg"
              value={monthlyAverage.toFixed(1)}
              subtitle="per day"
              icon="trending-up"
              color="#10B981"
              style={styles.statsCard}
            />
            <StatsCard
              title="Best Day"
              value={dayNames[bestDay?.day || 0]}
              subtitle={`${bestDay?.completions || 0} habits`}
              icon="star"
              color="#F59E0B"
              style={styles.statsCard}
            />
            <StatsCard
              title="Success Rate"
              value={`${Math.round(stats.weeklyProgress)}%`}
              subtitle="this week"
              icon="checkmark-circle"
              color="#8B5CF6"
              style={styles.statsCard}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weekly Progress</Text>
            <View style={styles.weeklyChart}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <View
                    style={[
                      styles.dayBar,
                      {
                        height: Math.max(4, (day.completions / Math.max(...weeklyProgress.map(d => d.completions), 1)) * 100),
                        backgroundColor: day.completions > 0 ? colors.primary : colors.border,
                      },
                    ]}
                  />
                  <Text style={styles.dayLabel}>{dayNames[day.day]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          <View style={styles.habitBreakdown}>
            {habitAnalytics
              .sort((a, b) => b.completionRate - a.completionRate)
              .map((habit) => (
                <View key={habit.id} style={styles.habitItem}>
                  <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                    <Icon name={habit.icon as any} size={20} color="white" />
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitStats}>
                      {habit.weeklyCompletions}/7 this week • {Math.round(habit.completionRate)}% success rate
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <ProgressRing
                      progress={habit.completionRate}
                      size={40}
                      strokeWidth={4}
                      color={habit.color}
                      showText={false}
                    />
                  </View>
                </View>
              ))}
          </View>
        </View>

        {user?.isPremium && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Insights</Text>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Personalized Recommendations</Text>
              <Text style={[styles.habitStats, { textAlign: 'center', marginBottom: 16 }]}>
                Based on your patterns, we recommend:
              </Text>
              <View style={styles.habitItem}>
                <View style={[styles.habitIcon, { backgroundColor: '#10B981' }]}>
                  <Icon name="bulb" size={20} color="white" />
                </View>
                <View style={styles.habitContent}>
                  <Text style={styles.habitTitle}>Focus on Morning Habits</Text>
                  <Text style={styles.habitStats}>
                    You&apos;re 40% more likely to complete habits before 10 AM
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
