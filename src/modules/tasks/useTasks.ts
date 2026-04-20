import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { useAuthStore } from '../../store/authStore';
import {
  addTaskComment, getTask, listMyTasks, listTaskTimeline, transitionTask,
} from './tasksApi';

export function useMyTasks() {
  const scope = useAuthStore((s) => s.scope);
  return useQuery({
    queryKey: queryKeys.tasks.mine(scope),
    queryFn: () => listMyTasks({ buildingId: scope.buildingId }),
    staleTime: 30_000,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export function useTaskTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.timeline(id),
    queryFn: () => listTaskTimeline(id),
    enabled: !!id,
  });
}

export function useTaskTransition(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { toStatus: string; comment?: string }) => transitionTask(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.timeline(id) });
      qc.invalidateQueries({ queryKey: ['tasks', 'mine'] });
    },
  });
}

export function useAddTaskComment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => addTaskComment(id, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.timeline(id) });
    },
  });
}
