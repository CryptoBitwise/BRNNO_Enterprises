const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with base hostname...');

// Use the base hostname (without db. prefix)
const baseUrl = 'postgresql://postgres:nctoF4guDspEFexA@ytjbqznnaeommgsgekeh.supabase.co:5432/postgres';

console.log('Testing URL:', baseUrl);

const pool = new Pool({
    connectionString: baseUrl,
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
