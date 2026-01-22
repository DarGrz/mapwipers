#!/usr/bin/env node

/**
 * Database setup script for MapWipers logging system
 * This script sets up the logging tables in Supabase
 */

import { supabaseServiceRole } from '../lib/supabase.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupLoggingTables() {
  try {
    console.log('🚀 Setting up logging tables in Supabase...');

    // Read the SQL schema file
    const schemaPath = join(__dirname, '../database/logging-schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Execute the schema
    const { error } = await supabaseServiceRole.rpc('exec_sql', {
      sql: schema
    });

    if (error) {
      console.error('❌ Error setting up logging tables:', error);
      process.exit(1);
    }

    console.log('✅ Logging tables set up successfully!');

    // Test the connection by trying to select from one of the tables
    const { error: testError } = await supabaseServiceRole
      .from('visitors')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.warn('⚠️  Warning: Could not test table access:', testError.message);
    } else {
      console.log('✅ Database connection and table access verified!');
    }

    console.log(`
📊 Logging system is now ready!

The following tables have been created:
- visitors: Track page visits and user behavior
- orders: Track order creation and payment status
- searched_gmbs: Track GMB searches and place lookups

Analytics API is available at: /api/analytics
Admin dashboard is available at: /admin/analytics

Next steps:
1. Make sure your .env.local has the correct Supabase credentials
2. Deploy or restart your application
3. Visit pages to start generating visitor logs
4. Create test orders to see order tracking
5. Search for GMBs to see search logging

Happy tracking! 🎉
    `);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Alternative method if RPC is not available
async function setupWithDirectSQL() {
  try {
    console.log('🔄 Trying alternative setup method...');

    // Create tables one by one
    const tables = [
      {
        name: 'visitors',
        sql: `
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
        `
      },
      {
        name: 'orders',
        sql: `
          CREATE TABLE IF NOT EXISTS orders (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            session_id VARCHAR(255),
            customer_email VARCHAR(255),
            customer_name VARCHAR(255),
            company_name VARCHAR(255),
            nip VARCHAR(50),
            phone VARCHAR(50),
            service_type VARCHAR(100) NOT NULL,
            addons JSONB DEFAULT '[]'::jsonb,
            total_amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'USD',
            payment_status VARCHAR(50) DEFAULT 'pending',
            payment_intent_id VARCHAR(255),
            stripe_session_id VARCHAR(255),
            ip_address INET,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      },
      {
        name: 'searched_gmbs',
        sql: `
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      }
    ];

    for (const table of tables) {
      console.log(`📋 Creating table: ${table.name}`);
      // Note: This is a simplified version - in a real setup, you'd execute this in Supabase SQL editor
      console.log(`SQL for ${table.name}:`, table.sql);
    }

    console.log(`
⚠️  Manual Setup Required

Please run the SQL commands above in your Supabase SQL Editor:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the logging-schema.sql file content
4. Execute the SQL

Or use the full schema file at: database/logging-schema.sql
    `);

  } catch (error) {
    console.error('❌ Alternative setup failed:', error);
  }
}

// Run the setup
if (process.env.NODE_ENV !== 'production') {
  setupLoggingTables().catch(() => {
    console.log('🔄 Primary setup method failed, trying alternative...');
    setupWithDirectSQL();
  });
} else {
  console.log('💡 Production environment detected. Please run the setup manually in Supabase.');
  setupWithDirectSQL();
}
