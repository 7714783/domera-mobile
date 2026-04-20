import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useI18n } from '../../../src/i18n';
import {
  useAddTaskComment, useTask, useTaskTimeline, useTaskTransition,
} from '../../../src/modules/tasks/useTasks';
import { usePermissions } from '../../../src/permissions/usePermissions';
import { Capability } from '../../../src/permissions/capabilities';
import { Badge } from '../../../src/shared/ui/Badge';
import { Button } from '../../../src/shared/ui/Button';
import { Card } from '../../../src/shared/ui/Card';
import { EmptyState } from '../../../src/shared/ui/EmptyState';
import { ErrorBlock } from '../../../src/shared/ui/ErrorBlock';
import { Input } from '../../../src/shared/ui/Input';
import { Loader } from '../../../src/shared/ui/Loader';
import { Screen } from '../../../src/shared/ui/Screen';
import { SectionHeader } from '../../../src/shared/ui/SectionHeader';
import { colors, spacing, typography } from '../../../src/theme/tokens';

export default function TaskDetail() {
  const { t } = useI18n();
  const { can } = usePermissions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTask(id!);
  const timeline = useTaskTimeline(id!);
  const transition = useTaskTransition(id!);
  const comment = useAddTaskComment(id!);
  const [commentText, setCommentText] = useState('');

  if (task.isLoading) return <Screen><Loader label={t.common.loading} /></Screen>;
  if (task.isError || !task.data) {
    return (
      <Screen>
        <ErrorBlock
          message={task.error instanceof Error ? task.error.message : t.common.errorGeneric}
          onRetry={() => void task.refetch()}
          retryLabel={t.common.retry}
        />
      </Screen>
    );
  }

  const d = task.data;

  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>{d.title}</Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
        <Badge label={d.status} tone="primary" />
        {d.priority && <Badge label={d.priority} tone="warning" />}
        {d.buildingName && <Badge label={d.buildingName} tone="neutral" />}
        {d.locationLabel && <Badge label={d.locationLabel} tone="neutral" />}
      </View>

      {d.description && (
        <Card>
          <Text style={{ ...typography.body, color: colors.text }}>{d.description}</Text>
        </Card>
      )}

      {d.allowedTransitions.length > 0 && can(Capability.tasksTransition) && (
        <Card>
          <SectionHeader title={t.tasks.transitionTo} />
          <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
            {d.allowedTransitions.map((tr) => (
              <Button
                key={tr.toStatus}
                title={tr.label}
                onPress={() => transition.mutate({ toStatus: tr.toStatus })}
                loading={transition.isPending}
              />
            ))}
          </View>
        </Card>
      )}

      {can(Capability.tasksCommentCreate) && (
        <Card>
          <SectionHeader title={t.tasks.addComment} />
          <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
            <Input
              multiline
              value={commentText}
              onChangeText={setCommentText}
              placeholder={t.tasks.addComment}
            />
            <Button
              title={t.common.save}
              onPress={() => {
                if (!commentText.trim()) return;
                comment.mutate(commentText.trim(), {
                  onSuccess: () => setCommentText(''),
                });
              }}
              loading={comment.isPending}
              disabled={!commentText.trim()}
            />
          </View>
        </Card>
      )}

      <SectionHeader title="Timeline" />
      {timeline.isLoading ? (
        <Loader />
      ) : timeline.data && timeline.data.length > 0 ? (
        timeline.data.map((e) => (
          <Card key={e.id}>
            <Text style={{ ...typography.small, color: colors.textMuted }}>
              {new Date(e.createdAt).toLocaleString()} · {e.actor}
            </Text>
            <Text style={{ ...typography.body, color: colors.text }}>{e.message ?? e.eventType}</Text>
          </Card>
        ))
      ) : (
        <EmptyState title={t.common.empty} />
      )}
    </Screen>
  );
}
