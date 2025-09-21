
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockUser, mockAchievements } from '../data/mockData';
import { useHabits } from '../hooks/useHabits';
import Icon from '../components/Icon';
import StatsCard from '../components/StatsCard';
import ProgressRing from '../components/ProgressRing';
import SimpleBottomSheet from '../components/BottomSheet';

export default function ProfileScreen() {
  const { getStats } = useHabits();
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  
  const stats = getStats();
  const unlockedAchievements = mockAchievements.filter(a => a.unlockedAt);
  const nextLevelPoints = (mockUser.level + 1) * 100;
  const levelProgress = (mockUser.totalPoints % 100) / 100 * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={[commonStyles.card, styles.userCard]}>
          <View style={commonStyles.row}>
            <Image
              source={{ uri: mockUser.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <Text style={styles.userEmail}>{mockUser.email}</Text>
              <View style={commonStyles.row}>
                <View style={styles.levelBadge}>
                  <Icon name="trophy" size={16} color={colors.accent} />
                  <Text style={styles.levelText}>Level {mockUser.level}</Text>
                </View>
                {!mockUser.isPremium && (
                  <TouchableOpacity 
                    style={styles.premiumBadge}
                    onPress={() => setShowPremiumSheet(true)}
                  >
                    <Icon name="star" size={14} color={colors.warning} />
                    <Text style={styles.premiumText}>Upgrade</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
          {/* Level Progress */}
          <View style={styles.levelProgress}>
            <View style={commonStyles.spaceBetween}>
              <Text style={styles.progressLabel}>Progress to Level {mockUser.level + 1}</Text>
              <Text style={styles.progressPoints}>
                {mockUser.totalPoints % 100}/{nextLevelPoints % 100} pts
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Habits"
            value={stats.totalHabits}
            icon="list"
            color={colors.primary}
          />
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="flame"
            color={colors.warning}
          />
        </View>
        
        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Points"
            value={stats.totalPoints.toLocaleString()}
            icon="trophy"
            color={colors.accent}
          />
          <StatsCard
            title="Achievements"
            value={unlockedAchievements.length}
            subtitle={`of ${mockAchievements.length}`}
            icon="medal"
            color={colors.success}
          />
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockAchievements.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlockedAt && styles.achievementCardLocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlockedAt ? colors.accent + '20' : colors.border }
                ]}>
                  <Icon
                    name={achievement.icon as any}
                    size={24}
                    color={achievement.unlockedAt ? colors.accent : colors.textLight}
                  />
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlockedAt && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementPoints}>+{achievement.points} pts</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Premium Features */}
        {!mockUser.isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={() => setShowPremiumSheet(true)}
          >
            <View style={commonStyles.row}>
              <View style={styles.premiumIcon}>
                <Icon name="star" size={24} color={colors.warning} />
              </View>
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>
                  Unlock advanced analytics, personalized coaching, and exclusive content
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {[
            { icon: 'analytics', title: 'Analytics', subtitle: 'View detailed insights' },
            { icon: 'people', title: 'Community', subtitle: 'Connect with others' },
            { icon: 'notifications', title: 'Notifications', subtitle: 'Manage reminders' },
            { icon: 'help-circle', title: 'Help & Support', subtitle: 'Get assistance' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={commonStyles.row}>
                <View style={styles.menuIcon}>
                  <Icon name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Premium Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showPremiumSheet}
        onClose={() => setShowPremiumSheet(false)}
      >
        <View style={styles.premiumSheetContent}>
          <View style={styles.premiumSheetHeader}>
            <Icon name="star" size={32} color={colors.warning} />
            <Text style={styles.premiumSheetTitle}>HabitFlow Premium</Text>
            <Text style={styles.premiumSheetSubtitle}>
              Supercharge your habit building journey
            </Text>
          </View>

          <View style={styles.premiumFeatures}>
            {[
              'Advanced analytics and insights',
              'Personalized AI coaching',
              'Unlimited habit tracking',
              'Custom themes and icons',
              'Priority customer support',
              'Exclusive community access',
            ].map((feature, index) => (
              <View key={index} style={commonStyles.row}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Monthly Subscription</Text>
            <Text style={styles.pricingPrice}>$9.99/month</Text>
            <Text style={styles.pricingDescription}>
              Cancel anytime • 7-day free trial
            </Text>
          </View>

          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPremiumSheet(false)}>
            <Text style={styles.cancelText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  userCard: {
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
    marginLeft: 4,
  },
  levelProgress: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  progressPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  achievementsSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: colors.textLight,
  },
  achievementPoints: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.accent,
  },
  premiumCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.warning + '40',
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuSection: {
    gap: 4,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumSheetContent: {
    padding: 24,
  },
  premiumSheetHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  premiumSheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  premiumSheetSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  premiumFeatures: {
    gap: 16,
    marginBottom: 32,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  pricingCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
