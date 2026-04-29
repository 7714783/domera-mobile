import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useI18n } from '../../src/i18n';
import { EmptyState } from '../../src/shared/ui/EmptyState';
import { Screen } from '../../src/shared/ui/Screen';
import { SectionHeader } from '../../src/shared/ui/SectionHeader';
import { useAuthStore } from '../../src/store/authStore';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function Buildings() {
  const { t } = useI18n();
  const user = useAuthStore((s: { user: any }) => s.user);
  const scope = useAuthStore((s: { scope: { buildingId: string | null } }) => s.scope);
  const setActiveBuilding = useAuthStore(
    (s: { setActiveBuilding: (id: string) => void }) => s.setActiveBuilding,
  );

  const list = (user?.buildingRoles ?? []) as Array<{
    buildingId: string;
    buildingName: string;
    buildingSlug: string;
    roleName?: string;
    roleKey: string;
  }>;

  if (list.length === 0) {
    return (
      <Screen>
        <EmptyState title={t.access.noAccess} body={t.access.noAccessBody} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title={t.nav.buildings} />
      <View style={{ gap: spacing.sm }}>
        {list.map((r) => {
          const active = scope.buildingId === r.buildingId;
          return (
            <Pressable
              key={r.buildingId}
              onPress={() => {
                setActiveBuilding(r.buildingId);
                router.back();
              }}
              style={{
                backgroundColor: active ? '#dbeafe' : colors.surface,
                borderColor: active ? colors.primary : colors.border,
                borderWidth: 1,
                borderRadius: radius.md,
                padding: spacing.md,
              }}
            >
              <Text style={{ ...typography.subheading, color: colors.text }}>{r.buildingName}</Text>
              <Text style={{ ...typography.small, color: colors.textMuted }}>
                {r.roleName ?? r.roleKey}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
