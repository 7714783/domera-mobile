import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';

export default function AuthLayout() {
  const status = useAuthStore((s: { status: string }) => s.status);
  if (status === 'authenticated') return <Redirect href="/(app)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
