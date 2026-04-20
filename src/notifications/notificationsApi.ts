import { apiFetch } from '../api/client';

export type RegisterDeviceInput = {
  expoPushToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string | null;
  appVersion?: string | null;
};

export type MobileNotificationItem = {
  id: string;
  type: string;          // new_task_assigned | task_status_changed | equipment_alert | …
  title: string;
  body: string;
  data: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
};

export async function registerPushDevice(input: RegisterDeviceInput) {
  return apiFetch('/v1/notifications/devices', { method: 'POST', body: input });
}

export async function unregisterPushDevice(expoPushToken: string) {
  return apiFetch(`/v1/notifications/devices`, {
    method: 'DELETE',
    body: { expoPushToken },
  });
}

export async function listNotifications() {
  return apiFetch<{ total: number; items: MobileNotificationItem[] }>('/v1/notifications?take=50');
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/v1/notifications/${id}/read`, { method: 'POST' });
}
