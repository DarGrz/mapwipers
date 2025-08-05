import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Pobierz wszystkie aktywne ceny z bazy danych
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pricing:', error);
      return NextResponse.json(
        { error: 'Failed to fetch pricing data' },
        { status: 500 }
      );
    }

    // Konwertuj dane do formatu używanego przez komponent
    const pricing: {
      services: { [key: string]: { name: string; price: number; description: string } };
      addons: { [key: string]: { name: string; price: number; description: string } };
    } = {
      services: {},
      addons: {}
    };

    data?.forEach((item) => {
      if (item.type === 'service') {
        pricing.services[item.code] = {
          name: item.name,
          price: item.price,
          description: item.description || ''
        };
      } else if (item.type === 'addon') {
        pricing.addons[item.code] = {
          name: item.name,
          price: item.price,
          description: item.description || ''
        };
      }
    });

    return NextResponse.json({ pricing });
  } catch (error) {
    console.error('Error in pricing API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Walidacja danych
    if (!data.name || !data.code || !data.price || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code, price, type' },
        { status: 400 }
      );
    }

    // Wstaw nową cenę do bazy danych
    const { data: insertedData, error } = await supabase
      .from('pricing')
      .insert({
        name: data.name,
        code: data.code,
        price: data.price,
        type: data.type, // 'service' lub 'addon'
        description: data.description || null,
        is_active: true
      })
      .select();

    if (error) {
      console.error('Error inserting pricing:', error);
      return NextResponse.json(
        { error: 'Failed to insert pricing data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Pricing created successfully',
      data: insertedData[0]
    });
  } catch (error) {
    console.error('Error in pricing POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Missing pricing ID' },
        { status: 400 }
      );
    }

    // Aktualizuj cenę w bazie danych
    const { data: updatedData, error } = await supabase
      .from('pricing')
      .update({
        name: data.name,
        price: data.price,
        description: data.description,
        is_active: data.is_active
      })
      .eq('id', data.id)
      .select();

    if (error) {
      console.error('Error updating pricing:', error);
      return NextResponse.json(
        { error: 'Failed to update pricing data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Pricing updated successfully',
      data: updatedData[0]
    });
  } catch (error) {
    console.error('Error in pricing PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
