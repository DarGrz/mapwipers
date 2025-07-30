import { useState, useEffect } from 'react';
import { PricingData } from '../types';

export const usePricing = () => {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pricing');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPricing(data.pricing);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pricing';
      setError(errorMessage);
      console.error('Error fetching pricing:', err);
      
      // Fallback pricing w przypadku błędu
      setPricing({
        services: {
          remove: {
            name: 'Remove Profile',
            price: 499,
            description: 'Complete removal of Google Business Profile'
          },
          reset: {
            name: 'Reset Profile',
            price: 299,
            description: 'Reset Google Business Profile to clean state'
          }
        },
        addons: {
          yearProtection: {
            name: '1-Year Protection',
            price: 199,
            description: 'Prevents reappearance for 12 months'
          },
          expressService: {
            name: 'Express Service',
            price: 99,
            description: 'Priority processing within 24-48 hours'
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const calculateTotal = (
    serviceType: 'remove' | 'reset' | null,
    yearProtection: boolean,
    expressService: boolean
  ): number => {
    if (!pricing || !serviceType) return 0;
    
    let total = pricing.services[serviceType]?.price || 0;
    
    if (yearProtection) {
      total += pricing.addons.yearProtection?.price || 0;
    }
    
    if (expressService) {
      total += pricing.addons.expressService?.price || 0;
    }
    
    return total;
  };

  const getServicePrice = (serviceType: 'remove' | 'reset'): number => {
    return pricing?.services[serviceType]?.price || 0;
  };

  const getAddonPrice = (addonType: 'yearProtection' | 'expressService'): number => {
    return pricing?.addons[addonType]?.price || 0;
  };

  const getServiceName = (serviceType: 'remove' | 'reset'): string => {
    return pricing?.services[serviceType]?.name || '';
  };

  const getAddonName = (addonType: 'yearProtection' | 'expressService'): string => {
    return pricing?.addons[addonType]?.name || '';
  };

  const getServiceDescription = (serviceType: 'remove' | 'reset'): string => {
    return pricing?.services[serviceType]?.description || '';
  };

  const getAddonDescription = (addonType: 'yearProtection' | 'expressService'): string => {
    return pricing?.addons[addonType]?.description || '';
  };

  return {
    pricing,
    loading,
    error,
    refetch: fetchPricing,
    calculateTotal,
    getServicePrice,
    getAddonPrice,
    getServiceName,
    getAddonName,
    getServiceDescription,
    getAddonDescription
  };
};
