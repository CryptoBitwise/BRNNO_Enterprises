const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with IPv6...');

// Force Node.js to prefer IPv6
process.env.UV_THREADPOOL_SIZE = 1;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
});

// Test query
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('❌ Query failed:', err.message);
    } else {
        console.log('✅ Database query successful:', result.rows[0]);
    }
    pool.end();
});
