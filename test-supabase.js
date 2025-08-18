// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🧪 Testing Supabase connection...\n');

// Check environment variables
console.log('Environment variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'NOT SET');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'NOT SET');
console.log('');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSupabase() {
  try {
    console.log('1️⃣ Testing Supabase client initialization...');
    
    // Test basic connection
    console.log('✅ Supabase client created successfully');
    
    // Test auth admin functions
    console.log('2️⃣ Testing auth admin functions...');
    
    // Try to list users (this will test if the service key has proper permissions)
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Auth admin error:', error.message);
    } else {
      console.log('✅ Auth admin working, found', data.users?.length || 0, 'users');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSupabase();
