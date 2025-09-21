
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('Initializing authentication...');
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      console.log('Authentication initialized:', currentUser ? 'User found' : 'No user');
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('Signing in with Google...');
      const user = await AuthService.signInWithGoogle();
      setUser(user);
      console.log('Google sign-in successful:', user.name);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      console.log('Signing in with Apple...');
      const user = await AuthService.signInWithApple();
      setUser(user);
      console.log('Apple sign-in successful:', user.name);
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setIsLoading(true);
      console.log('Signing in anonymously...');
      const user = await AuthService.signInAnonymously();
      setUser(user);
      console.log('Anonymous sign-in successful');
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out...');
      await AuthService.signOut();
      setUser(null);
      console.log('Sign-out successful');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      console.log('Updating profile:', updates);
      const updatedUser = await AuthService.updateProfile(user.id, updates);
      setUser(updatedUser);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signInWithGoogle,
    signInWithApple,
    signInAnonymously,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
