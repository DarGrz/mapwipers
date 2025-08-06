import { NextRequest, NextResponse } from 'next/server';

// Define types based on the Google Places API
interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  business_status?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.error('Google Places API key is missing');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,url,business_status,types,rating,user_ratings_total,geometry,photos&key=${apiKey}`;

    const response = await fetch(url);
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter },
        { 
          status: 429,
          headers: { 'Retry-After': retryAfter }
        }
      );
    }

    if (!response.ok) {
      console.error('Google Places API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to fetch data from Google Places API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.result) {
      return NextResponse.json(
        { error: 'No details found for this place' },
        { status: 404 }
      );
    }

    const result = data.result as PlaceResult;
    
    console.log('Google API result:', {
      place_id: result.place_id,
      name: result.name,
      formatted_phone_number: result.formatted_phone_number,
      international_phone_number: result.international_phone_number,
      formatted_address: result.formatted_address
    }); // Debug log
    
    // Get photo URLs if available
    const photos = result.photos 
      ? result.photos.slice(0, 5).map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`;
        })
      : [];

    // Map the response to our desired format
    const placeDetails = {
      id: result.place_id,
      name: result.name,
      address: result.formatted_address,
      formatted_address: result.formatted_address,
      formatted_phone_number: result.formatted_phone_number,
      international_phone_number: result.international_phone_number,
      phoneNumber: result.formatted_phone_number || result.international_phone_number,
      website: result.website,
      googleMapsUrl: result.url || `https://maps.google.com/maps?place_id=${result.place_id}`,
      photos: photos,
      businessStatus: result.business_status,
      types: result.types,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      geometry: result.geometry
    };

    // Note: We don't log place details lookup here anymore
    // Logging only happens when user actually proceeds to order in searched-gmb API

    return NextResponse.json({ details: placeDetails });
  } catch (error: unknown) {
    console.error('Error in Places Details API:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
