// Test script to check analytics functions
const { getVisitorStats, getOrderStats, getSearchStats } = require('./lib/logging.ts');

async function testAnalytics() {
  console.log('Testing analytics functions...');
  
  try {
    console.log('\n1. Testing visitor stats...');
    const visitors = await getVisitorStats();
    console.log('Visitors result:', visitors);
    
    console.log('\n2. Testing order stats...');
    const orders = await getOrderStats();
    console.log('Orders result:', orders);
    
    console.log('\n3. Testing search stats...');
    const searches = await getSearchStats();
    console.log('Searches result:', searches);
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testAnalytics();
