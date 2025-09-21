
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { commonStyles, colors } from '../styles/commonStyles';
import StatsCard from '../components/StatsCard';
import ProgressRing from '../components/ProgressRing';
import { mockAchievements } from '../data/mockData';
import { useHabits } from '../hooks/useHabits';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleBottomSheet from '../components/BottomSheet';

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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  levelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.text,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    marginTop: 20,
  },
});

export default function ProfileScreen() {
  const { user, getStats, updateUserProfile, resetAllData } = useHabits();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const stats = getStats();

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    await updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim(),
    });

    setShowEditProfile(false);
    console.log('Profile updated successfully');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your habits, progress, and achievements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            console.log('All data reset successfully');
          },
        },
      ]
    );
  };

  const unlockedAchievements = mockAchievements.filter(a => a.unlockedAt);
  const lockedAchievements = mockAchievements.filter(a => !a.unlockedAt);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.name}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Icon name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {user.level}</Text>
          </View>
          <ProgressRing
            progress={(user.totalPoints % 100) / 100 * 100}
            size={80}
            strokeWidth={8}
            color={colors.primary}
            showText={true}
            text={`${user.totalPoints % 100}/100`}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Points"
            value={user.totalPoints}
            icon="star"
            color={colors.primary}
            style={styles.statsCard}
          />
          <StatsCard
            title="Current Streak"
            value={`${user.currentStreak} days`}
            icon="flame"
            color="#F59E0B"
            style={styles.statsCard}
          />
          <StatsCard
            title="Longest Streak"
            value={`${user.longestStreak} days`}
            icon="trophy"
            color="#10B981"
            style={styles.statsCard}
          />
          <StatsCard
            title="Active Habits"
            value={stats.activeHabits}
            icon="checkmark-circle"
            color="#8B5CF6"
            style={styles.statsCard}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {unlockedAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Icon name={achievement.icon as any} size={20} color="white" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              <Text style={styles.achievementPoints}>+{achievement.points}</Text>
            </View>
          ))}
          
          {lockedAchievements.slice(0, 2).map((achievement) => (
            <View key={achievement.id} style={[styles.achievementItem, { opacity: 0.5 }]}>
              <View style={[styles.achievementIcon, { backgroundColor: colors.textSecondary }]}>
                <Icon name="lock-closed" size={20} color="white" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              <Text style={styles.achievementPoints}>+{achievement.points}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Edit Profile</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.textSecondary}
            value={editName}
            onChangeText={setEditName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={editEmail}
            onChangeText={setEditEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>

      {/* Settings Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Settings</Text>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              setShowSettings(false);
              setEditName(user.name);
              setEditEmail(user.email);
              setShowEditProfile(true);
            }}
          >
            <Icon name="person" size={20} color={colors.text} />
            <Text style={styles.settingsText}>Edit Profile</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="notifications" size={20} color={colors.text} />
            <Text style={styles.settingsText}>Notifications</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="help-circle" size={20} color={colors.text} />
            <Text style={styles.settingsText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleResetData}
          >
            <Text style={styles.buttonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
