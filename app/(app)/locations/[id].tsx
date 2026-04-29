import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../../../src/shared/ui/Screen';
import { colors, typography } from '../../../src/theme/tokens';
import { useI18n } from '../../../src/i18n';

export default function LocationDetail() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>{t.screens.location}</Text>
      <Text style={{ ...typography.small, color: colors.textMuted }}>Backend id: {id}</Text>
      <Text style={{ ...typography.body, color: colors.textMuted }}>
        Location detail view pending. Data source: /v1/buildings/:slug/locations on the shared
        backend.
      </Text>
    </Screen>
  );
}
