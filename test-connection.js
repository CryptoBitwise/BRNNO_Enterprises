const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing database connection...\n');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not set');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000, // 5 second timeout
    query_timeout: 5000
});

async function testConnection() {
    try {
        console.log('🔄 Attempting to connect...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        const result = await client.query('SELECT NOW()');
        console.log('✅ Query successful:', result.rows[0]);

        client.release();
        await pool.end();

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();
