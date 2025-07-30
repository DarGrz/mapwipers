import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract client info for analytics
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validate required fields
    if (!data.details || !data.details.name || !data.details.placeId) {
      return NextResponse.json(
        { error: 'Missing required place details' },
        { status: 400 }
      );
    }
    
    // Insert into Supabase
    const { data: insertedData, error } = await supabase
      .from('searched_gmb')
      .insert({
        name: data.details.name,
        address: data.details.address,
        place_id: data.details.placeId,
        phone_number: data.details.phoneNumber,
        website: data.details.website,
        google_maps_url: data.details.googleMapsUrl,
        business_status: data.details.businessStatus,
        rating: data.details.rating,
        types: data.details.types,
        ip_address: ip,
        user_agent: userAgent
      })
      .select();
    
    if (error) {
      console.error('Error saving to database:', error);
      return NextResponse.json(
        { error: 'Failed to save data to database' },
        { status: 500 }
      );
    }
      return NextResponse.json({ success: true, data: insertedData });
  } catch (error: unknown) {
    console.error('Error in searched-gmb API:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
