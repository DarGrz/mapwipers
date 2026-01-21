'use client';

import { useState, useEffect } from 'react';
import { getTranslations, getLocaleFromHostname, type Locale, type TranslationKeys } from '@/lib/i18n';

export function useLocale() {
  const [locale, setLocale] = useState<Locale>('en');
  const [t, setT] = useState<TranslationKeys>(getTranslations('en'));

  useEffect(() => {
    // Detect locale from hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedLocale = getLocaleFromHostname(hostname);
      setLocale(detectedLocale);
      setT(getTranslations(detectedLocale));
    }
  }, []);

  return { locale, t };
}
