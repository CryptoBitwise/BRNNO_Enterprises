// Test database connection
const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');

if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is not set in .env file');
    console.log('Please add your PostgreSQL connection string to .env file');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
    process.exit(0);
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
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
