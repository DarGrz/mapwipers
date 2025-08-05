-- Add referer column to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS referer TEXT;

-- Update the updated_at trigger to include the new column (if you have one)
-- This is optional, but good practice for tracking changes
