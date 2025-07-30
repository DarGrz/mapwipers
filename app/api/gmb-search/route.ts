import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for Google Places API responses
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  business_status?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon?: string;
  photos?: Array<{
    height: number;
    width: number;
    photo_reference: string;
    html_attributions: string[];
  }>;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
}

interface GooglePlacesApiResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  info_messages?: string[];
  next_page_token?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
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

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

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
    }    if (!response.ok) {
      console.error('Google Places API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to fetch data from Google Places API' },
        { status: response.status }
      );
    }

    const data = await response.json() as GooglePlacesApiResponse;
    
    if (!data.results || data.status !== 'OK') {
      return NextResponse.json(
        { error: data.error_message || 'No results found' },
        { status: 404 }
      );
    }
    
    // Map the response to our desired format
    const locations = data.results.map((result) => ({
      id: result.place_id,
      name: result.name,
      address: result.formatted_address,
      placeId: result.place_id,
    }));    return NextResponse.json({ locations });
  } catch (error: unknown) {
    console.error('Error in GMB search API:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
