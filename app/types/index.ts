// Google My Business location types
export interface GmbLocation {
  id: string;
  name: string;
  address: string;
  placeId: string;
}

// Detailed place information
export interface PlaceDetails {
  id: string;
  name: string;
  address: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  phoneNumber?: string;
  website?: string;
  googleMapsUrl: string;
  photos: string[];
  businessStatus?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

// Removal type for form state
export interface Removal {
  companyName: string;
  nip: string;
}

// Pricing types
export interface PricingItem {
  id: string;
  name: string;
  code: string;
  price: number;
  type: 'service' | 'addon';
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ServicePricing {
  name: string;
  price: number;
  description: string;
}

export interface PricingData {
  services: {
    [key: string]: ServicePricing;
  };
  addons: {
    [key: string]: ServicePricing;
  };
}
