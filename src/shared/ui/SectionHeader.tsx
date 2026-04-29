import { Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.sm,
      }}
    >
      <Text style={{ ...typography.label, color: colors.textMuted, textTransform: 'uppercase' }}>
        {title}
      </Text>
      {action}
    </View>
  );
}
