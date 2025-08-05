"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderDetails {
  business: {
    name: string;
  };
  serviceType: string;
  totalPrice: string;
}

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from localStorage or URL params
    const savedOrderData = localStorage.getItem('selectedBusinessData');
    const serviceType = localStorage.getItem('profileOperationMode');
    const totalPrice = localStorage.getItem('totalPrice');
    
    if (savedOrderData) {
      try {
        const businessData = JSON.parse(savedOrderData);
        setOrderDetails({
          business: businessData,
          serviceType: serviceType || '',
          totalPrice: totalPrice || '0'
        });
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-[family-name:var(--font-geist-sans)]">
      {/* Simple Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0D2959] flex items-center justify-center">
              <span className="text-white font-bold text-xs">MW</span>
            </div>
            <span className="font-semibold text-[#0D2959]">MapWipers</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D2959] mb-4">
            Order Received Successfully!
          </h1>
          <p className="text-xl text-[#0D2959]/70 mb-8">
            Thank you for your order. We&apos;ll begin processing your request shortly.
          </p>
        </div>

        {orderDetails && (
          <div className="bg-white rounded-xl shadow-lg border border-[#0D2959]/10 p-6 mb-8">
            <h2 className="text-xl font-bold text-[#0D2959] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#0D2959]/70">Business:</span>
                <span className="font-medium text-[#0D2959]">{orderDetails.business.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#0D2959]/70">Service:</span>
                <span className="font-medium text-[#0D2959]">
                  {orderDetails.serviceType === 'remove' ? 'Remove Profile' : 'Reset Profile'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#0D2959]/70">Total Price:</span>
                <span className="font-bold text-[#F17313] text-lg">${orderDetails.totalPrice}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#0D2959]/70">Order ID:</span>
                  <span className="font-mono text-sm text-[#0D2959]">ORDER_{Date.now()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#0D2959] mb-3">What happens next?</h3>
          <div className="space-y-3 text-sm text-[#0D2959]">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#F17313] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
              <div>
                <strong>Order Review</strong> - We&apos;ll review your request within 24 hours
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#F17313] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
              <div>
                <strong>Process Start</strong> - Our team will begin working on your Google Maps profile
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#F17313] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
              <div>
                <strong>Completion & Payment</strong> - Once completed, you&apos;ll receive an invoice and payment link
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-[#0D2959]/5 rounded-lg p-6 mb-6">
            <p className="text-[#0D2959] mb-4">
              <strong>Important:</strong> You will only be charged after the service has been successfully completed.
            </p>
            <p className="text-sm text-[#0D2959]/70">
              We&apos;ll keep you updated via email throughout the process.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#F17313] text-white rounded-lg font-medium hover:bg-[#F17313]/90 transition"
            >
              Return to Home
            </Link>
            <a
              href="mailto:support@mapwipers.com"
              className="px-6 py-3 border border-[#0D2959] text-[#0D2959] rounded-lg font-medium hover:bg-[#0D2959]/5 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
