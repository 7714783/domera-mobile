import { ActivityIndicator, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export function Loader({ label }: { label?: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm }}>
      <ActivityIndicator color={colors.primary} />
      {label && <Text style={{ ...typography.small, color: colors.textMuted }}>{label}</Text>}
    </View>
  );
}
