import { Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { Button } from './Button';

export function ErrorBlock({
  message,
  onRetry,
  retryLabel = 'Retry',
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.dangerSoft,
        borderColor: colors.danger,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <Text style={{ ...typography.body, color: colors.danger }}>{message}</Text>
      {onRetry && <Button title={retryLabel} variant="secondary" onPress={onRetry} />}
    </View>
  );
}
