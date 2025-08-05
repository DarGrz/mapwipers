# MapWipers Logging System

This document describes the comprehensive logging system implemented for MapWipers to track visitors, orders, and searched Google My Business (GMB) profiles.

## 📊 Overview

The logging system captures three main types of data:

1. **Visitors** - Page visits, user sessions, and navigation patterns
2. **Orders** - Order creation, payment status, and customer information  
3. **Searched GMBs** - GMB search queries and place details lookups

All data is stored in Supabase PostgreSQL database with proper indexing and Row Level Security (RLS).

## 🗄️ Database Schema

### Tables Created

#### `visitors`
- Tracks page visits and user behavior
- Fields: IP address, user agent, page path, session ID, timestamps
- Automatically populated via middleware

#### `orders` 
- Tracks order lifecycle from creation to completion
- Fields: Customer info, service type, pricing, payment status, Stripe IDs
- Updated via API endpoints and webhooks

#### `searched_gmbs`
- Tracks GMB searches and place detail lookups
- Fields: Search queries, place details, ratings, geometry data
- Populated via GMB search APIs

### Key Features
- UUID primary keys for all tables
- Proper indexing for performance
- Row Level Security (RLS) enabled
- Automatic timestamp management
- JSONB fields for flexible data storage

## 🔧 Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Copy the schema to Supabase SQL Editor
cat database/logging-schema.sql
```

Or use the setup script:
```bash
node scripts/setup-logging.js
```

### 2. Environment Variables

Ensure your `.env.local` has the required Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Automatic Logging

The system automatically logs:

- **Visitors**: Via middleware on all page requests
- **Orders**: When payment sessions are created and completed
- **GMB Searches**: When users search for or view place details

## 📈 Analytics Dashboard

Access the password-protected analytics dashboard at `/admin/analytics` to view:

- Total visitors and unique IPs
- Order statistics and revenue
- Search patterns and popular queries
- Real-time data with date filtering

### Admin Authentication

All admin pages are secured with password authentication:
- Password is set via `ADMIN_PASSWORD` environment variable
- Session-based authentication with secure HTTP-only cookies
- 1-hour session timeout for security
- Logout functionality included

### Admin Pages
- `/admin/analytics` - Analytics dashboard with comprehensive metrics
- `/admin/pricing` - Pricing management interface

Both pages require admin password authentication.

### API Endpoint

Analytics data is available via authenticated API:
```
GET /api/analytics?startDate=2024-01-01&endDate=2024-01-31&type=all
```

**Authentication Required**: This endpoint requires admin session cookie.

Parameters:
- `startDate` (optional): Start date for data range
- `endDate` (optional): End date for data range  
- `type` (optional): `visitors`, `orders`, `searches`, or `all`

## 🔍 Implementation Details

### Visitor Logging
- Triggered by Next.js middleware
- Captures IP, user agent, referrer, page path
- Creates session IDs for user tracking
- Skips API routes and static assets

### Order Logging
- Creates order record when Stripe session is created
- Updates payment status via Stripe webhooks
- Includes customer details and service information
- Tracks addon selections and pricing

### GMB Search Logging
- Logs each search query and results
- Captures place details when users view businesses
- Includes ratings, contact info, and geometry data
- Tracks search result counts

### Session Management
- Generates unique session IDs for visitor tracking
- Stores session ID in HTTP-only cookies
- 30-day cookie expiration
- Links visitor actions across pages

## 🔒 Security & Privacy

### Data Protection
- All tables use Row Level Security (RLS)
- Service role access for server operations
- Anonymous access limited to inserts only
- No sensitive data stored in logs

### IP Address Handling
- IP addresses are hashed for privacy
- Only first IP used from forwarded headers
- Compliant with privacy regulations

### Access Control
- Analytics dashboard requires admin password authentication
- API endpoints validate admin session cookies
- Pricing management requires authentication
- Audit trail for all data access
- Session timeout for security

## 📊 Key Metrics Tracked

### Visitor Metrics
- Total page views
- Unique visitors (by IP)
- Most popular pages
- Traffic patterns by day
- Session duration estimates

### Order Metrics  
- Total orders and revenue
- Conversion rates
- Average order value
- Order status distribution
- Service type preferences

### Search Metrics
- Total searches performed
- Popular search queries
- Unique places viewed
- Search to order conversion
- Geographic patterns

## 🚀 Usage Examples

### Custom Analytics Queries

```javascript
// Get visitor data for last 7 days
const visitors = await getVisitorStats(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  new Date().toISOString()
);

// Track specific order
await logOrder({
  customer_email: 'user@example.com',
  service_type: 'remove',
  total_amount: 499.00,
  payment_status: 'pending'
});

// Log GMB search
await logSearchedGmb({
  search_query: 'restaurants near me',
  place_name: 'Example Restaurant',
  place_rating: 4.5
});
```

### Real-time Monitoring

The system enables real-time monitoring of:
- Live visitor activity
- Order completion rates
- Search trends and patterns
- Revenue tracking

## 🛠️ Maintenance

### Regular Tasks
- Monitor database growth and performance
- Archive old data as needed
- Review analytics for insights
- Update RLS policies if required

### Troubleshooting
- Check Supabase connection status
- Verify environment variables
- Review server logs for errors
- Test API endpoints individually

## 📝 Future Enhancements

Potential improvements:
- Geographic visitor mapping
- Advanced funnel analysis  
- A/B testing capabilities
- Custom event tracking
- Data export functionality
- Real-time notifications

---

For technical support or questions about the logging system, refer to the implementation files in `/lib/logging.ts` and `/lib/supabase.ts`.
