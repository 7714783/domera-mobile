import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, MIN_TAP, radius, spacing, typography } from '../../theme/tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const palette = PALETTE[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        {
          minHeight: MIN_TAP,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          backgroundColor: palette.bg,
          borderWidth: palette.borderWidth,
          borderColor: palette.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={{ ...typography.body, color: palette.fg, fontWeight: '600' }}>{title}</Text>
      )}
    </Pressable>
  );
}

const PALETTE: Record<Variant, { bg: string; fg: string; border: string; borderWidth: number }> = {
  primary: { bg: colors.primary, fg: colors.primaryText, border: colors.primary, borderWidth: 0 },
  secondary: { bg: colors.surface, fg: colors.text, border: colors.border, borderWidth: 1 },
  danger: { bg: colors.danger, fg: colors.primaryText, border: colors.danger, borderWidth: 0 },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent', borderWidth: 0 },
};
