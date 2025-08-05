// Test script to check if logging is working
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Environment variables:');
  console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Set' : 'Not set');

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Environment variables not properly configured');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test database connection
  try {
    console.log('\n🔍 Testing database connection...');
    
    // Test visitors table
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('count(*)')
      .limit(1);
    
    if (visitorsError) {
      console.error('❌ Visitors table error:', visitorsError);
    } else {
      console.log('✅ Visitors table accessible');
    }

    // Test orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)')
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Orders table error:', ordersError);
    } else {
      console.log('✅ Orders table accessible');
    }

    // Test searched_gmbs table
    const { data: searchedGmbs, error: searchedGmbsError } = await supabase
      .from('searched_gmbs')
      .select('count(*)')
      .limit(1);
    
    if (searchedGmbsError) {
      console.error('❌ Searched GMBs table error:', searchedGmbsError);
    } else {
      console.log('✅ Searched GMBs table accessible');
    }

    // Test inserting a sample record
    console.log('\n🧪 Testing data insertion...');
    
    const testVisitor = {
      page_path: '/test',
      ip_address: '127.0.0.1',
      user_agent: 'Test Script',
      session_id: 'test-session-' + Date.now()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('visitors')
      .insert(testVisitor)
      .select();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Insert test successful:', insertData);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
