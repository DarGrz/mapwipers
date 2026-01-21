'use client';

import React from 'react';
import { useLocale } from '../hooks/useLocale';
import { convertPrice } from '@/lib/i18n';

interface ServiceCardProps {
  type: 'remove' | 'reset';
  basePrice: number;
  onSelect: (type: 'remove' | 'reset') => void;
}

export default function ServiceCard({ type, basePrice, onSelect }: ServiceCardProps) {
  const { locale, t } = useLocale();
  
  const price = locale === 'pl' ? convertPrice(basePrice, 'pl') : basePrice;
  const currencySymbol = locale === 'pl' ? 'zł' : '$';
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-gray-200 hover:border-[#0D2959] transition-all">
      <h3 className="text-2xl font-bold mb-4 text-[#0D2959]">
        {type === 'remove' ? t.services.remove.title : t.services.reset.title}
      </h3>
      <p className="text-gray-600 mb-4">
        {type === 'remove' ? t.services.remove.description : t.services.reset.description}
      </p>
      <div className="mb-6">
        <span className="text-3xl font-bold text-[#0D2959]">{price} {currencySymbol}</span>
      </div>
      <button
        onClick={() => onSelect(type)}
        className="w-full bg-[#0D2959] text-white py-3 px-6 rounded-lg hover:bg-[#1a4080] transition-colors"
      >
        {t.order.selectService}
      </button>
    </div>
  );
}
