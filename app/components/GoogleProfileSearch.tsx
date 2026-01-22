"use client";

import React, { useState, useEffect, useMemo } from "react";
import { GmbLocation, PlaceDetails, Removal } from "../types";
import { usePricing } from "../hooks/usePricing";
interface GoogleProfileSearchProps {
  onSelectionChange?: (isSelected: boolean) => void;
  onProceedToOrder?: (orderData: {
    selectedBusiness: PlaceDetails;
    serviceType: 'remove' | 'reset';
    yearProtection: boolean;
    expressService: boolean;
    totalPrice: number;
  }) => void;
  isModal?: boolean;
  resetTrigger?: number; // Add a reset trigger prop
}

const GoogleProfileSearch = ({ onSelectionChange, onProceedToOrder, isModal = false, resetTrigger }: GoogleProfileSearchProps) => {

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<'remove' | 'reset' | null>(null);

  // Track search context for logging
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  const [lastSearchResultsCount, setLastSearchResultsCount] = useState<number>(0);

  // Animated placeholder state
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>("Search for business name...");
  const [showCursor, setShowCursor] = useState<boolean>(true);

  // Placeholder phrases
  const placeholderPhrases = useMemo(() => [
    "Search for your business name...",
    "Try 'Pizza Restaurant NYC'...",
    "Enter your company name...",
    "Find 'Hair Salon Los Angeles'...",
    "Search your Google listing...",
    "Type 'Dentist Miami Beach'...",
    "Find your business profile...",
    "Search 'Coffee Shop Seattle'...",
    "Enter business + location...",
    "Try 'Auto Repair Chicago'..."
  ], []);

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

  // Search for GMB locations
  const searchLocations = React.useCallback(async (query: string) => {
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
        setLastSearchQuery("");
        setLastSearchResultsCount(0);
      } else {
        setLocations(data.locations);
        setShowResults(true);
        setHeadingText(`Results for "${query}"`);
        // Store search context for later use when business is selected
        setLastSearchQuery(query);
        setLastSearchResultsCount(data.locations.length);
      }
    } catch (error: unknown) {
      console.error('Error searching locations:', error instanceof Error ? error.message : error);
      setErrorMessage('An error occurred while searching. Please try again.');
      setLocations([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        searchLocations(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      // Reset all state to initial values
      setSearchQuery("");
      setLocations([]);
      setIsSearching(false);
      setShowResults(false);
      setErrorMessage(null);
      setSelectedPlaceDetails(null);
      setIsLoadingDetails(false);
      setShowSearch(true);
      setHeadingText("Find your business");
      setRemovals([{ companyName: '', nip: '' }]);
      setServiceType(null);
      setYearProtection(false);
      setExpressService(false);
      setAnimationState('idle');
      setShowModal(false);
      setModalContent(null);

      // Also clear localStorage
      localStorage.removeItem('selectedBusinessData');
      localStorage.removeItem('profileOperationMode');
      localStorage.removeItem('serviceDescription');
      localStorage.removeItem('yearProtection');
      localStorage.removeItem('expressService');
      localStorage.removeItem('totalPrice');

      // Notify parent that selection has been cleared
      if (onSelectionChange) {
        onSelectionChange(false);
      }
    }
  }, [resetTrigger, onSelectionChange]);

  // Animated placeholder effect with typing
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      const currentPhrase = placeholderPhrases[phraseIndex];

      if (isDeleting) {
        // Deleting characters
        setCurrentPlaceholder(currentPhrase.substring(0, charIndex));
        charIndex--;

        if (charIndex < 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % placeholderPhrases.length;
          charIndex = 0;
          setTimeout(typeText, 500); // Pause before typing new phrase
          return;
        }
      } else {
        // Typing characters
        setCurrentPlaceholder(currentPhrase.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentPhrase.length) {
          setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 2000); // Pause when phrase is complete
          return;
        }
      }

      setTimeout(typeText, isDeleting ? 50 : 100); // Faster deleting than typing
    };

    const timer = setTimeout(typeText, 1000); // Initial delay

    return () => clearTimeout(timer);
  }, [placeholderPhrases]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Mobile keyboard handling - scroll page up when input is focused
  useEffect(() => {
    const handleInputFocus = () => {
      // Check if device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        setTimeout(() => {
          // Scroll to top of the page to avoid keyboard hiding input
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 300); // Delay to allow keyboard to appear
      }
    };

    const handleInputBlur = () => {
      // Optional: could restore scroll position on blur if needed
    };

    // Add event listeners to all input fields in the component
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
    });

    return () => {
      // Cleanup event listeners
      inputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
        input.removeEventListener('blur', handleInputBlur);
      });
    };
  }, []);

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

      // Save the selected business to database when user selects from list
      console.log('💾 DEBUG: Business selected from list, saving to database:', data.details.name);
      saveToDatabase({ details: data.details }, lastSearchQuery, lastSearchResultsCount);

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
  const saveToDatabase = async (data: { details: PlaceDetails }, searchQuery?: string, searchResultsCount?: number) => {
    console.log('🔍 DEBUG: saveToDatabase called with:', {
      businessName: data.details.name,
      searchQuery,
      searchResultsCount
    });

    try {
      const response = await fetch('/api/searched-gmb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          searchQuery: searchQuery,
          location: null, // You can add location context if needed
          searchResultsCount: searchResultsCount,
          proceedingToOrder: true, // Flag to indicate this is a real selection for order
          isSelected: true
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving to database:', errorText);
      } else {
        console.log('✅ Successfully saved to database:', data.details.name);
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
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 DEBUG: handleSubmit called - proceeding to order');

    if (!serviceType) {
      setErrorMessage("Please select a service type (Remove or Reset profile)");
      return;
    }

    if (!selectedPlaceDetails) {
      setErrorMessage("No business selected");
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

    // Business was already saved to database when user selected it from list
    console.log('🚀 DEBUG: Proceeding to order (business already saved to database)');

    // Call the proceed callback to navigate to order form
    if (onProceedToOrder) {
      onProceedToOrder({
        selectedBusiness: selectedPlaceDetails,
        serviceType,
        yearProtection,
        expressService,
        totalPrice
      });
    } else {
      // Fallback - here you would normally submit the form or go to the next step
      console.log('Form submitted:', {
        removals,
        serviceType,
        yearProtection,
        expressService,
        totalPrice
      });
    }
  };

  // Function to open service details modal
  const openServiceModal = (service: 'remove' | 'reset') => {
    setModalContent(service);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section with Main Heading - Hidden in modal */}
      {!isModal && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0D2959] mb-6 leading-tight">
            Google Maps Business Profile Removal
          </h1>
          <p className="text-xl md:text-2xl text-[#0D2959]/70 max-w-4xl mx-auto leading-relaxed">
            Remove your business profile or reset reviews. We effectively eliminate unwanted content from Google Maps.
          </p>
        </div>
      )}

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

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          20% {
            transform: translateX(200%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        
        .shine-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shine 5s ease-in-out infinite;
          transform: translateX(-100%) skewX(-15deg);
        }
      `}</style>

      {showSearch ? (
        // Search form with animated heading and results
        <div className={`mb-8 max-w-4xl mx-auto mt-5 relative ${animationState === 'exiting' ? 'slide-out-left' : animationState === 'entering' ? 'slide-in-right' : ''}`}>
          {/* Animated heading that slides up when results appear */}
          <h1
            className={`hidden text-2xl md:text-xl font-bold  mt-10 transition-all duration-300 ease-in-out  ${showResults && locations.length > 0
              ? 'transform -translate-y-4 text-md md:text-xl text-[#0D2959]'
              : 'text-[#0D2959]'
              }`}
          >
            {headingText}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex gap-2 w-full landscape:gap-1">
              <input
                type="text"
                placeholder={`${currentPlaceholder}${showCursor ? '|' : ''}`}
                value={searchQuery}
                onChange={handleSearchChange}
                className={`flex-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F17313] transition-all duration-300 placeholder:transition-all placeholder:duration-300 w-full min-w-0 ${isModal
                  ? 'px-3 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl placeholder:text-gray-400 placeholder:text-lg sm:placeholder:text-xl landscape:py-2 landscape:text-base landscape:placeholder:text-base'
                  : 'px-4 py-4 text-lg placeholder:text-lg landscape:py-3 landscape:text-base landscape:placeholder:text-base'
                  } ${showResults && locations.length > 0 ? 'border-[#F17313]' : ''
                  }`}
              />
              <button
                type="button"
                onClick={() => searchQuery.length >= 2 && searchLocations(searchQuery)}
                className={`bg-[#F17313] text-white rounded-lg hover:opacity-90 transition flex-shrink-0 relative overflow-hidden shine-button ${isModal
                  ? 'px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg landscape:py-2 landscape:text-sm landscape:px-4'
                  : 'px-6 sm:px-6 py-4 landscape:py-3 landscape:px-5'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 landscape:h-4 landscape:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Search</span>
                </span>
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
            className={`overflow-hidden transition-all duration-500 ease-in-out ${showResults && locations.length > 0
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#0D2959]/10 h-full flex flex-col">
                <div className="relative flex-1 min-h-[300px]">
                  {/* Google Maps Embed */}
                  <div className="absolute inset-0 bg-[#0D2959]/5 overflow-hidden rounded-t-xl">
                    {selectedPlaceDetails.geometry?.location ? (
                      <iframe
                        width="100%"
                        height="100%"
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
                        height="100%"
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

                <div className="p-5 flex-shrink-0">
                  {/* Business info with accent colors */}
                  <div className="border-l-4 border-[#F17313] pl-3 mb-4">
                    <h3 className="text-xl font-bold text-[#0D2959]">{selectedPlaceDetails.name}</h3>
                    <p className="text-sm text-[#0D2959]/70">{selectedPlaceDetails.formatted_address || selectedPlaceDetails.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedPlaceDetails.rating && (
                      <div className="flex items-center gap-2 text-[#0D2959]">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(selectedPlaceDetails.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-bold">{selectedPlaceDetails.rating}</span>
                        <span className="text-[#0D2959]/50">({selectedPlaceDetails.user_ratings_total})</span>
                      </div>
                    )}
                    {selectedPlaceDetails.businessStatus && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedPlaceDetails.businessStatus === 'OPERATIONAL'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {selectedPlaceDetails.businessStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Service Selection Form */}
            <div className="md:w-7/12">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#0D2959]/10">
                <h4 className="text-xl font-bold text-[#0D2959] mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F17313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Select Service
                </h4>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option 1: Remove Profile */}
                    <div
                      onClick={() => setServiceType('remove')}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${serviceType === 'remove'
                        ? 'border-[#F17313] bg-[#F17313]/5'
                        : 'border-gray-100 bg-gray-50'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-[#0D2959]">{getServiceName('remove')}</h5>
                        {serviceType === 'remove' && (
                          <div className="text-[#F17313]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#0D2959]/70 mb-3 leading-relaxed">
                        {getServiceDescription('remove')}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openServiceModal('remove'); }}
                        className="text-xs font-semibold text-[#F17313] hover:underline"
                      >
                        Details
                      </button>
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-black text-[#0D2959]">
                          {getServicePrice('remove')} PLN
                        </span>
                      </div>
                    </div>

                    {/* Option 2: Reset Profile */}
                    <div
                      onClick={() => setServiceType('reset')}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${serviceType === 'reset'
                        ? 'border-[#F17313] bg-[#F17313]/5'
                        : 'border-gray-100 bg-gray-50'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-[#0D2959]">{getServiceName('reset')}</h5>
                        {serviceType === 'reset' && (
                          <div className="text-[#F17313]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#0D2959]/70 mb-3 leading-relaxed">
                        {getServiceDescription('reset')}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openServiceModal('reset'); }}
                        className="text-xs font-semibold text-[#F17313] hover:underline"
                      >
                        Details
                      </button>
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-black text-[#0D2959]">
                          {getServicePrice('reset')} PLN
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Section */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-[#0D2959] uppercase tracking-wider">
                      Optional Upgrades
                    </h5>

                    {/* Year Protection */}
                    <div
                      onClick={() => setYearProtection(!yearProtection)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${yearProtection ? 'border-[#F17313] bg-[#F17313]/5' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${yearProtection ? 'bg-[#F17313] border-[#F17313]' : 'border-gray-300'
                          }`}>
                          {yearProtection && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0D2959]">{getAddonName('yearProtection')}</p>
                          <p className="text-xs text-[#0D2959]/60">{getAddonDescription('yearProtection')}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#0D2959]">+{getAddonPrice('yearProtection')} PLN</span>
                    </div>

                    {/* Express Service */}
                    <div
                      onClick={() => setExpressService(!expressService)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${expressService ? 'border-[#F17313] bg-[#F17313]/5' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${expressService ? 'bg-[#F17313] border-[#F17313]' : 'border-gray-300'
                          }`}>
                          {expressService && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0D2959]">{getAddonName('expressService')}</p>
                          <p className="text-xs text-[#0D2959]/60">{getAddonDescription('expressService')}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#0D2959]">+{getAddonPrice('expressService')} PLN</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  {/* Summary and Submit */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[#0D2959]/60 font-medium">
                        Total amount:
                      </span>
                      <span className="text-3xl font-black text-[#0D2959]">
                        {serviceType ? calculateTotal(serviceType, yearProtection, expressService) : 0} PLN
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!serviceType || pricingLoading}
                      className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${serviceType
                        ? 'bg-[#F17313] text-white hover:bg-[#e0660d] hover:shadow-xl pulse-glow'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Proceed to Order
                    </button>
                    <p className="text-center text-[10px] text-[#0D2959]/40 mt-4 leading-relaxed">
                      By clicking "Proceed to Order", you agree to our Terms of Service and Privacy Policy. Transaction data is securely processed by Stripe.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D2959]/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fadeInUp">
            <div className={`h-2 w-full ${modalContent === 'remove' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#0D2959]">{getServiceName(modalContent)}</h3>
                  <p className="text-[#F17313] font-bold">{getServicePrice(modalContent)} PLN</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-[#0D2959]/80 mb-8">
                <p className="text-base leading-relaxed">
                  {getServiceDescription(modalContent)}
                </p>

                <h4 className="text-lg font-bold text-[#0D2959] mt-6 mb-3">
                  What does it include?
                </h4>
                <ul className="space-y-3">
                  {modalContent === 'remove' ? (
                    <>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Complete removal of the listing from Google Maps and search results.</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Clearing all review history, photos, and posts.</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Preventing further negative interactions at this address.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Removing the current profile with negative reviews.</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Creating a new, clean listing for your business.</span>
                      </li>
                      <li className="flex gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Maintaining map visibility while refreshing your reputation.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => { setServiceType(modalContent); closeModal(); }}
                className="w-full py-4 bg-[#0D2959] text-white font-bold rounded-xl hover:bg-opacity-90 transition-all"
              >
                Choose this service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleProfileSearch;