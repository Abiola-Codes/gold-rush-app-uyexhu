
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { User } from '../types';
import { StorageService } from '../utils/storage';

export class AuthService {
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;

    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: 'your-web-client-id.googleusercontent.com', // Replace with your actual web client ID
        iosClientId: 'your-ios-client-id.googleusercontent.com', // Replace with your actual iOS client ID
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });

      this.initialized = true;
      console.log('AuthService initialized');
    } catch (error) {
      console.error('Error initializing AuthService:', error);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      await this.initialize();
      
      // Check for stored user
      const storedUser = await StorageService.loadUser();
      if (storedUser) {
        return storedUser;
      }

      // Check Google Sign-In status
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        if (userInfo?.user) {
          return this.createUserFromGoogleInfo(userInfo.user);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async signInWithGoogle(): Promise<User> {
    try {
      await this.initialize();
      
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.user) {
        throw new Error('No user information received from Google');
      }

      const user = this.createUserFromGoogleInfo(userInfo.user);
      await StorageService.saveUser(user);
      
      return user;
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      }
      
      throw new Error('Failed to sign in with Google');
    }
  }

  static async signInWithApple(): Promise<User> {
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS');
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const user = this.createUserFromAppleCredential(credential);
      await StorageService.saveUser(user);
      
      return user;
    } catch (error: any) {
      console.error('Apple Sign-In error:', error);
      
      if (error.code === 'ERR_CANCELED') {
        throw new Error('Sign-in was cancelled');
      }
      
      throw new Error('Failed to sign in with Apple');
    }
  }

  static async signInAnonymously(): Promise<User> {
    try {
      const anonymousUser: User = {
        id: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `anonymous_${Date.now()}_${Math.random()}`
        ),
        name: 'Anonymous User',
        email: '',
        level: 1,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        joinedAt: new Date(),
        isPremium: false,
        avatar: undefined,
      };

      await StorageService.saveUser(anonymousUser);
      return anonymousUser;
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw new Error('Failed to sign in anonymously');
    }
  }

  static async signOut(): Promise<void> {
    try {
      // Sign out from Google if signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      // Clear stored user data
      await StorageService.clearUser();
      
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const currentUser = await StorageService.loadUser();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('User not found');
      }

      const updatedUser = { ...currentUser, ...updates };
      await StorageService.saveUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  private static createUserFromGoogleInfo(googleUser: any): User {
    return {
      id: googleUser.id,
      name: googleUser.name || 'Google User',
      email: googleUser.email || '',
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: new Date(),
      isPremium: false,
      avatar: googleUser.photo,
    };
  }

  private static createUserFromAppleCredential(credential: AppleAuthentication.AppleAuthenticationCredential): User {
    const fullName = credential.fullName;
    const displayName = fullName 
      ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
      : 'Apple User';

    return {
      id: credential.user,
      name: displayName || 'Apple User',
      email: credential.email || '',
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: new Date(),
      isPremium: false,
      avatar: undefined,
    };
  }
}
