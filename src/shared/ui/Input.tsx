import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';

export const Input = forwardRef<TextInput, TextInputProps>(function Input(props, ref) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.textMuted}
      {...props}
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          color: colors.text,
          ...typography.body,
        },
        props.style,
      ]}
    />
  );
});
