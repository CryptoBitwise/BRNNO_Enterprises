const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Debugging database connection...\n');

console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not set');
  process.exit(1);
}

// Parse the connection string to see what we're connecting to
const url = new URL(process.env.DATABASE_URL);
console.log('Connection details:');
console.log('Host:', url.hostname);
console.log('Port:', url.port);
console.log('Database:', url.pathname);
console.log('User:', url.username);
console.log('');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10 seconds
  query_timeout: 10000
});

// Add event listeners to see what's happening
pool.on('connect', () => {
  console.log('✅ Pool connected');
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

pool.on('acquire', () => {
  console.log('🔗 Client acquired');
});

pool.on('release', () => {
  console.log('🔓 Client released');
});

async function debugConnection() {
  try {
    console.log('🔄 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Client connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
}

debugConnection();
