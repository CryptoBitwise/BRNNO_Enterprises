const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with alternative hostname...');

// Try with the base hostname (without db. prefix)
const altUrl = process.env.DATABASE_URL.replace('db.ytjbqznnaeommgsgekeh.supabase.co', 'ytjbqznnaeommgsgekeh.supabase.co');

console.log('Original URL:', process.env.DATABASE_URL);
console.log('Alternative URL:', altUrl);

const pool = new Pool({
    connectionString: altUrl,
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
