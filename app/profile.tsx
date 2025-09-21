
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { mockAchievements } from '../data/mockData';
import { commonStyles, colors } from '../styles/commonStyles';
import StatsCard from '../components/StatsCard';
import ProgressRing from '../components/ProgressRing';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarIcon: {
    fontSize: 40,
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userLevel: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userLevelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  achievementsList: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionButtonDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  actionTextDanger: {
    color: '#DC2626',
  },
  bottomSheet: {
    padding: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: colors.text,
  },
});

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { getStats, resetAllData } = useHabits();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const stats = getStats();

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
      });
      setShowEditProfile(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
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
            try {
              await resetAllData();
              Alert.alert('Success', 'All data has been reset');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Please sign in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => setShowEditProfile(true)}
        >
          <Icon name="create" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={40} color="white" />
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          {user.email && <Text style={styles.userEmail}>{user.email}</Text>}
          <View style={styles.userLevel}>
            <Text style={styles.userLevelText}>Level {user.level}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatsCard
              title="Total Points"
              value={stats.totalPoints}
              icon="star"
              color="#10B981"
              style={styles.statsCard}
            />
            <StatsCard
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              icon="flame"
              color="#F59E0B"
              style={styles.statsCard}
            />
            <StatsCard
              title="Active Habits"
              value={stats.activeHabits}
              icon="checkmark-circle"
              color={colors.primary}
              style={styles.statsCard}
            />
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsList}>
              {mockAchievements.slice(0, 5).map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowEditProfile(true)}
          >
            <Icon name="create" size={20} color={colors.text} style={styles.actionIcon} />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="notifications" size={20} color={colors.text} style={styles.actionIcon} />
            <Text style={styles.actionText}>Notifications</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="help-circle" size={20} color={colors.text} style={styles.actionIcon} />
            <Text style={styles.actionText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={handleResetData}
          >
            <Icon name="refresh" size={20} color="#DC2626" style={styles.actionIcon} />
            <Text style={[styles.actionText, styles.actionTextDanger]}>Reset All Data</Text>
            <Icon name="chevron-forward" size={20} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={handleSignOut}
          >
            <Icon name="log-out" size={20} color="#DC2626" style={styles.actionIcon} />
            <Text style={[styles.actionText, styles.actionTextDanger]}>Sign Out</Text>
            <Icon name="chevron-forward" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Edit Profile</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleSaveProfile}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
