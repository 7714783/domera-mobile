import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../../../src/shared/ui/Screen';
import { colors, typography } from '../../../src/theme/tokens';

export default function CleaningQrTarget() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>Cleaning QR</Text>
      <Text style={{ ...typography.small, color: colors.textMuted }}>Code: {code}</Text>
      <Text style={{ ...typography.body, color: colors.textMuted }}>
        Cleaning request flow pending. Data source: /v1/public/cleaning/qr/:code on the shared backend.
      </Text>
    </Screen>
  );
}
