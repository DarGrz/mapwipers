-- Logging schema for visitors, orders, and searched GMBs
-- Run this in your Supabase SQL Editor

-- Table for tracking visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  page_path VARCHAR(500) NOT NULL,
  country VARCHAR(100),
  city VARCHAR(100),
  session_id VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  gtm_from VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table for tracking orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  company_name VARCHAR(255),
  nip VARCHAR(50),
  phone VARCHAR(50),
  service_type VARCHAR(100) NOT NULL, -- 'remove' or 'reset'
  addons JSONB DEFAULT '[]'::jsonb, -- Array of addon codes
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
  payment_intent_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table for tracking searched GMBs
CREATE TABLE IF NOT EXISTS searched_gmbs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255),
  search_query VARCHAR(500),
  location VARCHAR(255),
  place_id VARCHAR(255),
  place_name VARCHAR(500),
  place_address TEXT,
  place_phone VARCHAR(50),
  place_website TEXT,
  place_rating DECIMAL(3,2),
  place_rating_count INTEGER,
  place_business_status VARCHAR(100),
  place_types JSONB DEFAULT '[]'::jsonb,
  place_geometry JSONB,
  search_results_count INTEGER,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_session ON visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_page_path ON visitors(page_path);
CREATE INDEX IF NOT EXISTS idx_visitors_utm_source ON visitors(utm_source);
CREATE INDEX IF NOT EXISTS idx_visitors_utm_medium ON visitors(utm_medium);
CREATE INDEX IF NOT EXISTS idx_visitors_utm_campaign ON visitors(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_visitors_gtm_from ON visitors(gtm_from);

CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_service_type ON orders(service_type);

CREATE INDEX IF NOT EXISTS idx_searched_gmbs_session ON searched_gmbs(session_id);
CREATE INDEX IF NOT EXISTS idx_searched_gmbs_place_id ON searched_gmbs(place_id);
CREATE INDEX IF NOT EXISTS idx_searched_gmbs_created_at ON searched_gmbs(created_at);
CREATE INDEX IF NOT EXISTS idx_searched_gmbs_query ON searched_gmbs(search_query);

-- Enable RLS (Row Level Security)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE searched_gmbs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visitors
CREATE POLICY "Allow read access for service role" ON visitors
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Allow insert for all" ON visitors
  FOR INSERT WITH CHECK (true);

-- RLS Policies for orders  
CREATE POLICY "Allow read access for service role" ON orders
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Allow insert for all" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for service role" ON orders
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

-- RLS Policies for searched_gmbs
CREATE POLICY "Allow read access for service role" ON searched_gmbs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Allow insert for all" ON searched_gmbs
  FOR INSERT WITH CHECK (true);

-- Function to automatically update updated_at for orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();
