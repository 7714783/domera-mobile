import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { logout } from '../../src/auth/authApi';
import { useI18n } from '../../src/i18n';
import { Button } from '../../src/shared/ui/Button';
import { Card } from '../../src/shared/ui/Card';
import { Screen } from '../../src/shared/ui/Screen';
import { SectionHeader } from '../../src/shared/ui/SectionHeader';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function Profile() {
  const { t } = useI18n();
  const user = useAuthStore((s: { user: any }) => s.user);
  const clearSession = useAuthStore((s: { clearSession: () => Promise<void> }) => s.clearSession);

  async function signOut() {
    await logout();
    await clearSession();
    router.replace('/(auth)/login');
  }

  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>
        {user?.displayName ?? user?.email}
      </Text>
      <Text style={{ ...typography.body, color: colors.textMuted }}>{user?.email}</Text>

      <Card>
        <SectionHeader title={t.screens.memberships} />
        <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
          {(user?.buildingRoles ?? []).map((r: any) => (
            <View key={r.buildingId}>
              <Text style={{ ...typography.body, color: colors.text }}>{r.buildingName}</Text>
              <Text style={{ ...typography.small, color: colors.textMuted }}>
                {r.roleName ?? r.roleKey}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Button
        title={t.nav.settings}
        variant="secondary"
        onPress={() => router.push('/(app)/settings')}
      />
      <Button title={t.auth.logout} variant="danger" onPress={signOut} />
    </Screen>
  );
}
