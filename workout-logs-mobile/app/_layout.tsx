import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === 'auth';

      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to the welcome screen if not authenticated
        router.replace('/auth/welcome');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to the home screen if authenticated
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <Stack screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
          headerShadowVisible: false,
        }}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
