'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslations, getLocaleFromPathname, type Locale, type TranslationKeys, convertPrice } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

interface LocaleContextType {
  locale: Locale;
  t: TranslationKeys;
  formatPrice: (priceUSD: number) => string;
  currency: string;
  currencySymbol: string;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [t, setT] = useState<TranslationKeys>(getTranslations('en'));
  const pathname = usePathname();

  useEffect(() => {
    // Detect locale from pathname
    const detectedLocale = getLocaleFromPathname(pathname);
    setLocaleState(detectedLocale);
    setT(getTranslations(detectedLocale));
  }, [pathname]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setT(getTranslations(newLocale));
  };

  const formatPrice = (priceUSD: number): string => {
    const price = locale === 'pl' ? convertPrice(priceUSD, 'pl') : priceUSD;
    const symbol = locale === 'pl' ? 'zł' : '$';
    return `${symbol}${price}`;
  };

  const value: LocaleContextType = {
    locale,
    t,
    formatPrice,
    currency: locale === 'pl' ? 'PLN' : 'USD',
    currencySymbol: locale === 'pl' ? 'zł' : '$',
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}
