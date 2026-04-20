import { ScrollView, StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme/tokens';

export function Screen({
  children, scroll = true, style, padding = true,
}: { children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle>; padding?: boolean }) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <Body
        style={{ flex: 1 }}
        contentContainerStyle={
          scroll
            ? [
                { padding: padding ? spacing.lg : 0, gap: spacing.md, paddingBottom: spacing.xxl },
                style,
              ]
            : undefined
        }
      >
        {!scroll ? (
          <View style={[{ flex: 1, padding: padding ? spacing.lg : 0, gap: spacing.md }, style]}>{children}</View>
        ) : (
          children
        )}
      </Body>
    </SafeAreaView>
  );
}
