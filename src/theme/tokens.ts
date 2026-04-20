// Design tokens. Single place for colors, spacing, and typography so UI stays
// consistent and field-ready (tap targets >= 44, high contrast, large text
// defaults).

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
} as const;

export const typography = {
  heading: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  subheading: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.4 },
};

export const colors = {
  bg: '#f7f7f9',
  surface: '#ffffff',
  surfaceAlt: '#f1f3f8',
  border: '#e2e6ef',
  text: '#111827',
  textMuted: '#6b7280',
  primary: '#2563eb',
  primaryText: '#ffffff',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  success: '#16a34a',
  successSoft: '#dcfce7',
  warning: '#d97706',
  warningSoft: '#fef3c7',
  overlay: 'rgba(17,24,39,0.4)',
};

// Minimum tap target per iOS HIG / Material guidelines. Use everywhere that
// a field user may be wearing gloves or moving.
export const MIN_TAP = 44;
