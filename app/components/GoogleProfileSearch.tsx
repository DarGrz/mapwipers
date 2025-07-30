"use client";

import React, { useState, useEffect } from "react";
import { GmbLocation, PlaceDetails, Removal } from "../types";
import { usePricing } from "../hooks/usePricing";

interface GoogleProfileSearchProps {
  onSelectionChange?: (isSelected: boolean) => void;
}

const GoogleProfileSearch = ({ onSelectionChange }: GoogleProfileSearchProps) => {
  // Pricing hook
  const { 
    loading: pricingLoading, 
    calculateTotal, 
    getServicePrice, 
    getAddonPrice,
    getServiceName,
    getAddonName,
    getServiceDescription,
    getAddonDescription
  } = usePricing();

  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locations, setLocations] = useState<GmbLocation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<PlaceDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [headingText, setHeadingText] = useState<string>("Find your business");
  const [removals, setRemovals] = useState<Removal[]>([
    { companyName: '', nip: '' }
  ]);
  const [serviceType, setServiceType] = useState<'remove' | 'reset' | null>(null);
  const [yearProtection, setYearProtection] = useState<boolean>(false);
  const [expressService, setExpressService] = useState<boolean>(false);
  const [animationState, setAnimationState] = useState<'idle' | 'exiting' | 'entering'>('idle');

  // Check localStorage for previously selected business on component mount
  useEffect(() => {
    const savedBusinessData = localStorage.getItem('selectedBusinessData');
    const savedServiceType = localStorage.getItem('profileOperationMode');
    const savedYearProtection = localStorage.getItem('yearProtection');
    const savedExpressService = localStorage.getItem('expressService');
    
    if (savedBusinessData) {
      try {
        const businessData = JSON.parse(savedBusinessData);
        setSelectedPlaceDetails(businessData);
        setShowSearch(false);
        setHeadingText(businessData.name || "Selected Business");
        
        // Restore service selections if available
        if (savedServiceType) {
          setServiceType(savedServiceType as 'remove' | 'reset');
        }
        if (savedYearProtection) {
          setYearProtection(savedYearProtection === 'true');
        }
        if (savedExpressService) {
          setExpressService(savedExpressService === 'true');
        }
        
        // Update removals with the selected business
        setRemovals([{ companyName: businessData.name || '', nip: '' }]);
        
        // Notify parent that GMB is selected
        if (onSelectionChange) {
          onSelectionChange(true);
        }
      } catch (error) {
        console.error('Error parsing saved business data:', error);
        // Clear invalid data
        localStorage.removeItem('selectedBusinessData');
      }
    }
  }, [onSelectionChange]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        searchLocations(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search for GMB locations
  const searchLocations = async (query: string) => {
    setIsSearching(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`/api/gmb-search?query=${encodeURIComponent(query)}`);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        setErrorMessage(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        setLocations([]);
        setShowResults(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
        if (!data.locations || data.locations.length === 0) {
        setErrorMessage('No results found. Please try a different search term.');
        setLocations([]);
        setHeadingText("Find your business");
      } else {
        setLocations(data.locations);
        setShowResults(true);
        setHeadingText(`Results for "${query}"`);
      }
    } catch (error: unknown) {
      console.error('Error searching locations:', error instanceof Error ? error.message : error);
      setErrorMessage('An error occurred while searching. Please try again.');
      setLocations([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to fetch place details
  const fetchPlaceDetails = async (placeId: string) => {
    setIsLoadingDetails(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`/api/places-details?placeId=${placeId}`);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        setErrorMessage(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.details) {
        setErrorMessage('No details found for this place.');
        return;
      }
      
      console.log('Place details received:', data.details); // Debug log
      console.log('Phone number fields:', {
        formatted_phone_number: data.details.formatted_phone_number,
        international_phone_number: data.details.international_phone_number,
        phoneNumber: data.details.phoneNumber,
        phone: data.details.phone
      }); // Debug phone fields
      
      setSelectedPlaceDetails(data.details);
      
      // Update the form with the selected place
      const newRemovals = [...removals];
      newRemovals[0] = {
        ...removals[0],
        companyName: data.details.name
      };
      setRemovals(newRemovals);
      
      // Save to database
      saveToDatabase(data);
      
      // Save selected business to localStorage for persistence
      localStorage.setItem('selectedBusinessData', JSON.stringify(data.details));
      
      // Hide search when a business is selected
      setShowSearch(false);
      
      // Notify parent component that a GMB is selected
      if (onSelectionChange) {
        onSelectionChange(true);
      }
      
    } catch (error: unknown) {
      console.error('Error fetching place details:', error instanceof Error ? error.message : error);
      setErrorMessage('An error occurred while fetching details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Save selected profile to database
  const saveToDatabase = async (data: { details: PlaceDetails }) => {
    try {
      const response = await fetch('/api/searched-gmb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error('Error saving to database:', await response.text());
      }
    } catch (error: unknown) {
      console.error('Error saving to database:', error instanceof Error ? error.message : error);
    }
  };
  // Select a location from search results
  const selectLocation = (location: GmbLocation) => {
    setAnimationState('exiting');
    setTimeout(() => {
      setShowResults(false);
      setSearchQuery('');
      setHeadingText(location.name);
      fetchPlaceDetails(location.placeId);
      setAnimationState('entering');
      
      // Reset additional features when selecting a new location
      setYearProtection(false);
      setExpressService(false);
    }, 300); // Match this with the animation duration
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length < 2) {
      setShowResults(false);
    }
  };  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      if (!serviceType) {
      setErrorMessage("Please select a service type (Remove or Reset profile)");
      return;
    }
    
    // Calculate total price based on selections using pricing hook
    const totalPrice = calculateTotal(serviceType, yearProtection, expressService);
    
    // Save data to localStorage
    localStorage.setItem("profileOperationMode", serviceType);
    localStorage.setItem("serviceDescription", 
      serviceType === "remove" 
        ? getServiceDescription('remove')
        : getServiceDescription('reset')
    );
    localStorage.setItem("yearProtection", yearProtection ? "true" : "false");
    localStorage.setItem("expressService", expressService ? "true" : "false");
    localStorage.setItem("totalPrice", totalPrice.toString());
    
    // Here you would normally submit the form or go to the next step
    console.log('Form submitted:', { 
      removals, 
      serviceType, 
      yearProtection, 
      expressService,
      totalPrice
    });
  };
  // Function to reset selection and return to search
  const resetSelection = () => {
    setAnimationState('exiting');
    setTimeout(() => {
      setSelectedPlaceDetails(null);
      setServiceType(null);
      setYearProtection(false);
      setExpressService(false);
      setShowSearch(true);
      setHeadingText("Find your business");
      setAnimationState('entering');
      
      // Clear localStorage
      localStorage.removeItem('selectedBusinessData');
      localStorage.removeItem('profileOperationMode');
      localStorage.removeItem('serviceDescription');
      localStorage.removeItem('yearProtection');
      localStorage.removeItem('expressService');
      localStorage.removeItem('totalPrice');
      
      // Notify parent component that GMB is no longer selected
      if (onSelectionChange) {
        onSelectionChange(false);
      }
    }, 300); // Match this with the animation duration
    
    // After entering animation completes, set to idle
    setTimeout(() => {
      setAnimationState('idle');
    }, 600);
  };  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Hero Section with Main Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-[#0D2959] mb-6 leading-tight">
          Google Maps Business Profile Removal
        </h1>
        <p className="text-xl md:text-2xl text-[#0D2959]/70 max-w-4xl mx-auto leading-relaxed">
          Remove your business profile or reset reviews. We effectively eliminate unwanted content from Google Maps.
        </p>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .result-item {
          animation: fadeInUp 0.3s ease-in-out forwards;
          opacity: 0;
        }
        .result-item:nth-child(1) { animation-delay: 0.05s; }
        .result-item:nth-child(2) { animation-delay: 0.1s; }
        .result-item:nth-child(3) { animation-delay: 0.15s; }
        .result-item:nth-child(4) { animation-delay: 0.2s; }
        .result-item:nth-child(5) { animation-delay: 0.25s; }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(241, 115, 19, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(241, 115, 19, 0); }
          100% { box-shadow: 0 0 0 0 rgba(241, 115, 19, 0); }
        }
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }
        
        .slide-in-right {
          animation: slideInFromRight 0.4s ease-out forwards;
        }
        
        .slide-out-left {
          animation: slideOutToLeft 0.3s ease-in forwards;
        }
      `}</style>
      
      {showSearch ? (
        // Search form with animated heading and results
        <div className={`mb-8 mt-5 relative ${animationState === 'exiting' ? 'slide-out-left' : animationState === 'entering' ? 'slide-in-right' : ''}`}>
          {/* Animated heading that slides up when results appear */}          <h1 
            className={`hidden text-2xl md:text-xl font-bold  mt-10 transition-all duration-300 ease-in-out  ${
              showResults && locations.length > 0 
                ? 'transform -translate-y-4 text-md md:text-xl text-[#0D2959]' 
                : 'text-[#0D2959]'
            }`}
          >
            {headingText}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for business name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F17313] transition-all duration-300 ${
                  showResults && locations.length > 0 ? 'border-[#F17313]' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => searchQuery.length >= 2 && searchLocations(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#F17313] text-white rounded-md hover:opacity-90 transition"
              >
                Search
              </button>
            </div>
          </form>
          
          {isSearching && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F17313]"></div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-[#F17313]/10 text-[#0D2959] p-3 rounded-md mt-4">
              {errorMessage}
            </div>
          )}

          {/* Results container with slide-in animation */}
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showResults && locations.length > 0
                ? 'max-h-96 opacity-100 mt-5'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid gap-4">
              {locations.map((location) => (
                <div
                  key={location.placeId}                  
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#F17313] hover:shadow-md transition cursor-pointer result-item"
                  onClick={() => selectLocation(location)}
                >
                  <h4 className="font-medium text-[#0D2959]">{location.name}</h4>
                  <p className="text-sm text-[#0D2959]/70">{location.address}</p>
                </div>
              ))}
            </div>
          </div>

          {showResults && locations.length === 0 && !isSearching && (
            <div className="mt-4 p-3 bg-[#0D2959]/5 rounded-md text-center text-[#0D2959]">
              No results found. Please try a different search term.
            </div>
          )}
        </div>
      ) : null}

      {isLoadingDetails && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F17313]"></div>
        </div>
      )}

      {selectedPlaceDetails && (
        <div className={`${animationState === 'exiting' ? 'slide-out-left' : animationState === 'entering' ? 'slide-in-right' : ''}`}>
          {/* Two column layout for selected business */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Map and business details */}
            <div className="md:w-5/12">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#0D2959]/10 h-full">
                <div className="relative">
                  {/* Google Maps Embed */}
                  <div className="h-48 bg-[#0D2959]/5 relative overflow-hidden rounded-t-xl">
                    {selectedPlaceDetails.geometry?.location ? (
                      <iframe
                        width="100%"
                        height="192"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${selectedPlaceDetails.geometry.location.lat},${selectedPlaceDetails.geometry.location.lng}&zoom=15&maptype=roadmap`}
                        title={`Map of ${selectedPlaceDetails.name}`}
                        onError={() => console.error('Error loading Google Maps')}
                      />
                    ) : selectedPlaceDetails.formatted_address || selectedPlaceDetails.address ? (
                      <iframe
                        width="100%"
                        height="192"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(selectedPlaceDetails.formatted_address || selectedPlaceDetails.address || selectedPlaceDetails.name)}&zoom=15&maptype=roadmap`}
                        title={`Map of ${selectedPlaceDetails.name}`}
                        onError={() => console.error('Error loading Google Maps')}
                      />
                    ) : (
                      // Fallback gdy nie ma danych lokalizacyjnych
                      <div className="w-full h-full flex items-center justify-center bg-[#0D2959]/5">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0D2959]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-[#0D2959]/60 mt-2 text-sm">Location not available</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Close button */}
                  <button 
                    onClick={resetSelection}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#F17313]/10 transition"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0D2959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-5">
                  {/* Business info with accent colors */}
                  <div className="border-l-4 border-[#F17313] pl-3 mb-4">
                    <h3 className="text-xl font-bold text-[#0D2959]">{selectedPlaceDetails.name}</h3>
                    <p className="text-[#0D2959]/70">{selectedPlaceDetails.formatted_address || selectedPlaceDetails.address}</p>
                  </div>
                  
                  <div className="mb-4 grid grid-cols-1 gap-4 text-sm">
                    {(selectedPlaceDetails.formatted_phone_number || selectedPlaceDetails.international_phone_number || selectedPlaceDetails.phoneNumber) && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F17313] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-[#0D2959]">{selectedPlaceDetails.formatted_phone_number || selectedPlaceDetails.international_phone_number || selectedPlaceDetails.phoneNumber}</span>
                      </div>
                    )}
                    
                    {selectedPlaceDetails.website && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F17313] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a href={selectedPlaceDetails.website} target="_blank" rel="noopener noreferrer" className="text-[#0D2959] hover:text-[#F17313] hover:underline truncate max-w-[16rem] transition">
                          {new URL(selectedPlaceDetails.website).hostname}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {selectedPlaceDetails.rating && (
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(selectedPlaceDetails.rating || 0) ? 'text-[#F17313]' : 'text-[#0D2959]/20'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-[#0D2959]">{selectedPlaceDetails.rating} ({selectedPlaceDetails.user_ratings_total} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Service options */}
            <div className="md:w-7/12">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#0D2959]/10 p-5">
                <h2 className="text-xl font-bold text-[#0D2959] mb-4">Select Service Options</h2>
                
                {/* Service type selection */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[#0D2959] mb-3">Service Type:</h4>
                  {pricingLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F17313]"></div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${serviceType === 'remove' ? 'border-[#F17313] bg-[#F17313]/5' : 'border-[#0D2959]/20 hover:border-[#F17313]'}`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="remove"
                          checked={serviceType === 'remove'}
                          onChange={() => setServiceType('remove')}
                          className="h-4 w-4 text-[#F17313] focus:ring-[#F17313]"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-[#0D2959]">{getServiceName('remove')}</span>
                          <span className="block text-sm text-[#0D2959]/70">${getServicePrice('remove')}</span>
                        </div>
                      </label>
                      
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${serviceType === 'reset' ? 'border-[#F17313] bg-[#F17313]/5' : 'border-[#0D2959]/20 hover:border-[#F17313]'}`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="reset"
                          checked={serviceType === 'reset'}
                          onChange={() => setServiceType('reset')}
                          className="h-4 w-4 text-[#F17313] focus:ring-[#F17313]"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-[#0D2959]">{getServiceName('reset')}</span>
                          <span className="block text-sm text-[#0D2959]/70">${getServicePrice('reset')}</span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                
                {/* Additional features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[#0D2959] mb-3">Additional Features:</h4>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${yearProtection ? 'border-[#F17313] bg-[#F17313]/5' : 'border-[#0D2959]/20 hover:border-[#F17313]'}`}>
                      <input
                        type="checkbox"
                        checked={yearProtection}
                        onChange={() => setYearProtection(!yearProtection)}
                        className="h-4 w-4 text-[#F17313] focus:ring-[#F17313]"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-[#0D2959]">{getAddonName('yearProtection')}</span>
                        <span className="block text-sm text-[#0D2959]/70">${getAddonPrice('yearProtection')} - {getAddonDescription('yearProtection')}</span>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${expressService ? 'border-[#F17313] bg-[#F17313]/5' : 'border-[#0D2959]/20 hover:border-[#F17313]'}`}>
                      <input
                        type="checkbox"
                        checked={expressService}
                        onChange={() => setExpressService(!expressService)}
                        className="h-4 w-4 text-[#F17313] focus:ring-[#F17313]"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-[#0D2959]">{getAddonName('expressService')}</span>
                        <span className="block text-sm text-[#0D2959]/70">${getAddonPrice('expressService')} - {getAddonDescription('expressService')}</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Total pricing */}
                {serviceType && !pricingLoading && (
                  <div className="mb-6 p-4 bg-[#0D2959]/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#0D2959]">Base Price:</span>
                      <span className="text-[#0D2959]">${getServicePrice(serviceType)}</span>
                    </div>
                    
                    {yearProtection && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-[#0D2959]">{getAddonName('yearProtection')}:</span>
                        <span className="text-[#0D2959]">${getAddonPrice('yearProtection')}</span>
                      </div>
                    )}
                    
                    {expressService && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-[#0D2959]">{getAddonName('expressService')}:</span>
                        <span className="text-[#0D2959]">${getAddonPrice('expressService')}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-[#0D2959]/10 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-[#0D2959]">Total:</span>
                      <span className="font-bold text-[#0D2959]">
                        ${calculateTotal(serviceType, yearProtection, expressService)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Submit button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={!serviceType}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                      serviceType 
                        ? 'bg-[#F17313] text-white hover:bg-[#F17313]/90 pulse-glow' 
                        : 'bg-[#0D2959]/20 text-[#0D2959]/50 cursor-not-allowed'
                    }`}
                  >
                    {serviceType ? 'Proceed with Service' : 'Select a service to continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleProfileSearch;
