import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../../src/i18n';
import { routeScan } from '../../src/scanner/useScanRouter';
import { Button } from '../../src/shared/ui/Button';
import { EmptyState } from '../../src/shared/ui/EmptyState';
import { Screen } from '../../src/shared/ui/Screen';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function Scanner() {
  const { t } = useI18n();
  const [permission, requestPermission] = useCameraPermissions();
  const [lastUnknown, setLastUnknown] = useState<string | null>(null);
  // Debounce: the camera fires many times per second on a held QR.
  const handlingRef = useRef(false);

  const onScan = useCallback(async ({ data }: { data: string }) => {
    if (handlingRef.current) return;
    handlingRef.current = true;
    try {
      const result = await routeScan(data);
      if (result.kind === 'unknown') setLastUnknown(data);
    } finally {
      // Allow next scan after a short pause so the user isn't bombarded by
      // repeated navigations.
      setTimeout(() => {
        handlingRef.current = false;
      }, 1200);
    }
  }, []);

  if (!permission)
    return (
      <Screen>
        <Text>{t.common.loading}</Text>
      </Screen>
    );

  if (!permission.granted) {
    return (
      <Screen>
        <EmptyState
          title={t.scanner.title}
          body={permission.canAskAgain ? t.scanner.instruction : t.scanner.permissionDenied}
          cta={
            permission.canAskAgain ? (
              <Button title={t.scanner.permissionRequest} onPress={requestPermission} />
            ) : null
          }
        />
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={onScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'code128', 'code39', 'upc_a'] }}
      />
      <View style={styles.overlay}>
        <Text style={[typography.subheading, { color: '#fff' }]}>{t.scanner.title}</Text>
        <Text style={[typography.small, { color: '#e5e7eb' }]}>{t.scanner.instruction}</Text>
      </View>
      {lastUnknown && (
        <View style={styles.unknown}>
          <Text style={{ ...typography.body, color: colors.text }}>{t.scanner.unknownCode}</Text>
          <Text style={{ ...typography.small, color: colors.textMuted }} numberOfLines={1}>
            {lastUnknown}
          </Text>
          <Button
            title={t.scanner.rescan}
            variant="secondary"
            onPress={() => setLastUnknown(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
    gap: spacing.xs,
    paddingTop: spacing.xxl,
  },
  unknown: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
});
