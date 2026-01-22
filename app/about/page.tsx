'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutUs() {
    return (
        <div className="bg-white text-black font-[family-name:var(--font-geist-sans)]">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#0D2959] to-[#0D2959] text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F17313] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F17313] rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Protecting Your Business <br />
                            <span className="text-[#F17313]">Reputation Online</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-10 leading-relaxed">
                            We are a team of experts dedicated to cleaning up Google Maps from fake, duplicate, and unauthorized business profiles.
                            Our mission is to ensure every business has a fair and accurate digital presence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Story */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F17313]/10 rounded-full"></div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2959] mb-6">Our Story</h2>
                            <div className="prose prose-lg text-gray-700 space-y-4">
                                <p>
                                    MapWipers was founded in 2018 after we witnessed firsthand how much damage a single fake Google Business Profile could do to a small business. A competitor created a duplicate profile for our client, filled it with fake negative reviews, and started stealing customers using an incorrect phone number.
                                </p>
                                <p>
                                    We realized that Google's standard reporting tools are often slow and ineffective for complex cases. Since then, we've developed proprietary methods and deep expertise in Google's internal escalation systems.
                                </p>
                                <p>
                                    Today, we've successfully removed over 500 unauthorized profiles for businesses ranging from local restaurants and dental clinics to nationwide law firms and service providers.
                                </p>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <Image
                                    src="/mapwipers_logo-horizontal.png"
                                    alt="MapWipers Logo"
                                    width={400}
                                    height={114}
                                    className="opacity-50"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2959]/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0D2959] mb-4">Values We Live By</h2>
                        <div className="w-20 h-1 bg-[#F17313] mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#F17313]/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#0D2959] mb-4">Integrity First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We only take on cases where we are 100% certain of unauthorized or fraudulent activity. We believe in high ethical standards for the digital world.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#0D2959]/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-[#0D2959]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#0D2959] mb-4">Swift Results</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Digital reputation damage spreads fast. We work around the clock across different time zones to ensure the fastest possible removal for our clients.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#F17313]/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#0D2959] mb-4">Fair Pricing</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Reputation management shouldn't cost a fortune. We offer flat-rate pricing with a 100% money-back guarantee. If we can't remove it, you don't pay.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-[#0D2959] rounded-[40px] p-8 md:p-16 relative overflow-hidden">
                            {/* Decorative Circles */}
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#F17313]/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                        Why Choose <span className="text-[#F17313]">MapWipers?</span>
                                    </h2>
                                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                                        Unlike general marketing agencies, we specialized in one thing: Google Business Profile cleanup. We know the rules better than the "reputation scammers" do.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Deep understanding of Google Support Policies",
                                            "Direct escalation pathways for fraudulent content",
                                            "98% success rate on confirmed fake profiles",
                                            "Bank-level security and data privacy"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center text-white/90">
                                                <div className="w-6 h-6 bg-[#F17313] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                                        <div className="text-3xl font-bold text-[#F17313] mb-1">500+</div>
                                        <div className="text-white/60 text-sm uppercase tracking-wider">Resolved Cases</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                                        <div className="text-3xl font-bold text-[#F17313] mb-1">98%</div>
                                        <div className="text-white/60 text-sm uppercase tracking-wider">Success Rate</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                                        <div className="text-3xl font-bold text-[#F17313] mb-1">6+</div>
                                        <div className="text-white/60 text-sm uppercase tracking-wider">Years Experience</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                                        <div className="text-3xl font-bold text-[#F17313] mb-1">Instant</div>
                                        <div className="text-white/60 text-sm uppercase tracking-wider">Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0D2959] mb-8">Ready to reclaim your brand?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-[#F17313] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#F17313]/90 transition-all shadow-xl hover:shadow-2xl"
                        >
                            Start Your Search
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-[#0D2959] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#0D2959]/90 transition-all shadow-xl hover:shadow-2xl"
                        >
                            Talk to an Expert
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
