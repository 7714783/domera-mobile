import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { login } from '../../src/auth/authApi';
import { fetchCurrentUser } from '../../src/auth/authApi';
import { useI18n } from '../../src/i18n';
import { Button } from '../../src/shared/ui/Button';
import { ErrorBlock } from '../../src/shared/ui/ErrorBlock';
import { Input } from '../../src/shared/ui/Input';
import { Screen } from '../../src/shared/ui/Screen';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function LoginScreen() {
  const { t } = useI18n();
  const setSession = useAuthStore(
    (s: { setSession: (token: string, user: any) => Promise<void> }) => s.setSession,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await login({ email, password });
      // Some backends return user with login; others require a second call.
      const user = res.user ?? (await fetchCurrentUser());
      await setSession(res.token, user);
      router.replace('/(app)');
    } catch (e) {
      setErr(e instanceof Error ? e.message : t.auth.invalid);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ gap: spacing.lg, paddingTop: spacing.xxl }}>
        <Text style={{ ...typography.heading, color: colors.text }}>{t.auth.loginTitle}</Text>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ ...typography.label, color: colors.textMuted }}>
            {t.auth.email.toUpperCase()}
          </Text>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            accessibilityLabel={t.auth.email}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ ...typography.label, color: colors.textMuted }}>
            {t.auth.password.toUpperCase()}
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            accessibilityLabel={t.auth.password}
          />
        </View>

        {err && <ErrorBlock message={err} />}

        <Button title={t.auth.submit} onPress={submit} loading={busy} />
      </View>
    </Screen>
  );
}
