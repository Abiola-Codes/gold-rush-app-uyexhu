
import { Stack, useGlobalSearchParams } from 'expo-router';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../contexts/AuthContext';

const STORAGE_KEY = 'emulated_device';

export default function RootLayout() {
  const actualInsets = useSafeAreaInsets();
  const { emulate } = useGlobalSearchParams<{ emulate?: string }>();
  const [storedEmulate, setStoredEmulate] = useState<string | null>(null);

  useEffect(() => {
    // Set up global error logging
    setupErrorLogging();

    if (Platform.OS === 'web') {
      // If there's a new emulate parameter, store it
      if (emulate) {
        localStorage.setItem(STORAGE_KEY, emulate);
        setStoredEmulate(emulate);
      } else {
        // If no emulate parameter, try to get from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStoredEmulate(stored);
        }
      }
    }
  }, [emulate]);

  let insetsToUse = actualInsets;

  if (Platform.OS === 'web') {
    const simulatedInsets = {
      ios: { top: 47, bottom: 20, left: 0, right: 0 },
      android: { top: 40, bottom: 0, left: 0, right: 0 },
    };

    // Use stored emulate value if available, otherwise use the current emulate parameter
    const deviceToEmulate = storedEmulate || emulate;
    insetsToUse = deviceToEmulate ? simulatedInsets[deviceToEmulate as keyof typeof simulatedInsets] || actualInsets : actualInsets;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'HabitFlow',
                animation: 'default' 
              }} 
            />
            <Stack.Screen 
              name="auth" 
              options={{ 
                title: 'Sign In',
                animation: 'fade',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="add-habit" 
              options={{ 
                title: 'Add Habit',
                presentation: 'modal',
                animation: 'slide_from_bottom'
              }} 
            />
            <Stack.Screen 
              name="profile" 
              options={{ 
                title: 'Profile' 
              }} 
            />
            <Stack.Screen 
              name="analytics" 
              options={{ 
                title: 'Analytics' 
              }} 
            />
          </Stack>
        </GestureHandlerRootView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
