import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats } from '@/lib/logging';

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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Convert endDate to include the full day (add 23:59:59)
    const adjustedEndDate = endDate ? `${endDate}T23:59:59.999Z` : undefined;
    const adjustedStartDate = startDate ? `${startDate}T00:00:00.000Z` : undefined;

    console.log('Visitors API - Date range:', { 
      startDate, 
      endDate, 
      adjustedStartDate, 
      adjustedEndDate,
      page,
      limit
    });

    const visitorResult = await getVisitorStats(adjustedStartDate, adjustedEndDate);
    
    if (!visitorResult.success) {
      return NextResponse.json(
        { error: 'Failed to fetch visitors data' },
        { status: 500 }
      );
    }

    const allVisitors = visitorResult.data || [];
    
    // Calculate pagination
    const totalCount = allVisitors.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVisitors = allVisitors.slice(startIndex, endIndex);

    const response = {
      visitors: paginatedVisitors,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalVisitors: totalCount,
        uniqueIps: [...new Set(allVisitors.map(v => v.ip_address))].length,
        uniqueCountries: [...new Set(allVisitors.map(v => v.country).filter(Boolean))].length,
        topPages: getTopPages(allVisitors),
        topCountries: getTopCountries(allVisitors),
        topReferers: getTopReferers(allVisitors)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in visitors API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitors data' },
      { status: 500 }
    );
  }
}

function getTopPages(visitors: Record<string, unknown>[]) {
  const pageCounts: { [key: string]: number } = {};
  visitors.forEach(visitor => {
    const pagePath = String(visitor.page_path || '');
    pageCounts[pagePath] = (pageCounts[pagePath] || 0) + 1;
  });
  
  return Object.entries(pageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));
}

function getTopCountries(visitors: Record<string, unknown>[]) {
  const countryCounts: { [key: string]: number } = {};
  visitors.forEach(visitor => {
    const country = String(visitor.country || 'Unknown');
    if (country !== 'Unknown') {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }
  });
  
  return Object.entries(countryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));
}

function getTopReferers(visitors: Record<string, unknown>[]) {
  const refererCounts: { [key: string]: number } = {};
  visitors.forEach(visitor => {
    const referer = String(visitor.referer || 'Direct');
    try {
      const hostname = referer === 'Direct' ? 'Direct' : new URL(referer).hostname;
      refererCounts[hostname] = (refererCounts[hostname] || 0) + 1;
    } catch {
      refererCounts['Direct'] = (refererCounts['Direct'] || 0) + 1;
    }
  });
  
  return Object.entries(refererCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([referer, count]) => ({ referer, count }));
}
