'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocaleContext } from '../context/LocaleContext';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale } = useLocaleContext();

  // Get the path without /pl prefix
  const pathWithoutLocale = pathname.startsWith('/pl') 
    ? pathname.slice(3) || '/' 
    : pathname;

  // Generate links for both languages
  const enPath = pathWithoutLocale;
  const plPath = `/pl${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
      <Link
        href={enPath}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          locale === 'en'
            ? 'bg-[#0D2959] text-white'
            : 'text-[#0D2959] hover:bg-gray-100'
        }`}
      >
        EN
      </Link>
      <Link
        href={plPath}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          locale === 'pl'
            ? 'bg-[#0D2959] text-white'
            : 'text-[#0D2959] hover:bg-gray-100'
        }`}
      >
        PL
      </Link>
    </div>
  );
}
