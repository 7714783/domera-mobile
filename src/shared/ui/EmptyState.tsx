import { Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export function EmptyState({ title, body, cta }: { title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <View style={{ padding: spacing.xl, alignItems: 'center', gap: spacing.sm }}>
      <Text style={{ ...typography.subheading, color: colors.text, textAlign: 'center' }}>{title}</Text>
      {body && <Text style={{ ...typography.body, color: colors.textMuted, textAlign: 'center' }}>{body}</Text>}
      {cta && <View style={{ marginTop: spacing.md }}>{cta}</View>}
    </View>
  );
}
