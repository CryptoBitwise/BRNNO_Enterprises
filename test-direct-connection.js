const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing direct connection...\n');

// Try a direct connection without the db. prefix
const directUrl = process.env.DATABASE_URL.replace('db.ytjbqznnaeommgsgekeh.supabase.co', 'ytjbqznnaeommgsgekeh.supabase.co');

console.log('Original URL:', process.env.DATABASE_URL);
console.log('Direct URL:', directUrl);

const pool = new Pool({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    query_timeout: 5000
});

async function testDirect() {
    try {
        console.log('🔄 Testing direct connection...');
        const client = await pool.connect();
        console.log('✅ Direct connection successful!');

        const result = await client.query('SELECT NOW()');
        console.log('✅ Query successful:', result.rows[0]);

        client.release();
        await pool.end();

    } catch (error) {
        console.error('❌ Direct connection failed:', error.message);
    }
}

testDirect();
