-- Add GMB/Business information columns to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS business_place_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_name VARCHAR(500),
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS business_website TEXT,
ADD COLUMN IF NOT EXISTS business_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS business_google_url TEXT,
ADD COLUMN IF NOT EXISTS referer TEXT;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_orders_business_place_id ON orders(business_place_id);
CREATE INDEX IF NOT EXISTS idx_orders_business_name ON orders(business_name);

-- Add a comment to document the change
COMMENT ON COLUMN orders.business_place_id IS 'Google Places ID of the business for which the order was created';
COMMENT ON COLUMN orders.business_name IS 'Name of the business for which the order was created';
COMMENT ON COLUMN orders.business_address IS 'Address of the business for which the order was created';
COMMENT ON COLUMN orders.business_phone IS 'Phone number of the business for which the order was created';
COMMENT ON COLUMN orders.business_website IS 'Website URL of the business for which the order was created';
COMMENT ON COLUMN orders.business_rating IS 'Google rating of the business for which the order was created';
COMMENT ON COLUMN orders.business_google_url IS 'Google Maps/Places URL of the business for which the order was created';
