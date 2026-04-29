import { apiFetch } from '../../api/client';
import type { Paginated } from '../../api/types';
import type { TaskComment, TaskDetail, TaskSummary, TaskTimelineEntry } from './types';

export async function listMyTasks(scope: {
  buildingId?: string | null;
}): Promise<Paginated<TaskSummary>> {
  const qs = new URLSearchParams();
  qs.set('mine', '1');
  if (scope.buildingId) qs.set('buildingId', scope.buildingId);
  return apiFetch<Paginated<TaskSummary>>(`/v1/tasks?${qs.toString()}`);
}

export async function getTask(id: string): Promise<TaskDetail> {
  return apiFetch<TaskDetail>(`/v1/tasks/${id}`);
}

export async function listTaskTimeline(id: string): Promise<TaskTimelineEntry[]> {
  return apiFetch<TaskTimelineEntry[]>(`/v1/tasks/${id}/timeline`);
}

export async function transitionTask(
  id: string,
  body: { toStatus: string; comment?: string },
): Promise<TaskDetail> {
  return apiFetch<TaskDetail>(`/v1/tasks/${id}/transition`, { method: 'POST', body });
}

export async function addTaskComment(id: string, message: string): Promise<TaskComment> {
  return apiFetch<TaskComment>(`/v1/tasks/${id}/comments`, { method: 'POST', body: { message } });
}
