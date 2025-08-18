const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing SSL connection...\n');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Try without SSL first
    connectionTimeoutMillis: 3000,
    query_timeout: 3000
});

async function testSSL() {
    try {
        console.log('🔄 Testing without SSL...');
        const client = await pool.connect();
        console.log('✅ Connected without SSL!');
        client.release();
        await pool.end();
    } catch (error) {
        console.log('❌ No SSL failed:', error.message);

        // Try with SSL
        const poolSSL = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 3000,
            query_timeout: 3000
        });

        try {
            console.log('🔄 Testing with SSL...');
            const client = await poolSSL.connect();
            console.log('✅ Connected with SSL!');
            client.release();
            await poolSSL.end();
        } catch (sslError) {
            console.log('❌ SSL also failed:', sslError.message);
        }
    }
}

testSSL();
