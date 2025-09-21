
import { router } from 'expo-router';
import Icon from '../components/Icon';
import React, { useState } from 'react';
import { habitCategories } from '../data/mockData';
import { commonStyles, colors } from '../styles/commonStyles';
import { useHabits } from '../hooks/useHabits';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitCategory, HabitFrequency } from '../types';

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
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  inputDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '45%',
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  frequencyOptions: {
    gap: 8,
  },
  frequencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  frequencyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  difficultyItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  difficultyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  difficultyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  difficultyPoints: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  targetSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  targetInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  targetLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});

export default function AddHabitScreen() {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [targetCount, setTargetCount] = useState('1');
  const [saving, setSaving] = useState(false);

  const frequencyOptions = [
    {
      value: 'daily' as HabitFrequency,
      title: 'Daily',
      description: 'Every day',
    },
    {
      value: 'weekly' as HabitFrequency,
      title: 'Weekly',
      description: 'Once per week',
    },
    {
      value: 'monthly' as HabitFrequency,
      title: 'Monthly',
      description: 'Once per month',
    },
  ];

  const difficultyOptions = [
    {
      value: 'easy' as const,
      title: 'Easy',
      points: 10,
      color: '#10B981',
      icon: 'leaf',
    },
    {
      value: 'medium' as const,
      title: 'Medium',
      points: 15,
      color: '#F59E0B',
      icon: 'flash',
    },
    {
      value: 'hard' as const,
      title: 'Hard',
      points: 25,
      color: '#EF4444',
      icon: 'flame',
    },
  ];

  const selectedCategory = habitCategories.find(c => c.id === category);
  const selectedDifficulty = difficultyOptions.find(d => d.value === difficulty);

  const canSave = title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    const target = parseInt(targetCount) || 1;
    if (target < 1) {
      Alert.alert('Invalid Target', 'Target count must be at least 1');
      return;
    }

    setSaving(true);
    console.log('Creating new habit:', title);

    try {
      await addHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        frequency,
        targetCount: target,
        color: selectedCategory?.color || '#8B5CF6',
        icon: selectedCategory?.icon || 'checkmark-circle',
        isActive: true,
        difficulty,
        points: selectedDifficulty?.points || 10,
      });

      console.log('Habit created successfully');
      router.back();
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Habit</Text>
        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Habit name (e.g., Morning meditation)"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={styles.inputDescription}>
            Choose a clear, specific name for your habit
          </Text>
          
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text style={styles.inputDescription}>
            Add details about what this habit involves
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {habitCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  category === cat.id && styles.categoryItemSelected,
                ]}
                onPress={() => setCategory(cat.id as HabitCategory)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <Icon name={cat.icon as any} size={12} color="white" />
                </View>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.frequencyOptions}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyItem,
                  frequency === option.value && styles.frequencyItemSelected,
                ]}
                onPress={() => setFrequency(option.value)}
              >
                <View style={styles.frequencyContent}>
                  <Text style={styles.frequencyTitle}>{option.title}</Text>
                  <Text style={styles.frequencyDescription}>{option.description}</Text>
                </View>
                {frequency === option.value && (
                  <Icon name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target & Difficulty</Text>
          <View style={styles.targetSection}>
            <Text style={styles.targetLabel}>Complete</Text>
            <TextInput
              style={styles.targetInput}
              value={targetCount}
              onChangeText={setTargetCount}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.targetLabel}>times per {frequency.slice(0, -2)}</Text>
          </View>
          
          <View style={[styles.difficultyOptions, { marginTop: 16 }]}>
            {difficultyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.difficultyItem,
                  difficulty === option.value && styles.difficultyItemSelected,
                ]}
                onPress={() => setDifficulty(option.value)}
              >
                <View style={[styles.difficultyIcon, { backgroundColor: option.color }]}>
                  <Icon name={option.icon as any} size={20} color="white" />
                </View>
                <Text style={styles.difficultyTitle}>{option.title}</Text>
                <Text style={styles.difficultyPoints}>+{option.points} pts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
