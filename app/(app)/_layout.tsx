import { Redirect, Tabs } from 'expo-router';
import { useI18n } from '../../src/i18n';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/theme/tokens';

export default function AppLayout() {
  const status = useAuthStore((s: { status: string }) => s.status);
  const { t } = useI18n();

  if (status === 'bootstrapping') return null;
  if (status !== 'authenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.nav.home }} />
      <Tabs.Screen name="tasks" options={{ title: t.nav.tasks }} />
      <Tabs.Screen name="scanner" options={{ title: t.nav.scanner }} />
      <Tabs.Screen name="notifications" options={{ title: t.nav.notifications }} />
      <Tabs.Screen name="profile" options={{ title: t.nav.profile }} />
      {/* Hide non-tab routes from tab bar */}
      <Tabs.Screen name="settings" options={{ href: null, title: t.nav.settings }} />
      <Tabs.Screen name="buildings" options={{ href: null, title: t.nav.buildings }} />
      <Tabs.Screen name="assets/[id]" options={{ href: null, title: 'Asset' }} />
      <Tabs.Screen name="locations/[id]" options={{ href: null, title: 'Location' }} />
      <Tabs.Screen name="cleaning/[code]" options={{ href: null, title: 'Cleaning' }} />
    </Tabs>
  );
}
