"use client";

import React, { useState } from 'react';
import { PlaceDetails } from '../types';

interface ServiceSelectionProps {
  selectedBusiness: PlaceDetails;
  onSelectService: (serviceType: 'remove' | 'reset') => void;
  onBack: () => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  selectedBusiness, 
  onSelectService,
  onBack
}) => {
  const [selectedService, setSelectedService] = useState<'remove' | 'reset' | null>(null);
  
  const handleServiceSelect = (service: 'remove' | 'reset') => {
    setSelectedService(service);
  };
  
  const handleContinue = () => {
    if (selectedService) {
      onSelectService(selectedService);
    }
  };
  
  // Calculate prices based on ratings and reviews
  const removePrice = selectedBusiness.user_ratings_total 
    ? Math.max(499, 499 + Math.floor(selectedBusiness.user_ratings_total / 10) * 50)
    : 499;
    
  const resetPrice = selectedBusiness.user_ratings_total 
    ? Math.max(799, 799 + Math.floor(selectedBusiness.user_ratings_total / 5) * 50)
    : 799;
  
  // Estimate completion time based on complexity
  const removeTime = selectedBusiness.user_ratings_total && selectedBusiness.user_ratings_total > 50 
    ? "7-14 days" 
    : "5-10 days";
    
  const resetTime = selectedBusiness.user_ratings_total && selectedBusiness.user_ratings_total > 50 
    ? "10-18 days" 
    : "7-14 days";

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-[#0D2959] hover:underline"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Business Selection
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Service for {selectedBusiness.name}</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Remove Service Option */}
        <div 
          className={`flex-1 border rounded-lg p-6 cursor-pointer transition-all ${
            selectedService === 'remove' 
              ? 'border-[#0D2959] bg-blue-50 shadow-md' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleServiceSelect('remove')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#0D2959]">{removePrice} PLN</span>
              <p className="text-sm text-gray-500">Est. {removeTime}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Remove Google Business Profile</h3>
          
          <p className="text-gray-600 mb-4">
            Permanently delete your business profile from Google Maps. Ideal if you&apos;ve closed your business or want to completely remove your online presence.
          </p>
          
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Complete removal from Google Maps</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Deletion of all reviews and ratings</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No more unwanted calls or visitors</span>
            </li>
          </ul>
        </div>
        
        {/* Reset Service Option */}
        <div 
          className={`flex-1 border rounded-lg p-6 cursor-pointer transition-all ${
            selectedService === 'reset' 
              ? 'border-[#0D2959] bg-blue-50 shadow-md' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleServiceSelect('reset')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#0D2959]">{resetPrice} PLN</span>
              <p className="text-sm text-gray-500">Est. {resetTime}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Reset Google Business Profile</h3>
          
          <p className="text-gray-600 mb-4">
            Remove the existing profile and create a fresh one with no history. Perfect for businesses that want to start over with a clean reputation.
          </p>
          
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Remove all negative reviews</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Fresh start with a new profile</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Keep your business visible on maps</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 text-[#0D2959] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Important Information
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Payment is only collected after successful completion</li>
          <li>• The process is 100% compliant with Google&apos;s policies</li>
          <li>• You&apos;ll receive progress updates throughout the process</li>
        </ul>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className={`px-6 py-2 rounded-md shadow-sm ${
            selectedService 
              ? 'bg-[#0D2959] hover:bg-opacity-90 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Order Details
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;
