'use client';

import React from 'react';
import Link from 'next/link';
import { usePricing } from '../hooks/usePricing';

export default function Pricing() {
    const { getServicePrice, getAddonPrice } = usePricing();
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const services = [
        {
            title: "Profile Removal",
            price: getServicePrice('remove') || 499,
            description: "Complete removal of a fraudulent or unauthorized Google Business Profile from Search and Maps.",
            features: [
                "Elimination from Google Search",
                "Elimination from Google Maps",
                "All fake reviews permanently gone",
                "7-14 business days completion",
                "Dedicated case manager",
                "100% Money-Back Guarantee"
            ],
            popular: true,
            buttonText: "Remove a Profile",
            link: "/#search"
        },
        {
            title: "Profile Reset",
            price: getServicePrice('reset') || 599,
            description: "Keep your official listing but wipe its entire history of reviews and bad reputation for a fresh start.",
            features: [
                "Preserve your Business Name",
                "Wipe 100% of review history",
                "Remove all old business photos",
                "Professional appeal process",
                "Google internal escalation",
                "Fresh start with clean rating"
            ],
            popular: false,
            buttonText: "Reset My Profile",
            link: "/#search"
        }
    ];

    const addons = [
        {
            title: "1-Year Protection",
            price: getAddonPrice('yearProtection') || 199,
            description: "We monitor your address. If a new fake profile appears within 12 months, we remove it for free.",
            icon: (
                <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            title: "Express Processing",
            price: getAddonPrice('expressService') || 99,
            description: "Priority handling. We start the escalation process within 2 hours of your payment.",
            icon: (
                <svg className="w-8 h-8 text-[#0D2959]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    ];

    return (
        <div className="bg-white text-black font-[family-name:var(--font-geist-sans)] pb-24">
            {/* Header */}
            <section className="py-20 bg-gradient-to-b from-[#0D2959]/5 to-transparent text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0D2959] mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                        Protect your business with our flat-rate services. No monthly fees, no hidden costs.
                        Only pay for results.
                    </p>
                    <div className="w-20 h-1 bg-[#F17313] mx-auto"></div>
                </div>
            </section>

            {/* Main Pricing Cards */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 transition-all hover:scale-[1.02] ${service.popular
                                ? 'bg-white border-2 border-[#F17313] shadow-2xl'
                                : 'bg-white border border-gray-200 shadow-xl'
                                }`}
                        >
                            {service.popular && (
                                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                    <span className="bg-[#F17313] text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                                        Most Successful
                                    </span>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-[#0D2959] mb-4">{service.title}</h2>
                            <div className="flex items-baseline mb-6">
                                <span className="text-5xl font-extrabold text-[#0D2959]">{formatPrice(service.price)}</span>
                                <span className="text-gray-500 ml-2">/ one-time</span>
                            </div>
                            <p className="text-gray-600 mb-8 h-12">{service.description}</p>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <p className="text-sm font-bold text-[#0D2959] uppercase tracking-wider mb-4">What's included:</p>
                                <ul className="space-y-4">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={service.link}
                                className={`block text-center py-4 rounded-xl font-bold text-lg transition-all ${service.popular
                                    ? 'bg-[#F17313] text-white hover:bg-[#F17313]/90 shadow-lg shadow-[#F17313]/30'
                                    : 'bg-[#0D2959] text-white hover:bg-[#0D2959]/90 shadow-lg shadow-[#0D2959]/30'
                                    }`}
                            >
                                {service.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Add-ons */}
            <section className="container mx-auto px-4 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#0D2959] mb-4">Enhance Your Package</h2>
                        <p className="text-gray-600">Additional options to secure and speed up your results</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {addons.map((addon, index) => (
                            <div key={index} className="flex gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[#F17313]/30 transition-all">
                                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    {addon.icon}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-[#0D2959]">{addon.title}</h3>
                                        <span className="text-[#F17313] font-bold">+{formatPrice(addon.price)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{addon.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Guarantee */}
            <section className="bg-[#0D2959] text-white py-24 mt-12 rounded-[60px] mx-4 md:mx-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F17313]/10 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12 text-center">
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Safe Payments</h3>
                                <p className="text-white/60 text-sm">Secure transactions processed by Stripe with end-to-end encryption.</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Fixed Timeframe</h3>
                                <p className="text-white/60 text-sm">90% of our cases are fully resolved within 14 business days.</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Result Guarantee</h3>
                                <p className="text-white/60 text-sm">No positive result? Full refund. We stand behind our proven methods.</p>
                            </div>
                        </div>

                        <div className="mt-20 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[40px] text-center">
                            <h3 className="text-2xl md:text-3xl font-bold mb-6">Custom Enterprise Solutions?</h3>
                            <p className="text-white/70 text-lg mb-8">
                                Managing multiple locations or a franchise? We offer volume discounts and specialized reputation API integrations.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-block bg-white text-[#0D2959] px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:bg-gray-100 transition-all"
                            >
                                Request Enterprise Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Quick Link */}
            <section className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold text-[#0D2959] mb-4">Still have questions?</h2>
                <p className="text-gray-600 mb-8">Check our detailed FAQ page for more information about our process.</p>
                <Link
                    href="/#faq"
                    className="text-[#F17313] font-bold border-b-2 border-[#F17313] pb-1 hover:text-[#0D2959] hover:border-[#0D2959] transition-all"
                >
                    See All Frequently Asked Questions
                </Link>
            </section>
        </div>
    );
}
