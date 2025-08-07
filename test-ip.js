const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with IP address...');

// Use the IP address we found from ping
const ipUrl = 'postgresql://postgres:nctoF4guDspEFexA@172.64.149.246:5432/postgres';

console.log('Testing URL:', ipUrl);

const pool = new Pool({
    connectionString: ipUrl,
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
