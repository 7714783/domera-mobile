// Mobile i18n. Mirrors the web contract (en/ru/he, same keys) but kept in a
// single TS tree per locale for RN — no JSON imports, no Metro asset plugins,
// strict `typeof en` parallel-tree guarantee so RU/HE can never drift.
//
// Priority:
//   1. persisted preference (expo-secure-store)
//   2. device locale (expo-localization)
//   3. 'en' fallback
//
// When the user explicitly changes language via setLocale(), we persist the
// choice AND trigger I18nManager.forceRTL() for 'he'. RN requires an app
// restart for I18nManager to take full effect — the caller is expected to
// surface a "restart app" banner at that point.

import * as Localization from 'expo-localization';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18nManager } from 'react-native';
import { secureGet, secureSet } from '../shared/secureStorage';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { he } from './locales/he';

export type Locale = 'en' | 'ru' | 'he';

const STORAGE_KEY = 'domera.ui.locale';

const DICTIONARIES: Record<Locale, typeof en> = { en, ru, he };

function detectDeviceLocale(): Locale {
  const tag = (Localization.getLocales()[0]?.languageCode ?? 'en').toLowerCase();
  if (tag.startsWith('ru')) return 'ru';
  if (tag.startsWith('he') || tag === 'iw') return 'he';
  return 'en';
}

function isRTL(locale: Locale): boolean {
  return locale === 'he';
}

type I18nCtx = {
  locale: Locale;
  t: typeof en;
  isRTL: boolean;
  setLocale: (next: Locale) => Promise<void>;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectDeviceLocale());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await secureGet(STORAGE_KEY);
        if (stored === 'en' || stored === 'ru' || stored === 'he') setLocaleState(stored);
      } catch {
        /* noop — fall back to device detection */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const shouldBeRTL = isRTL(locale);
    if (I18nManager.isRTL !== shouldBeRTL) {
      // allowRTL must be called before forceRTL on some platforms.
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
      // Full effect requires an app restart. Caller surfaces a banner.
    }
  }, [locale, ready]);

  const setLocale = useCallback(async (next: Locale) => {
    await secureSet(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nCtx>(
    () => ({ locale, t: DICTIONARIES[locale], isRTL: isRTL(locale), setLocale }),
    [locale, setLocale],
  );

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('I18nProvider missing');
  return ctx;
}
