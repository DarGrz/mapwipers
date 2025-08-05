#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * 
 * This script verifies that all required environment variables 
 * are set up correctly for the Stripe payment integration.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking MapWipers Environment Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  if (fs.existsSync(envExamplePath)) {
    console.log('💡 Please copy .env.example to .env.local and configure your keys:');
    console.log('   cp .env.example .env.local\n');
  }
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

const requiredVars = [
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY', 
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_DOMAIN'
];

const optionalVars = [
  'GOOGLE_MAPS_API_KEY'
];

console.log('📋 Required Environment Variables:');
console.log('================================');

let allValid = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`❌ ${varName}: Not configured`);
    allValid = false;
  } else {
    // Mask sensitive keys for display
    const masked = value.substring(0, 8) + '...';
    console.log(`✅ ${varName}: ${masked}`);
  }
});

console.log('\n📋 Optional Environment Variables:');
console.log('=================================');

optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_')) {
    console.log(`⚠️  ${varName}: Not configured (optional)`);
  } else {
    const masked = value.substring(0, 8) + '...';
    console.log(`✅ ${varName}: ${masked}`);
  }
});

console.log('\n🔧 Configuration Validation:');
console.log('============================');

// Validate Stripe keys format
const pubKey = process.env.STRIPE_PUBLISHABLE_KEY;
const secKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (pubKey && !pubKey.startsWith('pk_')) {
  console.log('❌ STRIPE_PUBLISHABLE_KEY should start with "pk_"');
  allValid = false;
} else if (pubKey) {
  const isTest = pubKey.startsWith('pk_test_');
  console.log(`✅ Stripe Mode: ${isTest ? 'TEST' : 'LIVE'}`);
}

if (secKey && !secKey.startsWith('sk_')) {
  console.log('❌ STRIPE_SECRET_KEY should start with "sk_"');
  allValid = false;
}

if (webhookSecret && !webhookSecret.startsWith('whsec_')) {
  console.log('❌ STRIPE_WEBHOOK_SECRET should start with "whsec_"');
  allValid = false;
}

// Check if publishable keys match
if (pubKey !== process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.log('❌ STRIPE_PUBLISHABLE_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should match');
  allValid = false;
}

// Validate domain format
const domain = process.env.NEXT_PUBLIC_DOMAIN;
if (domain && !domain.startsWith('http')) {
  console.log('❌ NEXT_PUBLIC_DOMAIN should start with "http://" or "https://"');
  allValid = false;
}

console.log('\n🚀 Setup Status:');
console.log('================');

if (allValid) {
  console.log('✅ All required configuration is valid!');
  console.log('💡 You can now test the payment flow.');
  console.log('\n📖 Next steps:');
  console.log('   1. Start your development server: npm run dev');
  console.log('   2. Test the order form and payment flow');
  console.log('   3. Check webhook events in Stripe Dashboard');
} else {
  console.log('❌ Configuration issues found.');
  console.log('💡 Please review the errors above and update your .env.local file.');
  console.log('\n📖 Setup guide: docs/stripe-setup-guide.md');
}

console.log('\n📚 Resources:');
console.log('=============');
console.log('• Stripe Dashboard: https://dashboard.stripe.com');
console.log('• API Keys: https://dashboard.stripe.com/apikeys');
console.log('• Webhooks: https://dashboard.stripe.com/webhooks');
console.log('• Test Cards: https://stripe.com/docs/testing');
