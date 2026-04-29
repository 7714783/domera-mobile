// Secure key/value storage for credentials. Wraps expo-secure-store with a
// web fallback (expo-secure-store is no-op on web — we fall through to
// localStorage to keep dev-in-browser functional, but never store prod
// credentials in a browser session).

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* noop */
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function secureDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
