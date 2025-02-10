import { View, StyleSheet , ScrollView} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, Stack } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import env from '../config/env';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${env.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      await login(data.token, data.user);
      router.replace('/(tabs)');
    } catch (err : any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>
                Create Account
              </Text>
              <Text variant="titleMedium" style={styles.subtitle}>
                Start your fitness journey today
              </Text>
            </Animated.View>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <View style={styles.form}>
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
                textColor="#ffffff"
                theme={{ colors: { onSurfaceVariant: '#ffffff' } }}
              />

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                textColor="#ffffff"
                theme={{ colors: { onSurfaceVariant: '#ffffff' } }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                textColor="#ffffff"
                theme={{ colors: { onSurfaceVariant: '#ffffff' } }}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                textColor="#ffffff"
                theme={{ colors: { onSurfaceVariant: '#ffffff' } }}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}>
                Sign Up
              </Button>

              <Link href="/auth/login" asChild>
                <Button mode="text" textColor="#ffffff">
                  Already have an account? Log in
                </Button>
              </Link>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});