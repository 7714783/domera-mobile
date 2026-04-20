import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSessionBootstrap } from '../src/auth/session';
import { I18nProvider } from '../src/i18n';
import { useNotificationRouter } from '../src/notifications/push';

export default function RootLayout() {
  // One QueryClient per app lifetime. Avoids accidental cache reset between
  // screens, keeps in-flight requests dedup'd globally.
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <BootstrapRunner />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </SafeAreaProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function BootstrapRunner() {
  useSessionBootstrap();
  useNotificationRouter();
  return null;
}
