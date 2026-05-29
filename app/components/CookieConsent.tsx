'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytical: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytical: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('mapwipers_cookie_consent');
    if (!consent) {
      // Delay visibility for premium slide-in feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsedConsent = JSON.parse(consent);
        setPreferences(parsedConsent);
        // Apply consent settings to window/GTM
        applyConsentSettings(parsedConsent);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const applyConsentSettings = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      // Push consent flags to DataLayer for Google Consent Mode v2
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: 'cookie_consent_update',
        consent_settings: {
          ad_storage: prefs.marketing ? 'granted' : 'denied',
          analytics_storage: prefs.analytical ? 'granted' : 'denied',
          functionality_storage: 'granted', // Essential always active
          security_storage: 'granted',      // Essential always active
        }
      });
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytical: true, marketing: true };
    localStorage.setItem('mapwipers_cookie_consent', JSON.stringify(allAccepted));
    applyConsentSettings(allAccepted);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const allRejected = { essential: true, analytical: false, marketing: false };
    localStorage.setItem('mapwipers_cookie_consent', JSON.stringify(allRejected));
    applyConsentSettings(allRejected);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('mapwipers_cookie_consent', JSON.stringify(preferences));
    applyConsentSettings(preferences);
    setIsVisible(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 bg-transparent pointer-events-none">
      {/* Sliding Banner Card */}
      <div 
        className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_-5px_rgba(13,41,89,0.15)] border border-[#0D2959]/10 p-6 pointer-events-auto transition-all duration-500 transform translate-y-0"
        style={{
          animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Top content row */}
          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🍪</span>
                <h3 className="text-lg font-bold text-[#0D2959]">We value your privacy</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies to improve your browsing experience, deliver secure transactions, and analyze our website traffic. By clicking <span className="font-semibold text-[#0D2959]">"Accept All"</span>, you consent to our use of cookies as detailed in our{' '}
                <Link href="/privacy" className="text-[#F17313] hover:underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 items-center md:self-center flex-shrink-0">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="px-4 py-2 text-xs font-semibold text-[#0D2959] hover:bg-[#0D2959]/5 rounded-lg border border-gray-200 transition-colors"
              >
                {showPreferences ? 'Hide Preferences' : 'Preferences'}
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-xs font-semibold text-[#0D2959]/70 hover:text-[#0D2959] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#F17313] hover:bg-[#F17313]/90 rounded-lg transition-all shadow-md shadow-[#F17313]/25 hover:shadow-lg"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Preferences detail panel */}
          {showPreferences && (
            <div 
              className="border-t border-[#0D2959]/10 pt-6 mt-2 grid gap-4 md:grid-cols-3 animation-fadeIn"
              style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
            >
              {/* Essential */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-[#0D2959]">Essential Cookies</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Always Active</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Necessary for core website functions like secure checkout sessions, fraud prevention, and account persistence.
                  </p>
                </div>
              </div>

              {/* Analytical */}
              <div 
                onClick={() => togglePreference('analytical')}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  preferences.analytical 
                    ? 'border-[#0D2959]/30 bg-blue-50/20' 
                    : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-[#0D2959]">Analytics</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.analytical ? 'bg-[#0D2959]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.analytical ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Allows us to understand how visitors interact with the site, helping us find bottlenecks and improve page performance.
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div 
                onClick={() => togglePreference('marketing')}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  preferences.marketing 
                    ? 'border-[#0D2959]/30 bg-blue-50/20' 
                    : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-[#0D2959]">Marketing</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.marketing ? 'bg-[#0D2959]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Used to deliver relevant ads on social networks and search engines, and to measure campaign success.
                  </p>
                </div>
              </div>

              {/* Save Preferences Button Row */}
              <div className="md:col-span-3 flex justify-end mt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0D2959] hover:bg-[#0D2959]/90 rounded-lg transition-colors"
                >
                  Save My Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS injection for smooth animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
