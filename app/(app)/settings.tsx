import { Text, View } from 'react-native';
import { env } from '../../src/config/env';
import { useI18n } from '../../src/i18n';
import { Card } from '../../src/shared/ui/Card';
import { Screen } from '../../src/shared/ui/Screen';
import { SectionHeader } from '../../src/shared/ui/SectionHeader';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function Settings() {
  const { t, locale, isRTL } = useI18n();
  return (
    <Screen>
      <Text style={{ ...typography.heading, color: colors.text }}>{t.nav.settings}</Text>

      <Card>
        <SectionHeader title={t.screens.environment} />
        <View style={{ gap: spacing.xs, paddingTop: spacing.sm }}>
          <Row k="API base" v={env.apiBase} />
          <Row k="Environment" v={env.environment} />
          <Row k="Locale" v={locale} />
          <Row k="Direction" v={isRTL ? 'RTL' : 'LTR'} />
        </View>
      </Card>
    </Screen>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ ...typography.small, color: colors.textMuted }}>{k}</Text>
      <Text style={{ ...typography.small, color: colors.text }}>{v}</Text>
    </View>
  );
}
