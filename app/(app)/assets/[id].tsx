import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../../../src/shared/ui/Screen';
import { colors, typography } from '../../../src/theme/tokens';

// Foundation screen. Asset detail domain module will land in a later phase;
// the scanner already routes here by design so we don't lose the link.
export default function AssetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>Asset</Text>
      <Text style={{ ...typography.small, color: colors.textMuted }}>
        Backend id: {id}
      </Text>
      <Text style={{ ...typography.body, color: colors.textMuted }}>
        Asset detail view (read-only) pending mobile module implementation.
        All data here will come from /v1/assets/:id on the shared backend.
      </Text>
    </Screen>
  );
}
