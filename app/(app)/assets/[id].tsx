import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../../../src/shared/ui/Screen';
import { colors, typography } from '../../../src/theme/tokens';
import { useI18n } from '../../../src/i18n';

// Foundation screen. Asset detail domain module will land in a later phase;
// the scanner already routes here by design so we don't lose the link.
export default function AssetDetail() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>{t.screens.asset}</Text>
      <Text style={{ ...typography.small, color: colors.textMuted }}>Backend id: {id}</Text>
      <Text style={{ ...typography.body, color: colors.textMuted }}>
        Asset detail view (read-only) pending mobile module implementation. All data here will come
        from /v1/assets/:id on the shared backend.
      </Text>
    </Screen>
  );
}
