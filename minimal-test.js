const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Minimal database test...\n');

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
  console.log('❌ No DATABASE_URL');
  process.exit(1);
}

// Try with minimal configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 3000,
  query_timeout: 3000
});

console.log('🔄 Testing connection...');

pool.query('SELECT 1', (err, result) => {
  if (err) {
    console.error('❌ Error:', err.message);
    console.error('Error code:', err.code);
  } else {
    console.log('✅ Success:', result.rows[0]);
  }
  pool.end();
});
