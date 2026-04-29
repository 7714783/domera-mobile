import { router } from 'expo-router';
import { Button } from '../src/shared/ui/Button';
import { EmptyState } from '../src/shared/ui/EmptyState';
import { Screen } from '../src/shared/ui/Screen';
import { useI18n } from '../src/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Screen>
      <EmptyState
        title={t.screens.notFound}
        cta={<Button title={t.screens.goHome} onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
