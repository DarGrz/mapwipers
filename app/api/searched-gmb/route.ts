import { NextRequest, NextResponse } from 'next/server';
import { logGmbFromPlaceDetails, getRequestInfo, generateSessionId } from '@/lib/logging';
import { supabaseServiceRole } from '@/lib/supabase';
import { PlaceDetails } from '@/app/types';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const exportFormat = searchParams.get('export');
    
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabaseServiceRole
      .from('searched_gmbs')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`place_name.ilike.%${search}%,search_query.ilike.%${search}%,place_address.ilike.%${search}%`);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination and ordering (skip pagination for export)
    query = query.order('created_at', { ascending: false });
    
    if (exportFormat !== 'csv') {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching searched GMBs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch searched GMBs' },
        { status: 500 }
      );
    }

    // Handle CSV export
    if (exportFormat === 'csv') {
      const csvHeaders = [
        'Business Name',
        'Address', 
        'Phone',
        'Website',
        'Rating',
        'Review Count',
        'Business Status',
        'Search Query',
        'Location',
        'IP Address',
        'User Agent',
        'Session ID',
        'Created Date'
      ];

      const csvRows = (data || []).map(item => [
        item.place_name || '',
        item.place_address || '',
        item.place_phone || '',
        item.place_website || '',
        item.place_rating || '',
        item.place_rating_count || '',
        item.place_business_status || '',
        item.search_query || '',
        item.location || '',
        item.ip_address || '',
        item.user_agent || '',
        item.session_id || '',
        new Date(item.created_at).toLocaleString()
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="searched-gmbs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in searched-gmb GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
