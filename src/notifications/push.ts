// Push-notification foundation. Registers the device's Expo token, installs
// a foreground handler, and exposes a hook that routes incoming notifications
// to the right screen.
//
// Rule: the notification payload is a ROUTING HINT, not the source of truth.
// When the user taps a notification, we always re-fetch the underlying
// resource from the backend before rendering.
//
// Expo Go runtime caveat: SDK 53+ dropped Android remote-push support from
// the public Expo Go binary — `expo-notifications` throws on import inside
// Expo Go on Android. We detect that environment at module load and
// short-circuit every entry point. Real device builds (development build
// + production EAS Build) use the full implementation unchanged.

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { registerPushDevice } from './notificationsApi';

const IS_EXPO_GO = Constants.executionEnvironment === 'storeClient';
// Android Expo Go specifically — iOS Expo Go still supports local
// notifications fine. Web also has no Notifications API to call against.
const PUSH_DISABLED = (IS_EXPO_GO && Platform.OS === 'android') || Platform.OS === 'web';

// Lazy-load the module so importing it never runs on Expo Go Android (top
// level `import` is what threw the original Uncaught Error). This pattern
// also keeps Metro's static analysis happy in the disabled case.
type NotificationsModule = typeof import('expo-notifications');
let _notifications: NotificationsModule | null = null;
function loadNotifications(): NotificationsModule | null {
  if (PUSH_DISABLED) return null;
  if (_notifications) return _notifications;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _notifications = require('expo-notifications') as NotificationsModule;
  // Set foreground handler once the module is actually loaded.
  _notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }),
  });
  return _notifications;
}

export async function ensurePushRegistered(): Promise<string | null> {
  const N = loadNotifications();
  if (!N) return null; // Expo Go Android / web — no push to register
  if (!Device.isDevice) return null; // simulators can't receive real pushes
  const perm = await N.getPermissionsAsync();
  let status = perm.status;
  if (status !== 'granted') {
    const req = await N.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const tokenRes = projectId
    ? await N.getExpoPushTokenAsync({ projectId })
    : await N.getExpoPushTokenAsync();
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
    const N = loadNotifications();
    if (!N) return; // disabled in this runtime — nothing to subscribe to
    void ensurePushRegistered();

    const sub = N.addNotificationResponseReceivedListener((response) => {
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
