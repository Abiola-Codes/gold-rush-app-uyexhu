
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import ProgressRing from './ProgressRing';

interface HabitCardProps {
  habit: Habit;
  progress: { completed: number; target: number; percentage: number };
  onComplete: () => void;
  onPress?: () => void;
}

export default function HabitCard({ habit, progress, onComplete, onPress }: HabitCardProps) {
  const isCompleted = progress.percentage >= 100;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={[commonStyles.card, styles.container]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={commonStyles.spaceBetween}>
        <View style={styles.leftContent}>
          <View style={commonStyles.row}>
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
              <Icon 
                name={habit.icon as any} 
                size={24} 
                color={habit.color} 
              />
            </View>
            <View style={styles.habitInfo}>
              <Text style={styles.title}>{habit.title}</Text>
              <Text style={styles.description}>
                {progress.completed}/{progress.target} • {habit.currentStreak} day streak
              </Text>
              <View style={commonStyles.row}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(habit.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(habit.difficulty) }]}>
                    {habit.difficulty}
                  </Text>
                </View>
                <Text style={styles.points}>+{habit.points} pts</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <ProgressRing
            progress={progress.percentage}
            size={60}
            strokeWidth={6}
            color={habit.color}
            showText={false}
          />
          <TouchableOpacity
            style={[
              styles.completeButton,
              { backgroundColor: isCompleted ? colors.success : habit.color },
            ]}
            onPress={onComplete}
            disabled={isCompleted}
          >
            <Icon
              name={isCompleted ? 'checkmark' : 'add'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  completeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
});
