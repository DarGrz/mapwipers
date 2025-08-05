import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats, getOrderStats, getSearchStats } from '@/lib/logging';

interface AnalyticsResponse {
  visitors?: Record<string, unknown>[];
  orders?: Record<string, unknown>[];
  searches?: Record<string, unknown>[];
  analytics?: {
    totalVisitors: number;
    uniqueIps: number;
    topPages: { page: string; count: number }[];
    visitorsByDay: { date: string; count: number }[];
  };
  orderAnalytics?: {
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: { status: string; count: number }[];
    ordersByService: { service: string; count: number }[];
    avgOrderValue: number;
  };
  searchAnalytics?: {
    totalSearches: number;
    uniquePlaces: number;
    topSearchQueries: { query: string; count: number }[];
    searchesByDay: { date: string; count: number }[];
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    
    console.log('Analytics API - Admin session cookie:', adminSession?.value);
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      console.log('Analytics API - Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    console.log('Analytics API - Authentication successful');

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // 'visitors', 'orders', 'searches', or 'all'

    const response: AnalyticsResponse = {};

    if (type === 'visitors' || type === 'all' || !type) {
      console.log('Analytics API - Fetching visitor stats...');
      const visitorResult = await getVisitorStats(startDate || undefined, endDate || undefined);
      console.log('Analytics API - Visitor result:', visitorResult);
      response.visitors = visitorResult.success ? visitorResult.data : [];
    }

    if (type === 'orders' || type === 'all' || !type) {
      console.log('Analytics API - Fetching order stats...');
      const orderResult = await getOrderStats(startDate || undefined, endDate || undefined);
      console.log('Analytics API - Order result:', orderResult);
      response.orders = orderResult.success ? orderResult.data : [];
    }

    if (type === 'searches' || type === 'all' || !type) {
      console.log('Analytics API - Fetching search stats...');
      const searchResult = await getSearchStats(startDate || undefined, endDate || undefined);
      console.log('Analytics API - Search result:', searchResult);
      response.searches = searchResult.success ? searchResult.data : [];
    }

    // Calculate some basic analytics
    console.log('Analytics API - Calculating analytics...');
    console.log('Analytics API - Response before calculations:', response);
    
    if (response.visitors) {
      console.log('Analytics API - Processing visitor analytics, visitor count:', response.visitors.length);
      response.analytics = {
        totalVisitors: response.visitors.length,
        uniqueIps: [...new Set(response.visitors.map((v: Record<string, unknown>) => v.ip_address))].length,
        topPages: getTopPages(response.visitors),
        visitorsByDay: getVisitorsByDay(response.visitors)
      };
      console.log('Analytics API - Visitor analytics calculated:', response.analytics);
    }

    if (response.orders) {
      console.log('Analytics API - Processing order analytics, order count:', response.orders.length);
      response.orderAnalytics = {
        totalOrders: response.orders.length,
        totalRevenue: response.orders.reduce((sum: number, order: Record<string, unknown>) => sum + parseFloat(String(order.total_amount) || '0'), 0),
        ordersByStatus: getOrdersByStatus(response.orders),
        ordersByService: getOrdersByService(response.orders),
        avgOrderValue: response.orders.length > 0 
          ? response.orders.reduce((sum: number, order: Record<string, unknown>) => sum + parseFloat(String(order.total_amount) || '0'), 0) / response.orders.length 
          : 0
      };
      console.log('Analytics API - Order analytics calculated:', response.orderAnalytics);
    }

    if (response.searches) {
      console.log('Analytics API - Processing search analytics, search count:', response.searches.length);
      response.searchAnalytics = {
        totalSearches: response.searches.length,
        uniquePlaces: [...new Set(response.searches.map((s: Record<string, unknown>) => s.place_id))].filter(Boolean).length,
        topSearchQueries: getTopSearchQueries(response.searches),
        searchesByDay: getSearchesByDay(response.searches)
      };
      console.log('Analytics API - Search analytics calculated:', response.searchAnalytics);
    }

    console.log('Analytics API - Final response:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
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

function getVisitorsByDay(visitors: Record<string, unknown>[]) {
  const dayCounts: { [key: string]: number } = {};
  visitors.forEach(visitor => {
    const day = new Date(String(visitor.created_at)).toISOString().split('T')[0];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  return Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function getOrdersByStatus(orders: Record<string, unknown>[]) {
  const statusCounts: { [key: string]: number } = {};
  orders.forEach(order => {
    const status = String(order.payment_status || 'unknown');
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
}

function getOrdersByService(orders: Record<string, unknown>[]) {
  const serviceCounts: { [key: string]: number } = {};
  orders.forEach(order => {
    const service = String(order.service_type || 'unknown');
    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
  });
  
  return Object.entries(serviceCounts).map(([service, count]) => ({ service, count }));
}

function getTopSearchQueries(searches: Record<string, unknown>[]) {
  const queryCounts: { [key: string]: number } = {};
  searches.forEach(search => {
    const query = String(search.search_query || '');
    if (query) {
      queryCounts[query] = (queryCounts[query] || 0) + 1;
    }
  });
  
  return Object.entries(queryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));
}

function getSearchesByDay(searches: Record<string, unknown>[]) {
  const dayCounts: { [key: string]: number } = {};
  searches.forEach(search => {
    const day = new Date(String(search.created_at)).toISOString().split('T')[0];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  return Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
