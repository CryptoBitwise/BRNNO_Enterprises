const fetch = require('node-fetch');
require('dotenv').config();

console.log('🔍 Testing Supabase API connection...\n');

async function testSupabaseAPI() {
    try {
        // Test if we can reach the Supabase API
        const supabaseUrl = process.env.SUPABASE_URL;
        console.log('Testing URL:', supabaseUrl);

        const response = await fetch(supabaseUrl, {
            method: 'GET',
            timeout: 5000
        });

        console.log('✅ Supabase API response status:', response.status);

    } catch (error) {
        console.error('❌ Supabase API test failed:', error.message);
    }
}

testSupabaseAPI();
