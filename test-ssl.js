const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with different SSL settings...');

// Try with the base hostname and different SSL settings
const testUrl = 'postgresql://postgres:nctoF4guDspEFexA@ytjbqznnaeommgsgekeh.supabase.co:5432/postgres';

console.log('Testing URL:', testUrl);

const pool = new Pool({
    connectionString: testUrl,
    ssl: {
        rejectUnauthorized: false,
        sslmode: 'require'
    }
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
