'use client';

import { useLocaleContext } from '../context/LocaleContext';
import { usePathname } from 'next/navigation';

export default function LocaleDebug() {
  const { locale, t, currency } = useLocaleContext();
  const pathname = usePathname();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xs font-mono z-50">
      <div>Locale: <strong className="text-green-400">{locale.toUpperCase()}</strong></div>
      <div>Currency: <strong className="text-blue-400">{currency}</strong></div>
      <div>Path: <strong className="text-yellow-400">{pathname}</strong></div>
    </div>
  );
}
