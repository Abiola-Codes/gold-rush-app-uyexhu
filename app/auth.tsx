
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
    marginBottom: 32,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#dadce0',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  authButtonIcon: {
    marginRight: 12,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  googleButtonText: {
    color: '#3c4043',
  },
  appleButtonText: {
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  anonymousButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  anonymousButtonText: {
    color: colors.text,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
});

export default function AuthScreen() {
  const { signInWithGoogle, signInWithApple, signInAnonymously, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLocalLoading(true);
      await signInWithGoogle();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLocalLoading(true);
      await signInWithApple();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in with Apple');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLocalLoading(true);
      await signInAnonymously();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in');
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = isLoading || localLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Icon name="checkmark-circle" size={40} color="white" />
          </View>
          <Text style={styles.title}>Welcome to HabitFlow</Text>
          <Text style={styles.subtitle}>
            Build better habits, track your progress, and achieve your goals with gamified habit tracking.
          </Text>
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.authButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Icon name="logo-google" size={20} color="#4285f4" style={styles.authButtonIcon} />
            <Text style={[styles.authButtonText, styles.googleButtonText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.authButton, styles.appleButton]}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Icon name="logo-apple" size={20} color="white" style={styles.authButtonIcon} />
              <Text style={[styles.authButtonText, styles.appleButtonText]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          text="Continue as Guest"
          onPress={handleAnonymousSignIn}
          style={styles.anonymousButton}
          textStyle={styles.anonymousButtonText}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Your data is stored locally on your device.
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Icon name="refresh" size={24} color={colors.primary} />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
