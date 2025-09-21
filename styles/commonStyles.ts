
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#4F46E5',      // Vibrant indigo
  secondary: '#10B981',    // Emerald green
  accent: '#F59E0B',       // Amber
  background: '#FFFFFF',   // Pure white
  backgroundAlt: '#F8FAFC', // Light gray
  text: '#1F2937',         // Dark gray
  textSecondary: '#6B7280', // Medium gray
  textLight: '#9CA3AF',    // Light gray
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  card: '#FFFFFF',         // White cards
  border: '#E5E7EB',       // Light border
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textLight: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textLight,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
});
