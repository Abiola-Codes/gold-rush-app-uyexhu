
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useHabits } from '../hooks/useHabits';
import { habitCategories } from '../data/mockData';
import { HabitCategory, HabitFrequency } from '../types';
import Icon from '../components/Icon';

export default function AddHabitScreen() {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState('1');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const selectedCategory = habitCategories.find(cat => cat.id === category);

  const handleSave = () => {
    if (!title.trim()) {
      console.log('Title is required');
      return;
    }

    const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 25;

    addHabit({
      title: title.trim(),
      description: description.trim(),
      category,
      frequency,
      targetCount: parseInt(targetCount) || 1,
      difficulty,
      color: selectedCategory?.color || colors.primary,
      icon: selectedCategory?.icon || 'checkmark-circle',
      isActive: true,
      points,
    });

    console.log('Habit added successfully');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Add New Habit</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Morning Meditation"
              placeholderTextColor={colors.textLight}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details about your habit..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {habitCategories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    category === cat.id && styles.categoryItemActive,
                    { borderColor: cat.color }
                  ]}
                  onPress={() => setCategory(cat.id as HabitCategory)}
                >
                  <Icon name={cat.icon as any} size={24} color={cat.color} />
                  <Text style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Frequency */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.optionRow}>
              {[
                { key: 'daily', label: 'Daily' },
                { key: 'weekly', label: 'Weekly' },
                { key: 'monthly', label: 'Monthly' },
              ].map(freq => (
                <TouchableOpacity
                  key={freq.key}
                  style={[
                    styles.optionButton,
                    frequency === freq.key && styles.optionButtonActive
                  ]}
                  onPress={() => setFrequency(freq.key as HabitFrequency)}
                >
                  <Text style={[
                    styles.optionText,
                    frequency === freq.key && styles.optionTextActive
                  ]}>
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Count */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Count</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={targetCount}
              onChangeText={setTargetCount}
              placeholder="1"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>
              How many times per {frequency} do you want to complete this habit?
            </Text>
          </View>

          {/* Difficulty */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.optionRow}>
              {[
                { key: 'easy', label: 'Easy', points: 10, color: colors.success },
                { key: 'medium', label: 'Medium', points: 15, color: colors.warning },
                { key: 'hard', label: 'Hard', points: 25, color: colors.error },
              ].map(diff => (
                <TouchableOpacity
                  key={diff.key}
                  style={[
                    styles.difficultyButton,
                    difficulty === diff.key && { backgroundColor: diff.color + '20', borderColor: diff.color }
                  ]}
                  onPress={() => setDifficulty(diff.key as any)}
                >
                  <Text style={[
                    styles.optionText,
                    difficulty === diff.key && { color: diff.color }
                  ]}>
                    {diff.label}
                  </Text>
                  <Text style={[
                    styles.pointsText,
                    difficulty === diff.key && { color: diff.color }
                  ]}>
                    +{diff.points} pts
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Habit</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
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
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  numberInput: {
    width: 100,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: colors.card,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
