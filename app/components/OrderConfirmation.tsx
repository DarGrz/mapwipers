"use client";

import React from 'react';
import { PlaceDetails } from '../types';
import { OrderFormData } from './OrderForm';
import Link from 'next/link';

interface OrderConfirmationProps {
  selectedBusiness: PlaceDetails;
  serviceType: 'remove' | 'reset';
  servicePrice: number;
  formData: OrderFormData;
  orderNumber: string;
  trackingUrl: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  selectedBusiness,
  serviceType,
  servicePrice,
  formData,
  orderNumber,
  trackingUrl
}) => {
  const handleDownloadPDF = () => {
    // This would normally generate and download a PDF of the order
    alert("This would download a PDF of your order in a real implementation");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    alert("Tracking link copied to clipboard!");
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Order Has Been Received!</h2>
        <p className="text-gray-600">
          Thank you for your order. We&apos;ll start working on your request right away.
        </p>
      </div>
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
          <p className="text-gray-700">
            <span className="font-medium">Order Number:</span> {orderNumber}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Business Information</h4>
            <p className="text-gray-700 mb-1">{selectedBusiness.name}</p>
            <p className="text-gray-600 text-sm mb-1">{selectedBusiness.address}</p>
            {selectedBusiness.phoneNumber && (
              <p className="text-gray-600 text-sm">{selectedBusiness.phoneNumber}</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Service Details</h4>
            <p className="text-gray-700 mb-1">
              {serviceType === 'remove' ? 'Remove Google Business Profile' : 'Reset Google Business Profile'}
            </p>
            <p className="text-gray-600 text-sm mb-1">Price: <span className="font-medium">{servicePrice} PLN</span></p>
            <p className="text-gray-500 text-sm">Payment will be processed after completion</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-100">
          <h4 className="font-medium mb-2">Contact Information</h4>
          <p className="text-gray-700 mb-1">{formData.firstName} {formData.lastName}</p>
          <p className="text-gray-600 text-sm mb-1">Email: {formData.email}</p>
          <p className="text-gray-600 text-sm">Phone: {formData.phone}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">What Happens Next?</h3>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-[#0D2959] rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium">Review & Processing</h4>
              <p className="text-gray-600 text-sm">
                Our team will review your order and begin processing it within 24 hours.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-[#0D2959] rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium">2</span>
            </div>
            <div>
              <h4 className="font-medium">Google Submission</h4>
              <p className="text-gray-600 text-sm">
                We&apos;ll submit the necessary requests to Google and manage the process.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-[#0D2959] rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium">3</span>
            </div>
            <div>
              <h4 className="font-medium">Completion & Payment</h4>
              <p className="text-gray-600 text-sm">
                Once the service is completed, we&apos;ll notify you and provide payment instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Track Your Order</h3>
        <p className="text-gray-600 mb-4">
          You&apos;ll receive an email with a tracking link shortly. You can also use the link below to check the status of your order at any time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-gray-100 p-2 rounded-md flex items-center">
            <input
              type="text"
              value={trackingUrl}
              readOnly
              className="bg-transparent border-0 flex-1 focus:outline-none text-gray-700 text-sm overflow-hidden overflow-ellipsis"
            />
            <button
              onClick={handleCopyLink}
              className="ml-2 text-[#0D2959] hover:text-opacity-80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center px-4 py-2 border border-[#0D2959] text-[#0D2959] bg-white hover:bg-[#0D2959] hover:text-white rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Save as PDF
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          href="/"
          className="inline-flex items-center text-[#0D2959] hover:underline"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
