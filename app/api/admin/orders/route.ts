import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase';

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
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const service = searchParams.get('service');
    const exportFormat = searchParams.get('export');
    
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabaseServiceRole
      .from('orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`customer_email.ilike.%${search}%,customer_name.ilike.%${search}%,company_name.ilike.%${search}%,id.eq.${isNaN(parseInt(search)) ? 0 : parseInt(search)}`);
    }

    if (status) {
      query = query.eq('payment_status', status);
    }

    if (service) {
      query = query.eq('service_type', service);
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
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Handle CSV export
    if (exportFormat === 'csv') {
      const csvHeaders = [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Company Name',
        'NIP',
        'Phone',
        'Service Type',
        'Addons',
        'Total Amount',
        'Currency',
        'Payment Status',
        'Payment Intent ID',
        'Stripe Session ID',
        'Business Place ID',
        'Business Name',
        'Business Address',
        'Business Phone',
        'Business Website',
        'Business Rating',
        'Business Google URL',
        'IP Address',
        'User Agent',
        'Referer',
        'Session ID',
        'Created Date',
        'Updated Date'
      ];

      const csvRows = (data || []).map(item => [
        item.id || '',
        item.customer_name || '',
        item.customer_email || '',
        item.company_name || '',
        item.nip || '',
        item.phone || '',
        item.service_type || '',
        Array.isArray(item.addons) ? item.addons.join('; ') : '',
        item.total_amount || '',
        item.currency || '',
        item.payment_status || '',
        item.payment_intent_id || '',
        item.stripe_session_id || '',
        item.business_place_id || '',
        item.business_name || '',
        item.business_address || '',
        item.business_phone || '',
        item.business_website || '',
        item.business_rating || '',
        item.business_google_url || '',
        item.ip_address || '',
        item.user_agent || '',
        item.referer || '',
        item.session_id || '',
        new Date(item.created_at).toLocaleString(),
        item.updated_at ? new Date(item.updated_at).toLocaleString() : ''
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        totalPages,
        totalItems: count || 0,
        limit
      }
    });

  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServiceRole
      .from('orders')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in orders PATCH API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
