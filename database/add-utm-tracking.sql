-- Add UTM parameters and GTM tracking columns to visitors table
-- Run this in your Supabase SQL Editor if you already have the visitors table

-- Add UTM columns
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255);
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255);
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255);
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS utm_term VARCHAR(255);
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS utm_content VARCHAR(255);

-- Add GTM tracking column
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS gtm_from VARCHAR(255);

-- Create indexes for better performance on UTM filtering
CREATE INDEX IF NOT EXISTS idx_visitors_utm_source ON visitors(utm_source);
CREATE INDEX IF NOT EXISTS idx_visitors_utm_medium ON visitors(utm_medium);
CREATE INDEX IF NOT EXISTS idx_visitors_utm_campaign ON visitors(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_visitors_gtm_from ON visitors(gtm_from);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'visitors' 
ORDER BY ordinal_position;
