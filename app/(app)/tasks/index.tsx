import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useI18n } from '../../../src/i18n';
import { useMyTasks } from '../../../src/modules/tasks/useTasks';
import type { TaskSummary } from '../../../src/modules/tasks/types';
import { Badge } from '../../../src/shared/ui/Badge';
import { EmptyState } from '../../../src/shared/ui/EmptyState';
import { ErrorBlock } from '../../../src/shared/ui/ErrorBlock';
import { Loader } from '../../../src/shared/ui/Loader';
import { Screen } from '../../../src/shared/ui/Screen';
import { colors, radius, spacing, typography } from '../../../src/theme/tokens';

export default function TasksList() {
  const { t } = useI18n();
  const { data, isLoading, isError, refetch, error } = useMyTasks();

  if (isLoading) return <Screen><Loader label={t.common.loading} /></Screen>;
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
  if (items.length === 0) {
    return (
      <Screen>
        <EmptyState title={t.tasks.emptyTitle} body={t.tasks.emptyBody} />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        renderItem={({ item }) => <TaskRow task={item} />}
      />
    </Screen>
  );
}

function TaskRow({ task }: { task: TaskSummary }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/tasks/[id]', params: { id: task.id } })}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: spacing.xs,
      }}
    >
      <Text style={{ ...typography.subheading, color: colors.text }} numberOfLines={2}>
        {task.title}
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
        <Badge label={task.status} tone={statusTone(task.status)} />
        {task.priority && <Badge label={task.priority} tone={priorityTone(task.priority)} />}
        {task.buildingName && <Badge label={task.buildingName} tone="neutral" />}
      </View>
      {task.dueAt && (
        <Text style={{ ...typography.small, color: colors.textMuted }}>Due {fmt(task.dueAt)}</Text>
      )}
    </Pressable>
  );
}

function statusTone(s: string): 'neutral' | 'primary' | 'success' | 'warning' | 'danger' {
  if (/complete|done|closed/i.test(s)) return 'success';
  if (/progress/i.test(s)) return 'primary';
  if (/overdue|late/i.test(s)) return 'danger';
  return 'neutral';
}

function priorityTone(p: string): 'neutral' | 'primary' | 'success' | 'warning' | 'danger' {
  if (/urgent|critical/i.test(p)) return 'danger';
  if (/high/i.test(p)) return 'warning';
  if (/low/i.test(p)) return 'neutral';
  return 'primary';
}

function fmt(iso: string): string {
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}
