import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Welcome() {
  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Peak Health
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            The health you care about at your finger tips
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.buttonContainer}>
          <Link href="/auth/login" asChild>
            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}>
              Login
            </Button>
          </Link>

          <Link href="/auth/register" asChild>
            <Button
              mode="outlined"
              style={[styles.button, styles.registerButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.registerButtonLabel}>
              Create Account
            </Button>
          </Link>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: '30%',
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
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: '15%',
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
  registerButtonLabel: {
    color: '#ffffff',
  },
});