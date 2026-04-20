import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useI18n } from '../../src/i18n';
import { Badge } from '../../src/shared/ui/Badge';
import { Button } from '../../src/shared/ui/Button';
import { Card } from '../../src/shared/ui/Card';
import { Screen } from '../../src/shared/ui/Screen';
import { SectionHeader } from '../../src/shared/ui/SectionHeader';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function Home() {
  const { t } = useI18n();
  const user = useAuthStore((s: { user: any }) => s.user);
  const scope = useAuthStore((s: { scope: { buildingSlug: string | null } }) => s.scope);

  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>
        {user?.displayName ?? user?.email ?? 'Domera'}
      </Text>

      <Card>
        <SectionHeader title={t.nav.buildings} />
        <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
          <Text style={{ ...typography.body, color: colors.text }}>
            {scope.buildingSlug ?? 'No building selected'}
          </Text>
          {(user?.buildingRoles ?? []).length > 1 && (
            <Button
              title="Switch building"
              variant="secondary"
              onPress={() => router.push('/(app)/buildings')}
            />
          )}
        </View>
      </Card>

      <Card>
        <SectionHeader title="Quick actions" />
        <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
          <Button title={t.nav.tasks} onPress={() => router.push('/(app)/tasks')} />
          <Button title={t.nav.scanner} variant="secondary" onPress={() => router.push('/(app)/scanner')} />
        </View>
      </Card>

      <Card>
        <SectionHeader title={t.nav.notifications} />
        <View style={{ paddingTop: spacing.sm, flexDirection: 'row', gap: spacing.sm }}>
          <Badge label="backed by /v1/notifications" tone="neutral" />
        </View>
      </Card>
    </Screen>
  );
}
