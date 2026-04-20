import { router } from 'expo-router';
import { Button } from '../src/shared/ui/Button';
import { EmptyState } from '../src/shared/ui/EmptyState';
import { Screen } from '../src/shared/ui/Screen';

export default function NotFound() {
  return (
    <Screen>
      <EmptyState
        title="Screen not found"
        body="This link doesn't lead anywhere in the current build."
        cta={<Button title="Go home" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
