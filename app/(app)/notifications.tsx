import { useQuery } from '@tanstack/react-query';
import { FlatList, Text, View } from 'react-native';
import { queryKeys } from '../../src/api/queryKeys';
import { useI18n } from '../../src/i18n';
import {
  listNotifications,
  type MobileNotificationItem,
} from '../../src/notifications/notificationsApi';
import { Card } from '../../src/shared/ui/Card';
import { EmptyState } from '../../src/shared/ui/EmptyState';
import { ErrorBlock } from '../../src/shared/ui/ErrorBlock';
import { Loader } from '../../src/shared/ui/Loader';
import { Screen } from '../../src/shared/ui/Screen';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function Notifications() {
  const { t } = useI18n();
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: listNotifications,
    staleTime: 15_000,
  });

  if (isLoading)
    return (
      <Screen>
        <Loader label={t.common.loading} />
      </Screen>
    );
  if (isError) {
    return (
      <Screen>
        <ErrorBlock
          message={error instanceof Error ? error.message : t.common.errorGeneric}
          onRetry={() => void refetch()}
          retryLabel={t.common.retry}
        />
      </Screen>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0)
    return (
      <Screen>
        <EmptyState title={t.notifications.empty} />
      </Screen>
    );

  return (
    <Screen scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(x: MobileNotificationItem) => x.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ ...typography.subheading, color: colors.text }}>{item.title}</Text>
            <Text style={{ ...typography.body, color: colors.textMuted }}>{item.body}</Text>
            <Text style={{ ...typography.small, color: colors.textMuted, marginTop: spacing.xs }}>
              {new Date(item.createdAt).toLocaleString()} · {item.type}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
