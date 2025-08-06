# Google Maps URL Implementation

This update adds Google Maps URL support to the searched GMBs functionality.

## Database Migration Required

Before the changes take effect, you need to run the database migration:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `database/add-google-maps-url.sql`

```sql
-- Add Google Maps URL column to searched_gmbs table
-- Run this in your Supabase SQL Editor

ALTER TABLE searched_gmbs ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Add index for better performance when searching by URL
CREATE INDEX IF NOT EXISTS idx_searched_gmbs_google_maps_url ON searched_gmbs(google_maps_url);

-- Comment for documentation
COMMENT ON COLUMN searched_gmbs.google_maps_url IS 'Google Maps URL for the searched business location';
```

## Changes Made

### 1. Database Schema
- Added `google_maps_url` column to `searched_gmbs` table
- Added database index for performance

### 2. Backend Updates
- Updated `SearchedGmbLog` interface in `lib/logging.ts` to include `google_maps_url`
- Modified `logGmbFromPlaceDetails` function to save Google Maps URL
- Updated CSV export in `app/api/searched-gmb/route.ts` to include Google Maps URL
- Enhanced `app/api/places-details/route.ts` to generate Google Maps URL if not provided by Google API

### 3. Frontend Updates
- Updated `SearchedGMBsList` component to display Google Maps links
- Enhanced Analytics Dashboard to show Google Maps links in recent searches
- Added visual indicators (📍 emoji) for Google Maps links

## Features

### Searched GMBs Page
- Google Maps links appear in the "Contact" column
- Links are styled with green color and map emoji
- Links open in new tab/window

### Analytics Dashboard
- Recent searches show Google Maps links under business names
- Consistent styling with main searched GMBs page

### CSV Export
- Google Maps URLs are included in exported CSV files
- New column: "Google Maps URL"

## Google Maps URL Generation

The system generates Google Maps URLs in two ways:

1. **From Google Places API**: Uses the `url` field if provided
2. **Fallback Generation**: Creates URL using Place ID: `https://maps.google.com/maps?place_id={place_id}`

This ensures every searched business has a working Google Maps link.
