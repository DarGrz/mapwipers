-- Add referer column to searched_gmbs table
-- Run this in your Supabase SQL Editor

ALTER TABLE searched_gmbs ADD COLUMN IF NOT EXISTS referer TEXT;
