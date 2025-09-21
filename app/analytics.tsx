
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useHabits } from '../hooks/useHabits';
import Icon from '../components/Icon';
import ProgressRing from '../components/ProgressRing';

export default function AnalyticsScreen() {
  const { habits, completions } = useHabits();

  // Mock analytics data
  const weeklyData = [
    { day: 'Mon', completed: 4, total: 5 },
    { day: 'Tue', completed: 5, total: 5 },
    { day: 'Wed', completed: 3, total: 5 },
    { day: 'Thu', completed: 4, total: 5 },
    { day: 'Fri', completed: 5, total: 5 },
    { day: 'Sat', completed: 2, total: 5 },
    { day: 'Sun', completed: 4, total: 5 },
  ];

  const categoryStats = [
    { category: 'Health', completed: 85, color: colors.success },
    { category: 'Fitness', completed: 72, color: colors.warning },
    { category: 'Mindfulness', completed: 90, color: colors.primary },
    { category: 'Learning', completed: 68, color: colors.accent },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Analytics</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Weekly Progress Chart */}
        <View style={[commonStyles.card, styles.chartCard]}>
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <View style={styles.weeklyChart}>
            {weeklyData.map((day, index) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <View key={index} style={styles.dayColumn}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: `${percentage}%`,
                          backgroundColor: percentage === 100 ? colors.success : colors.primary 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day.day}</Text>
                  <Text style={styles.dayValue}>{day.completed}/{day.total}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={[commonStyles.card, styles.categoryCard]}>
          <Text style={styles.cardTitle}>Category Performance</Text>
          <View style={styles.categoryList}>
            {categoryStats.map((stat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={commonStyles.spaceBetween}>
                  <Text style={styles.categoryName}>{stat.category}</Text>
                  <Text style={styles.categoryPercentage}>{stat.completed}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${stat.completed}%`,
                        backgroundColor: stat.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={[commonStyles.card, styles.insightsCard]}>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Icon name="trending-up" size={20} color={colors.success} />
              <Text style={styles.insightText}>
                You&apos;re on a 7-day streak! Keep it up to reach your longest streak of 23 days.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Icon name="time" size={20} color={colors.primary} />
              <Text style={styles.insightText}>
                Your most productive time is 8:00 AM. Consider scheduling more habits then.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Icon name="star" size={20} color={colors.warning} />
              <Text style={styles.insightText}>
                Mindfulness habits have your highest completion rate at 90%.
              </Text>
            </View>
          </View>
        </View>

        {/* Premium Upgrade Prompt */}
        <View style={[commonStyles.card, styles.premiumCard]}>
          <View style={styles.premiumHeader}>
            <Icon name="lock-closed" size={24} color={colors.warning} />
            <Text style={styles.premiumTitle}>Unlock Advanced Analytics</Text>
          </View>
          <Text style={styles.premiumDescription}>
            Get detailed insights, habit correlations, and personalized recommendations with HabitFlow Premium.
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    width: 20,
    backgroundColor: colors.border,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
  },
  dayValue: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  categoryCard: {
    marginBottom: 20,
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    gap: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightsCard: {
    marginBottom: 20,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  premiumCard: {
    backgroundColor: colors.warning + '10',
    borderWidth: 2,
    borderColor: colors.warning + '40',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
