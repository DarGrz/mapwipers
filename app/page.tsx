"use client";

import GoogleProfileSearch from "./components/GoogleProfileSearch";
import OrderForm, { OrderFormData } from "./components/OrderForm";
import { useState } from "react";
import { PlaceDetails } from "./types";
import { usePricing } from "./hooks/usePricing";

export default function Home() {
  const { getServicePrice, getAddonPrice } = usePricing();
  const formatPrice = (priceUSD: number) => `$${priceUSD}`;

  // Schema.org structured data for SEO and trust
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MapWipers",
    "description": "Professional Google My Business profile removal and management services. Remove fake profiles, reset damaged listings, and protect your business reputation online.",
    "url": "https://mapwipers.com",
    "logo": "https://mapwipers.com/mapwipers_logo-horizontal.png",
    "foundingDate": "2018",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "Remote Service",
      "streetAddress": "Digital Services Office",
      "postalCode": "00000"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English"],
        "description": "24/7 customer support for GMB removal services"
      }
    ],
    "areaServed": "Worldwide",
    "knowsAbout": [
      "Google My Business",
      "Profile Removal",
      "Reputation Management",
      "SEO Services",
      "Business Listings"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Google My Business Profile Removal",
    "description": "Professional removal of fake, duplicate, or unauthorized Google My Business profiles. Guaranteed results within 7-14 days.",
    "provider": {
      "@type": "Organization",
      "name": "MapWipers"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "GMB Removal Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Complete Profile Removal",
            "description": "Complete removal of Google Business Profile including all reviews and content"
          },
          "price": getServicePrice('remove').toString() || "499",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Profile Reset Service",
            "description": "Reset Google Business Profile to clean state, removing negative content"
          },
          "price": getServicePrice('reset').toString() || "599",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MapWipers - Google My Business Profile Removal",
    "description": "Remove fake Google My Business profiles, reset damaged listings, and protect your business reputation. 98% success rate, 7-14 day completion.",
    "url": "https://mapwipers.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mapwipers.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "MapWipers"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Remove Fake Google My Business Profile",
    "description": "Step-by-step guide to removing unauthorized Google My Business profiles",
    "totalTime": "PT14D",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": getServicePrice('remove').toString() || "499"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Search for Your Business",
        "text": "Find your business profile in our search engine to identify unauthorized listings",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Choose Service Type",
        "text": "Select between complete removal or profile reset based on your needs",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Get Results",
        "text": "Receive guaranteed removal within 7-14 days with full progress updates",
        "position": 3
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mapwipers.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "GMB Removal Services",
        "item": "https://mapwipers.com/#pricing"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does it take to remove a fake GMB profile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most fake or unauthorized Google My Business profiles are removed within 7-14 business days. Complex cases involving multiple profiles or extensive documentation may take up to 21 days."
        }
      },
      {
        "@type": "Question",
        "name": "What if the profile doesn't get removed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 100% money-back guarantee. If we cannot successfully remove the unauthorized profile within 30 days, you receive a full refund. Our 98% success rate means this rarely happens."
        }
      },
      {
        "@type": "Question",
        "name": "Can you remove profiles that competitors created?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in removing fake profiles created by competitors using your business name, address, or other identifying information. We document the impersonation and work directly with Google to have these fraudulent listings removed."
        }
      },
      {
        "@type": "Question",
        "name": "Do you need access to my Google account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, we never need access to your personal Google accounts. We work through official Google support channels and reporting systems. You maintain complete control and security of your accounts throughout the process."
        }
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": "MapWipers",
      "url": "https://mapwipers.com"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "name": "Excellent service for removing fake GMB profiles",
    "author": {
      "@type": "Person",
      "name": "Sarah Martinez"
    },
    "reviewBody": "Someone created a fake GMB profile for our restaurant with completely wrong information and damaging reviews. MapWipers successfully removed the entire fake profile within 12 days, saving our reputation and preventing customer confusion.",
    "datePublished": "2024-08-01"
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "MapWipers",
    "description": "Professional Google My Business profile removal and reputation management services",
    "url": "https://mapwipers.com",
    "telephone": "+1-555-MAP-WIPE",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "Remote Service",
      "streetAddress": "Digital Services Office",
      "postalCode": "00000"
    },
    "priceRange": "$499-$599",
    "paymentAccepted": "Credit Card, Debit Card, Stripe",
    "currenciesAccepted": "USD, EUR, GBP",
    "openingHours": "Mo-Su 00:00-23:59",
    "areaServed": "Worldwide",
    "serviceType": "Business Services",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Google Business Support"
      }
    }
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MapWipers GMB Search Tool",
    "description": "Advanced search tool for finding and analyzing Google My Business profiles",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Business Profile Search",
      "Duplicate Detection",
      "Fraud Analysis",
      "Real-time Monitoring"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Google My Business Profile Removal Service",
    "description": "Professional service to remove fake, duplicate, or unauthorized Google My Business profiles with 98% success rate",
    "image": "https://mapwipers.com/mapwipers_logo-horizontal.png",
    "brand": {
      "@type": "Brand",
      "name": "MapWipers"
    },
    "category": "Business Services",
    "offers": [
      {
        "@type": "Offer",
        "name": "Complete Profile Removal",
        "price": "499",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01",
        "priceValidUntil": "2025-12-31",
        "seller": {
          "@type": "Organization",
          "name": "MapWipers"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": "7",
              "maxValue": "14",
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": "30",
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      },
      {
        "@type": "Offer",
        "name": "Profile Reset Service",
        "price": "599",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01",
        "priceValidUntil": "2025-12-31",
        "seller": {
          "@type": "Organization",
          "name": "MapWipers"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": "7",
              "maxValue": "14",
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": "30",
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah Martinez"
        },
        "reviewBody": "Someone created a fake GMB profile for our restaurant with completely wrong information and damaging reviews. MapWipers successfully removed the entire fake profile within 12 days, saving our reputation and preventing customer confusion."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "David Thompson"
        },
        "reviewBody": "A competitor created multiple fake Google Business profiles for our law firm with incorrect contact details and malicious content. MapWipers removed all unauthorized profiles completely within 8 days. Professional and reliable service!"
      }
    ]
  };

  const guaranteeSchema = {
    "@context": "https://schema.org",
    "@type": "Guarantee",
    "name": "100% Money Back Guarantee",
    "description": "If we cannot successfully remove your unauthorized Google My Business profile within 30 days, you receive a full refund",
    "guaranteeLength": "P30D",
    "coverage": "Full refund if service is not completed within 30 days"
  };

  const trustMarkSchema = {
    "@context": "https://schema.org",
    "@type": "TrustMark",
    "name": "Stripe Secured Payments",
    "description": "All payments are processed securely through Stripe with bank-level encryption and PCI compliance",
    "trustMarkURL": "https://stripe.com/security"
  };

  const technicalSupportSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "contactType": "technical support",
    "name": "24/7 Customer Support",
    "description": "Always available to answer questions and provide updates on your case",
    "availableLanguage": ["English"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const certificationSchema = {
    "@context": "https://schema.org",
    "@type": "Certification",
    "name": "Google Business Profile Expert Certification",
    "description": "Certified expertise in Google My Business management and removal processes",
    "certifyingAuthority": {
      "@type": "Organization",
      "name": "Google Business Support"
    },
    "validFrom": "2018-01-01",
    "validUntil": "2030-12-31"
  };
  const [gmbSelected, setGmbSelected] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<'remove' | 'reset' | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0); // Add reset trigger state

  // Order flow state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState<{
    selectedBusiness: PlaceDetails;
    serviceType: 'remove' | 'reset';
    yearProtection: boolean;
    expressService: boolean;
    totalPrice: number;
  } | null>(null);

  // Function to handle GMB selection state changes
  const handleGmbSelectionChange = (isSelected: boolean) => {
    setGmbSelected(isSelected);
  };

  // Function to handle service selection
  const handleServiceSelect = (service: 'remove' | 'reset') => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // Function to handle Start button click
  const handleStartClick = () => {
    setSelectedService(null); // Don't pre-select a service
    setResetTrigger(prev => prev + 1); // Trigger reset of GoogleProfileSearch component
    setGmbSelected(false); // Reset GMB selection state
    setOrderData(null); // Clear any existing order data
    setShowOrderForm(false); // Hide order form if it's showing
    setShowServiceModal(true); // Show the modal
  };

  // Function to handle modal GMB selection
  const handleModalGmbSelection = (isSelected: boolean) => {
    if (isSelected) {
      setShowServiceModal(false);
      setGmbSelected(true);
    }
  };

  // Function to handle proceeding to order form
  const handleProceedToOrder = (data: {
    selectedBusiness: PlaceDetails;
    serviceType: 'remove' | 'reset';
    yearProtection: boolean;
    expressService: boolean;
    totalPrice: number;
  }) => {
    setOrderData(data);
    setShowOrderForm(true);
  };

  // Function to handle going back from order form
  const handleBackFromOrder = () => {
    setShowOrderForm(false);
  };

  // Function to handle order form submission
  const handleOrderSubmit = async (formData: OrderFormData) => {
    try {
      console.log('Submitting order:', { orderData, formData });

      // Call the payment API
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          formData,
          totalPrice: orderData?.totalPrice,
          serviceType: orderData?.serviceType
        }),
      });

      const result = await response.json();

      if (result.success && result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl;
      } else {
        console.error('Payment creation failed:', result.error);
        // TODO: Show user-friendly error message
        alert(`Payment setup failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      // TODO: Show user-friendly error message
      alert('Failed to process order. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-[family-name:var(--font-geist-sans)]">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guaranteeSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trustMarkSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(technicalSupportSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(certificationSchema)
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-16 mt-10 overflow-hidden">
        {showOrderForm && orderData ? (
          // Show order form
          <div className="max-w-4xl mx-auto">
            <OrderForm
              selectedBusiness={orderData.selectedBusiness}
              serviceType={orderData.serviceType}
              servicePrice={orderData.totalPrice}
              estimatedTime={orderData.expressService
                ? "24-48 hours"
                : orderData.serviceType === 'reset'
                  ? "3-5 business days"
                  : "5-7 business days"
              }
              onBack={handleBackFromOrder}
              onSubmit={handleOrderSubmit}
            />
          </div>
        ) : gmbSelected ? (
          // When GMB is selected, show the component full width
          <div className="max-w-7xl mx-auto">
            <GoogleProfileSearch
              onSelectionChange={handleGmbSelectionChange}
              onProceedToOrder={handleProceedToOrder}
              resetTrigger={resetTrigger}
            />
          </div>
        ) : (
          // Single column layout when no GMB is selected
          <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
            {/* Search Component */}
            <div className="w-full">
              <GoogleProfileSearch
                onSelectionChange={handleGmbSelectionChange}
                onProceedToOrder={handleProceedToOrder}
                resetTrigger={resetTrigger}
              />
            </div>
          </div>
        )}
      </div>

      {!gmbSelected && !showOrderForm && (
        <main id="how-it-works" className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Section divider */}
          <div className="w-20 h-1 bg-[#F17313] mx-auto mb-24"></div>

          {/* Process steps section with better styling */}
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">
            How We Work
          </h2>

          <div className="max-w-6xl mx-auto mb-24">
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">
                    1
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  Search
                </h3>
                <p className="text-[#0D2959]/70">
                  Find your business in our search engine
                </p>
              </div>

              {/* First Arrow */}
              <div className="hidden md:flex absolute top-20 left-1/3 transform translate-x-4 z-10">
                <svg width="60" height="40" viewBox="0 0 60 40" className="text-[#F17313]/60">
                  <path
                    d="M5 20 Q30 5 55 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4,4"
                  />
                  <path
                    d="M50 15 L55 20 L50 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">
                    2
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  Choose
                </h3>
                <p className="text-[#0D2959]/70">
                  Select the service you need
                </p>
              </div>

              {/* Second Arrow */}
              <div className="hidden md:flex absolute top-20 right-1/3 transform -translate-x-4 z-10">
                <svg width="60" height="40" viewBox="0 0 60 40" className="text-[#F17313]/60">
                  <path
                    d="M5 20 Q30 5 55 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4,4"
                  />
                  <path
                    d="M50 15 L55 20 L50 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">
                    3
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  Results
                </h3>
                <p className="text-[#0D2959]/70">
                  Get guaranteed removal within 7-14 days with full updates
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section - Separate from How We Work */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">
              Why Choose Us
            </h2>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Secured Payments */}
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-[#F17313]/5 shadow-sm border border-[#F17313]/20 transition-transform hover:translate-y-[-5px]">
                  <div className="w-12 h-12 bg-[#F17313]/10 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#F17313]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] text-sm mb-2">
                    Secured Stripe Payments
                  </h4>
                  <p className="text-xs text-[#0D2959]/70">
                    Bank-level security with encrypted transactions and fraud protection
                  </p>
                </div>

                {/* Money Back Guarantee */}
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-[#0D2959]/5 shadow-sm border border-[#0D2959]/20 transition-transform hover:translate-y-[-5px]">
                  <div className="w-12 h-12 bg-[#0D2959]/10 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#0D2959]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] text-sm mb-2">
                    100% Money Back Guarantee
                  </h4>
                  <p className="text-xs text-[#0D2959]/70">
                    Full refund if we don't deliver results within the promised timeframe
                  </p>
                </div>

                {/* Professional Team */}
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-[#F17313]/5 shadow-sm border border-[#F17313]/20 transition-transform hover:translate-y-[-5px]">
                  <div className="w-12 h-12 bg-[#F17313]/10 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#F17313]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] text-sm mb-2">
                    Expert Team
                  </h4>
                  <p className="text-xs text-[#0D2959]/70">
                    5+ years experience with Google Maps and business profile management
                  </p>
                </div>

                {/* 24/7 Support */}
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-[#0D2959]/5 shadow-sm border border-[#0D2959]/20 transition-transform hover:translate-y-[-5px]">
                  <div className="w-12 h-12 bg-[#0D2959]/10 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#0D2959]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 002.25 12c0 5.384 4.365 9.75 9.75 9.75s9.75-4.366 9.75-9.75S17.634 2.25 12 2.25z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] text-sm mb-2">
                    24/7 Customer Support
                  </h4>
                  <p className="text-xs text-[#0D2959]/70">
                    Always available to answer questions and provide updates on your case
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">
              What Our Clients Say
            </h2>

            {/* Customer Reviews */}
            <div className="grid md:grid-cols-2 gap-8 mb-24">
              {/* Review 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Someone created a fake GMB profile for our restaurant with completely wrong information and damaging reviews. MapWipers successfully removed the entire fake profile within 12 days, saving our reputation and preventing customer confusion."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F17313]/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#F17313] font-semibold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D2959]">Sarah Martinez</p>
                    <p className="text-sm text-gray-600">
                      Owner, Bella Vista Restaurant
                    </p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "A competitor created multiple fake Google Business profiles for our law firm with incorrect contact details and malicious content. MapWipers removed all unauthorized profiles completely within 8 days. Professional and reliable service!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#0D2959]/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#0D2959] font-semibold">DT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D2959]">David Thompson</p>
                    <p className="text-sm text-gray-600">
                      CEO, Thompson Legal Services
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-gradient-to-br from-[#0D2959]/5 to-[#F17313]/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-[#0D2959]">
                Common Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Use Case 1 */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                  <div className="w-14 h-14 bg-[#F17313]/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#F17313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-lg mb-3 text-[#0D2959]">
                    Fake Competitor GMB Profiles
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Problem:</strong> A dental clinic discovered that a competing practice had created a fake Google My Business profile using their business name with false negative information and wrong contact details.
                    <br /><br />
                    <strong>Solution:</strong> We documented the fraudulent profile, gathered evidence of impersonation, and worked with Google to have the entire fake GMB listing removed within 14 days, protecting their brand identity.
                  </p>
                </div>

                {/* Use Case 2 */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                  <div className="w-14 h-14 bg-[#0D2959]/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0D2959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-lg mb-3 text-[#0D2959]">
                    Unauthorized Duplicate GMB Listings
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Problem:</strong> An accounting firm discovered 4 unauthorized Google My Business profiles created with their company name, each showing different addresses and phone numbers, causing massive customer confusion.
                    <br /><br />
                    <strong>Solution:</strong> We systematically removed all unauthorized duplicate GMB listings, leaving only their verified official profile. This eliminated customer confusion and consolidated their online presence, improving local search visibility by 65%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Statistics Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#0D2959]">
                The Hidden Cost of Low Ratings
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Research shows that low ratings on Google Business profiles directly impact customer acquisition and revenue. See how ratings affect business performance.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Chart */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <h3 className="text-xl font-bold mb-6 text-[#0D2959] text-center">
                  Customer Loss by Average Rating
                </h3>

                {/* Chart visualization */}
                <div className="space-y-4">
                  {/* 4.5+ stars */}
                  <div className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">4.5+ ⭐</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '10%' }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          10% loss
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">
                      Excellent
                    </div>
                  </div>

                  {/* 4.1-4.4 stars */}
                  <div className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">4.1-4.4 ⭐</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: '25%' }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          25% loss
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">
                      Good
                    </div>
                  </div>

                  {/* 3.5-4.0 stars - Critical threshold */}
                  <div className="flex items-center border-2 border-red-300 rounded-lg p-2 bg-red-50">
                    <div className="w-20 text-sm font-bold text-red-700">3.5-4.0 ⭐</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: '50%' }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          50% loss
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-red-600 font-bold">
                      Danger Zone
                    </div>
                  </div>

                  {/* 3.0-3.4 stars */}
                  <div className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">3.0-3.4 ⭐</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '70%' }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          70% loss
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">
                      Poor
                    </div>
                  </div>

                  {/* Below 3.0 stars */}
                  <div className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">&lt;3.0 ⭐</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-red-700 h-full rounded-full" style={{ width: '85%' }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          85% loss
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">
                      Critical
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/70 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-700 text-center">
                    <strong className="text-red-600">
                      Critical Insight:
                    </strong>
                    Businesses with ratings below 4.1 stars lose 50%+ of potential customers before they even contact you.
                  </p>
                </div>
              </div>

              {/* Right side - Key Statistics */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-[#0D2959]">
                  The Impact of Low Ratings
                </h3>

                <div className="space-y-6">
                  {/* Stat 1 */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl font-bold text-red-600">87%</div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      of consumers check online reviews before visiting a business
                    </p>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl font-bold text-orange-600">68%</div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      revenue decrease when rating drops from 4+ to 3+ stars
                    </p>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl font-bold text-[#0D2959]">€2,400</div>
                      <div className="w-12 h-12 bg-[#0D2959]/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0D2959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      average monthly revenue loss with ratings below 4.0 stars
                    </p>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl font-bold text-green-600">12x</div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      more likely to be chosen with 4.5+ star rating vs 3.5 stars
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#F17313] to-[#0D2959] rounded-xl text-white">
                  <h4 className="font-bold text-lg mb-2">
                    Don't Let Low Ratings Hurt Your Business
                  </h4>
                  <p className="text-gray-100 text-sm mb-6">
                    Every day with poor ratings means losing potential customers to competitors with better scores.
                  </p>
                  <button
                    onClick={handleStartClick}
                    className="bg-white text-[#0D2959] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Improve My Rating Now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom insight */}
            <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Research Source
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Data compiled from Harvard Business Review, BrightLocal Consumer Review Survey 2024, and Google Business Performance Studies. The 4.1-star threshold is identified as the critical point where customer trust significantly decreases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology & Expertise Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#0D2959]">
                Advanced Technology Meets Proven Expertise
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our sophisticated AI-powered software and years of hands-on experience ensure the highest success rate in GMB profile removal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Technology */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-[#0D2959]">
                  Cutting-Edge Technology
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#F17313]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F17313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-[#0D2959]">
                        AI-Powered Analysis
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Our machine learning algorithms analyze thousands of data points to identify fraudulent profiles with 99.2% accuracy, detecting patterns invisible to manual review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0D2959]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0D2959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-[#0D2959]">
                        Automated Documentation
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Advanced software automatically generates comprehensive evidence packages, including metadata analysis and pattern recognition reports required by Google.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#F17313]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F17313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-[#0D2959]">
                        Real-Time Monitoring
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Our proprietary monitoring system tracks removal progress in real-time and automatically adjusts strategies based on Google's response patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Experience */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-[#0D2959]">
                  Battle-Tested Experience
                </h3>
                <div className="bg-gradient-to-br from-[#0D2959]/5 to-[#F17313]/5 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#F17313] mb-2">7+</div>
                      <p className="text-sm text-[#0D2959] font-medium">
                        Years in Business
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0D2959] mb-2">500+</div>
                      <p className="text-sm text-[#0D2959] font-medium">
                        Profiles Removed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#F17313] rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        Deep understanding of Google's internal review processes
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#0D2959] rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        Established relationships with Google Business support teams
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#F17313] rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        Constantly updated knowledge of Google Maps policies
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#0D2959] rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        Proven strategies refined through thousands of successful cases
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success Rate Highlight */}
                <div className="mt-6 bg-white rounded-xl border-2 border-green-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        98% Success Rate
                      </p>
                      <p className="text-sm text-gray-600">
                        Achieved through technology + expertise
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-[#0D2959] to-[#F17313] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Experience the Difference?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Let our advanced technology and proven expertise solve your GMB profile problems quickly and permanently.
                </p>
                <button
                  onClick={handleStartClick}
                  className="bg-white text-[#0D2959] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Your Case Today
                </button>
              </div>
            </div>
          </div>

          {/* Secure Payments Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-[#0D2959]">
                  Bank-Level Security for Your Peace of Mind
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Your payment information is protected by the same security standards used by major banks and financial institutions worldwide.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Stripe Security */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#0D2959]">
                    SSL Encryption
                  </h3>
                  <p className="text-sm text-gray-600">
                    All data transmitted is encrypted with 256-bit SSL technology
                  </p>
                </div>

                {/* PCI Compliance */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#0D2959]">
                    PCI Compliant
                  </h3>
                  <p className="text-sm text-gray-600">
                    Meets the highest standards for payment card industry security
                  </p>
                </div>

                {/* Fraud Protection */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#0D2959]">
                    Fraud Protection
                  </h3>
                  <p className="text-sm text-gray-600">
                    Advanced machine learning detects and prevents fraudulent transactions
                  </p>
                </div>
              </div>

              {/* Stripe Logo and Trust Indicators */}
              <div className="border-t border-blue-200 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center space-x-6 mb-4 md:mb-0">
                    <div className="text-center">
                      <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-2xl font-bold text-blue-600">stripe</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Powered by Stripe
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#0D2959]">
                        Trusted by millions
                      </p>
                      <p className="text-xs text-gray-600">
                        Used by companies like Lyft, Shopify, and Zoom
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">VISA</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">MC</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">AMEX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Promise */}
              <div className="bg-white/50 rounded-lg p-6 mt-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#0D2959] mb-1">
                      Your Security is Our Priority
                    </p>
                    <p className="text-sm text-gray-600">
                      We never store your payment information on our servers. All transactions are processed directly through Stripe's secure infrastructure, ensuring your financial data remains completely safe and private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics Section */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">
              Our Track Record
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-[#F17313]/10 to-[#F17313]/5 rounded-xl border border-[#F17313]/20">
                <div className="text-4xl font-bold text-[#F17313] mb-2">500+</div>
                <p className="text-[#0D2959] font-medium">
                  Profiles Removed
                </p>
                <p className="text-sm text-[#0D2959]/70 mt-1">
                  Successfully deleted from Google Maps
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#0D2959]/10 to-[#0D2959]/5 rounded-xl border border-[#0D2959]/20">
                <div className="text-4xl font-bold text-[#0D2959] mb-2">98%</div>
                <p className="text-[#0D2959] font-medium">
                  Success Rate
                </p>
                <p className="text-sm text-[#0D2959]/70 mt-1">
                  Cases resolved successfully
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#F17313]/10 to-[#F17313]/5 rounded-xl border border-[#F17313]/20">
                <div className="text-4xl font-bold text-[#F17313] mb-2">7-14</div>
                <p className="text-[#0D2959] font-medium">
                  Days Average
                </p>
                <p className="text-sm text-[#0D2959]/70 mt-1">
                  Time to complete removal
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#0D2959]/10 to-[#0D2959]/5 rounded-xl border border-[#0D2959]/20">
                <div className="text-4xl font-bold text-[#0D2959] mb-2">24/7</div>
                <p className="text-[#0D2959] font-medium">
                  Support Available
                </p>
                <p className="text-sm text-[#0D2959]/70 mt-1">
                  Always here to help you
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#0D2959]">
                Choose Your Service
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Select the service that best fits your needs. All prices are one-time payments with no hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Remove Profile */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#0D2959] mb-2">
                    Remove Profile
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Complete removal of Google Business Profile
                  </p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#0D2959] mb-2">
                    {formatPrice(getServicePrice('remove') || 499)}
                  </div>
                  <p className="text-sm text-gray-600">
                    One-time payment
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete profile removal
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All associated reviews deleted
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    7-14 days completion
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Money-back guarantee
                  </li>
                </ul>
                <button
                  onClick={() => handleServiceSelect('remove')}
                  className="w-full py-3 bg-[#F17313] text-white rounded-full font-semibold hover:bg-[#F17313]/90 transition-colors mb-3"
                >
                  Choose
                </button>
              </div>

              {/* Reset Profile */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#0D2959] mb-2">
                    Reset Profile
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Reset Google Business Profile to clean state
                  </p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#0D2959] mb-2">
                    {formatPrice(getServicePrice('reset') || 599)}
                  </div>
                  <p className="text-sm text-gray-600">
                    One-time payment
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Profile reset to clean state
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Remove negative content
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    7-14 days completion
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Money-back guarantee
                  </li>
                </ul>
                <button
                  onClick={() => handleServiceSelect('reset')}
                  className="w-full py-3 bg-[#F17313] text-white rounded-full font-semibold hover:bg-[#F17313]/90 transition-colors mb-3"
                >
                  Choose
                </button>
              </div>
            </div>

            {/* Enhance Your Service */}
            <div className="bg-gradient-to-br from-[#0D2959]/5 to-[#F17313]/5 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-center mb-8 text-[#0D2959]">
                Enhance Your Service
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* 1-Year Protection */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-[#0D2959]">
                      1-Year Protection
                    </h4>
                    <span className="text-2xl font-bold text-[#F17313]">
                      {formatPrice(getAddonPrice('yearProtection') || 199)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Prevents reappearance for 12 months
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Continuous monitoring
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Automatic re-removal
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Monthly reports
                    </li>
                  </ul>
                </div>

                {/* Express Service */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-[#0D2959]">
                      Express Service
                    </h4>
                    <span className="text-2xl font-bold text-[#F17313]">
                      {formatPrice(getAddonPrice('expressService') || 99)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Priority processing within 24-48 hours
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      24-48 hour processing
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority queue
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dedicated support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] mb-2">
                    Pay Only on Success
                  </h4>
                  <p className="text-sm text-gray-600">
                    No upfront payment. You only pay when we successfully complete your service.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] mb-2">
                    100% Guarantee
                  </h4>
                  <p className="text-sm text-gray-600">
                    If we can't complete your service within 30 days, you get a full refund.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#0D2959] mb-2">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-gray-600">
                    All payments are processed securely through Stripe with bank-level encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  How long does it take to remove a fake GMB profile?
                </h3>
                <p className="text-gray-700">
                  Most fake or unauthorized Google My Business profiles are removed within 7-14 business days. Complex cases involving multiple profiles or extensive documentation may take up to 21 days. We keep you updated throughout the entire process.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  What if the profile doesn't get removed?
                </h3>
                <p className="text-gray-700">
                  We offer a 100% money-back guarantee. If we cannot successfully remove the unauthorized profile within 30 days, you receive a full refund. Our 98% success rate means this rarely happens, but your satisfaction is guaranteed.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  Can you remove profiles that competitors created?
                </h3>
                <p className="text-gray-700">
                  Yes, we specialize in removing fake profiles created by competitors using your business name, address, or other identifying information. We document the impersonation and work directly with Google to have these fraudulent listings removed.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  Do you need access to my Google account?
                </h3>
                <p className="text-gray-700">
                  No, we never need access to your personal Google accounts. We work through official Google support channels and reporting systems. You maintain complete control and security of your accounts throughout the process.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">
                  What information do you need to get started?
                </h3>
                <p className="text-gray-700">
                  We need the URL or details of the fake profile, your legitimate business information, and any evidence showing the profile is unauthorized (screenshots, documentation, etc.). Our team will guide you through gathering the necessary information.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Service Selection Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-gray-100 transform transition-all animate-in slide-in-from-bottom-4 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0D2959] flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#F17313]/10 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#F17313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    Find Your Business
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedService === 'remove'
                      ? 'Complete profile removal'
                      : selectedService === 'reset'
                        ? 'Reset to clean state'
                        : 'First, search for your business profile'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="w-full">
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                  <GoogleProfileSearch
                    onSelectionChange={handleModalGmbSelection}
                    isModal={true}
                    resetTrigger={resetTrigger}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
