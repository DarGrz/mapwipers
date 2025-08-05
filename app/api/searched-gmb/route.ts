import { NextRequest, NextResponse } from 'next/server';
import { logGmbFromPlaceDetails, getRequestInfo, generateSessionId } from '@/lib/logging';
import { PlaceDetails } from '@/app/types';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('DEBUG: Received data in searched-gmb API:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.details || !data.details.name || (!data.details.placeId && !data.details.id)) {
      console.log('DEBUG: Validation failed:', {
        hasDetails: !!data.details,
        hasName: !!(data.details && data.details.name),
        hasPlaceId: !!(data.details && data.details.placeId),
        hasId: !!(data.details && data.details.id),
        detailsKeys: data.details ? Object.keys(data.details) : 'no details'
      });
      return NextResponse.json(
        { error: 'Missing required place details' },
        { status: 400 }
      );
    }
    
    // Check if this is actually a selected business for order (not just viewing details)
    if (!data.isSelected && !data.proceedingToOrder) {
      console.log('DEBUG: Business viewed but not selected for order, skipping database save');
      return NextResponse.json({ success: true, message: 'Business viewed but not saved' });
    }
    
    console.log('DEBUG: Business selected from list, saving to database:', data.details.name);
    
    // Get request info and session ID from cookies or generate new one
    const requestInfo = getRequestInfo(request);
    const sessionId = request.cookies.get('session_id')?.value || generateSessionId();
    
    // Convert the received data to PlaceDetails format
    const placeDetails: PlaceDetails = {
      id: data.details.placeId || data.details.id,
      name: data.details.name,
      address: data.details.address,
      formatted_address: data.details.address,
      phoneNumber: data.details.phoneNumber,
      formatted_phone_number: data.details.phoneNumber,
      website: data.details.website,
      googleMapsUrl: data.details.googleMapsUrl,
      photos: data.details.photos || [],
      businessStatus: data.details.businessStatus,
      rating: data.details.rating,
      types: data.details.types || [],
      geometry: data.details.geometry,
      user_ratings_total: data.details.user_ratings_total
    };
    
    // Log the searched GMB using the logging system
    const result = await logGmbFromPlaceDetails(
      placeDetails,
      data.searchQuery,
      data.location,
      sessionId,
      data.searchResultsCount,
      requestInfo
    );
    
    if (!result.success) {
      console.error('Error saving GMB search to database:', result.error);
      return NextResponse.json(
        { error: 'Failed to save data to database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, sessionId });
  } catch (error: unknown) {
    console.error('Error in searched-gmb API:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
