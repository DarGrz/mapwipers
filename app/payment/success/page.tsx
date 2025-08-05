'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderDetails {
  orderId: string;
  businessName: string;
  serviceType: string;
  status: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // In a real app, you'd fetch order details from your backend
      // For now, we'll get them from localStorage as a fallback
      const storedOrder = localStorage.getItem('currentOrder');
      if (storedOrder) {
        const order = JSON.parse(storedOrder);
        setOrderDetails({
          orderId: sessionId,
          businessName: order.businessName || 'Your Business',
          serviceType: order.serviceType || 'Google My Business Management',
          status: 'paid'
        });
        // Clear the stored order since payment is complete
        localStorage.removeItem('currentOrder');
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. We&apos;ll start working on your project right away.</p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
            
            {orderDetails ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{orderDetails.orderId}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium text-gray-900">{orderDetails.businessName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900">{orderDetails.serviceType}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Order details are being processed. You should receive a confirmation email shortly.</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 px-6 py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <p className="text-gray-700">You&apos;ll receive a confirmation email with your order details and invoice.</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <p className="text-gray-700">Our team will contact you within 24 hours to begin the service setup.</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <p className="text-gray-700">We&apos;ll start implementing your Google My Business improvements immediately.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Questions about your order?</p>
              <p className="text-sm text-gray-500">
                Contact us at{' '}
                <a href="mailto:support@mapwipers.com" className="text-blue-600 hover:text-blue-500">
                  support@mapwipers.com
                </a>
                {' '}or call{' '}
                <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-500">
                  (123) 456-7890
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Return Home Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
