// Push-notification foundation. Registers the device's Expo token, installs
// a foreground handler, and exposes a hook that routes incoming notifications
// to the right screen.
//
// Rule: the notification payload is a ROUTING HINT, not the source of truth.
// When the user taps a notification, we always re-fetch the underlying
// resource from the backend before rendering.

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { registerPushDevice } from './notificationsApi';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

export async function ensurePushRegistered(): Promise<string | null> {
  if (!Device.isDevice) return null;   // simulators can't receive real pushes
  const perm = await Notifications.getPermissionsAsync();
  let status = perm.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const tokenRes = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();
  const token = tokenRes.data;
  try {
    await registerPushDevice({
      expoPushToken: token,
      platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
      appVersion: Constants.expoConfig?.version ?? null,
    });
  } catch {
    // Registration will be retried next session. Not fatal.
  }
  return token;
}

export function useNotificationRouter() {
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void ensurePushRegistered();

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string; taskId?: string };
      // Route based on payload TYPE. Always navigate to the server-resource
      // screen — the screen is responsible for re-fetching fresh data.
      if (data?.type === 'new_task_assigned' || data?.type === 'task_status_changed') {
        if (typeof data.taskId === 'string') {
          router.push({ pathname: '/(app)/tasks/[id]', params: { id: data.taskId } });
          return;
        }
      }
      router.push('/(app)/notifications');
    });
    return () => sub.remove();
  }, [status]);
}
