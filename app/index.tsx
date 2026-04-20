// Splash / entry — waits for the auth bootstrap to resolve, then routes
// either into the authenticated app shell or to the login screen.

import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Loader } from '../src/shared/ui/Loader';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const status = useAuthStore((s) => s.status);

  if (status === 'authenticated') return <Redirect href="/(app)" />;
  if (status === 'unauthenticated') return <Redirect href="/(auth)/login" />;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Loader label="Domera" />
    </View>
  );
}
