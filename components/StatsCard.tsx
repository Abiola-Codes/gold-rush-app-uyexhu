
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = colors.primary,
  trend 
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return colors.success;
      case 'down': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon as any} size={20} color={color} />
        </View>
        {trend && (
          <Icon 
            name={getTrendIcon() as any} 
            size={16} 
            color={getTrendColor()} 
          />
        )}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
});
