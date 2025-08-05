'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  visitors?: Record<string, unknown>[];
  orders?: Record<string, unknown>[];
  searches?: Record<string, unknown>[];
  recentOrders?: {
    customer_email?: string;
    customer_name?: string;
    service_type?: string;
    total_amount?: number;
    payment_status?: string;
    created_at?: string;
    business_name?: string;
    business_rating?: number;
    [key: string]: unknown;
  }[];
  recentSearches?: Record<string, unknown>[];
  recentVisitors?: Record<string, unknown>[]; // Recent visitors (last 10) regardless of date filter
  allVisitors?: Record<string, unknown>[]; // All visitor records with detailed data
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

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        type: 'all'
      });
      
      const response = await fetch(`/api/analytics?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          startDate: dateRange.start,
          endDate: dateRange.end,
          type: 'all'
        });
        
        const response = await fetch(`/api/analytics?${params}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const analyticsData = await response.json();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.analytics?.totalVisitors || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unique IPs</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.analytics?.uniqueIps || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">GMB Searches</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.searchAnalytics?.totalSearches || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.orderAnalytics?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">${data?.orderAnalytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Search Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
            <div className="space-y-2">
              {data?.searchAnalytics?.topSearchQueries?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600 truncate">{item.query}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-2">
              {data?.analytics?.topPages?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600 truncate">{item.page}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-2">
              {data?.orderAnalytics?.ordersByStatus?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.status}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Ordered</h3>
            <div className="space-y-2">
              {data?.orderAnalytics?.ordersByService?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.service}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Searches</span>
                <span className="text-sm font-medium">{data?.searchAnalytics?.totalSearches || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Unique Places</span>
                <span className="text-sm font-medium">{data?.searchAnalytics?.uniquePlaces || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Order Value</span>
                <span className="text-sm font-medium">${data?.orderAnalytics?.avgOrderValue?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Searched GMB Businesses */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Searched GMB Businesses</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {data?.recentSearches?.length || 0} recent searches
                </span>
                <a
                  href="/admin/searched-gmbs"
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All GMBs
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Query</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.recentSearches?.slice(0, 10).map((search, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {String(search.place_name || 'N/A')}
                        </div>
                        {String(search.place_phone || '') && (
                          <div className="text-xs text-gray-500">
                            {String(search.place_phone)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {String(search.place_address || 'N/A')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {search.place_rating ? (
                            <>
                              <span className="text-sm font-medium text-gray-900">
                                {String(search.place_rating)}
                              </span>
                              <span className="text-yellow-400 ml-1">★</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {String(search.search_query || 'Direct search')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {String(search.ip_address || 'N/A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(String(search.created_at)).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {(data?.recentSearches?.length || 0) === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent GMB searches found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {data?.recentOrders?.length || 0} recent orders
                </span>
                <a
                  href="/admin/orders"
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All Orders
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.recentOrders?.slice(0, 10).map((order, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(order.customer_email)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium max-w-xs truncate">
                        {String(order.business_name || 'N/A')}
                      </div>
                      {order.business_rating && (
                        <div className="text-xs text-gray-500">
                          ⭐ {String(order.business_rating)}/5
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {String(order.service_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${String(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.payment_status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {String(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(String(order.created_at)).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Visitors</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {data?.allVisitors?.length || 0} total visitors
                </span>
                <a
                  href="/admin/visitors"
                  className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  View All Visitors
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.recentVisitors?.slice(0, 10).map((visitor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(visitor.ip_address || 'N/A')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(visitor.page_path)}>
                        {String(visitor.page_path || '/')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(visitor.user_agent)}>
                        {String(visitor.user_agent || 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(visitor.referer)}>
                        {String(visitor.referer || 'Direct')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(visitor.country || 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(String(visitor.created_at)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(data?.recentVisitors?.length || 0) === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent visitors found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
