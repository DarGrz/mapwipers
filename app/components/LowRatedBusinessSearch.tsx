"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface SearchResult {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  lastReviewDate: string;
}

const LowRatedBusinessSearch: React.FC = () => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  
  // Mock categories for the dropdown
  const categories = [
    'Restaurants',
    'Hotels',
    'Dentists',
    'Beauty Salons',
    'Auto Repair',
    'Plumbers',
    'Real Estate',
    'Lawyers',
    'Gyms & Fitness',
    'Electricians'
  ];
  
  // Mock search function - In a real app, this would connect to a backend API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults([]);
    
    // Simulate API request delay
    setTimeout(() => {
      // Mock data for demonstration
      const mockResults: SearchResult[] = [
        {
          placeId: 'place123',
          name: 'Sunrise Cafe',
          address: '123 Main St, ' + (location || 'New York'),
          rating: 2.1,
          reviewCount: 18,
          lastReviewDate: '2023-11-15'
        },
        {
          placeId: 'place456',
          name: 'City Dental Care',
          address: '456 Oak Ave, ' + (location || 'New York'),
          rating: 1.9,
          reviewCount: 24,
          lastReviewDate: '2023-12-05'
        },
        {
          placeId: 'place789',
          name: 'Quick Fix Auto Shop',
          address: '789 Pine Blvd, ' + (location || 'New York'),
          rating: 2.4,
          reviewCount: 31,
          lastReviewDate: '2024-01-20'
        },
        {
          placeId: 'place012',
          name: 'Riverside Hotel',
          address: '101 River Rd, ' + (location || 'New York'),
          rating: 2.7,
          reviewCount: 42,
          lastReviewDate: '2024-02-10'
        },
        {
          placeId: 'place345',
          name: 'Golden Spa & Salon',
          address: '222 Elm St, ' + (location || 'New York'),
          rating: 2.3,
          reviewCount: 15,
          lastReviewDate: '2024-03-01'
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };
  
  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
  };
  
  // Generate star rating display
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starColor = rating < 3.0 ? "text-red-500" : "text-yellow-500";
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className={`w-4 h-4 ${starColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {halfStar && (
          <svg className={`w-4 h-4 ${starColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="inset(0 50% 0 0)" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className={`ml-1 text-sm font-semibold ${starColor}`}>{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Find Low-Rated Businesses Near You</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or zip code"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSearching}
              className={`px-6 py-2 bg-[#0D2959] hover:bg-opacity-90 text-white rounded-md shadow-sm ${
                isSearching ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search Businesses'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {searchResults.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">Low-Rated Businesses Found</h3>
          <p className="text-sm text-gray-600 mb-4">
            We found {searchResults.length} businesses with ratings below 3.0 stars. Click on a business to see details.
          </p>
          
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.placeId}
                onClick={() => handleResultSelect(result)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedResult?.placeId === result.placeId
                    ? 'border-[#0D2959] bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm text-gray-600">{result.address}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {renderStarRating(result.rating)}
                    <p className="text-sm text-gray-500">({result.reviewCount} reviews)</p>
                  </div>
                </div>
                
                {selectedResult?.placeId === result.placeId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Last review:</span> {new Date(selectedResult.lastReviewDate).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            Potential Reputation Issue
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">                        <Link
                          href="/"
                          className="inline-block px-4 py-2 bg-[#0D2959] hover:bg-opacity-90 text-white rounded-md text-sm"
                        >
                          Reset This Profile
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <p className="font-medium text-gray-700 mb-1">Why reset this profile?</p>
                      <ul className="text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-red-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Rating below 3.0 stars (high risk of lost business)</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-red-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Recent negative reviews affecting visibility</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How This Works</h3>
        <p className="text-gray-700 mb-4">
          Our tool helps you identify businesses with poor ratings that could benefit from a profile reset. Once you find a business that needs help:
        </p>
        <ol className="text-gray-700 space-y-2 list-decimal list-inside mb-4">
          <li>Click on the business to see details</li>
          <li>Click &quot;Reset This Profile&quot; to start the process</li>
          <li>Our team will handle the removal and setup of a fresh profile</li>
          <li>You&apos;ll only pay after the service is successfully completed</li>
        </ol>
        <p className="text-sm text-gray-600">
          Note: This service is only for business owners or authorized representatives.
        </p>
      </div>
    </div>
  );
};

export default LowRatedBusinessSearch;
