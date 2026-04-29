import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.md,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
