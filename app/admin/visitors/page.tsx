'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Visitor {
  id: number;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  page_path: string;
  country?: string;
  city?: string;
  session_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gtm_from?: string;
  created_at: string;
  [key: string]: unknown;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 50;

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      
      const response = await fetch(`/api/visitors?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch visitors data');
      }
      
      const data = await response.json();
      setVisitors(data.visitors || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end, currentPage]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const formatUserAgent = (userAgent: string) => {
    if (!userAgent) return 'N/A';
    
    // Extract browser info
    let browser = 'Unknown';
    let os = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    
    return `${browser} on ${os}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Visitors</h1>
            <Link
              href="/admin/analytics"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ← Back to Analytics
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading visitors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Visitors</h1>
            <Link
              href="/admin/analytics"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ← Back to Analytics
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
            <button 
              onClick={fetchVisitors}
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Visitors</h1>
          <Link
            href="/admin/analytics"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ← Back to Analytics
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search (coming soon)
              </label>
              <input
                type="text"
                placeholder="Search IP, page, country, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
            <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Filtered Results</h3>
            <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unique IPs</h3>
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(visitors.map((v: Visitor) => v.ip_address))].length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Countries</h3>
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(visitors.map((v: Visitor) => v.country).filter(Boolean))].length}
            </p>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Visitors ({visitors.length} on this page)
              </h3>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
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
                    Browser/OS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitors.map((visitor, index) => (
                  <tr key={`${visitor.id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {visitor.ip_address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={visitor.page_path}>
                        {visitor.page_path || '/'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={visitor.user_agent || 'N/A'}>
                        {formatUserAgent(visitor.user_agent || '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        {visitor.country || 'Unknown'}
                        {visitor.city && (
                          <div className="text-xs text-gray-500">{visitor.city}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={visitor.referer || 'Direct'}>
                        {visitor.referer ? (
                          <a 
                            href={visitor.referer} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {new URL(visitor.referer).hostname}
                          </a>
                        ) : (
                          'Direct'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {visitor.utm_source ? (
                        <div>
                          <div className="font-medium">{visitor.utm_source}</div>
                          {visitor.utm_medium && (
                            <div className="text-xs text-gray-500">{visitor.utm_medium}</div>
                          )}
                          {visitor.utm_campaign && (
                            <div className="text-xs text-gray-500">{visitor.utm_campaign}</div>
                          )}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(visitor.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {visitors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No visitors found matching your search.' : 'No visitors found for the selected date range.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
