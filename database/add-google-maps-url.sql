-- Add Google Maps URL column to searched_gmbs table
-- Run this in your Supabase SQL Editor

ALTER TABLE searched_gmbs ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Add index for better performance when searching by URL
CREATE INDEX IF NOT EXISTS idx_searched_gmbs_google_maps_url ON searched_gmbs(google_maps_url);

-- Comment for documentation
COMMENT ON COLUMN searched_gmbs.google_maps_url IS 'Google Maps URL for the searched business location';
