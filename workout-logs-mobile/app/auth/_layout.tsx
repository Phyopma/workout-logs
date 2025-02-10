import { Stack } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}