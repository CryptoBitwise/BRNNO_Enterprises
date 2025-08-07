const { Pool } = require('pg');
require('dotenv').config();

console.log('Debugging database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');

if (process.env.DATABASE_URL) {
    console.log('URL length:', process.env.DATABASE_URL.length);
    console.log('URL contains line breaks:', process.env.DATABASE_URL.includes('\n'));
    console.log('URL contains carriage returns:', process.env.DATABASE_URL.includes('\r'));
}

// Test DNS resolution
const dns = require('dns');
const url = require('url');

if (process.env.DATABASE_URL) {
    try {
        const parsed = url.parse(process.env.DATABASE_URL);
        console.log('Parsed hostname:', parsed.hostname);

        dns.lookup(parsed.hostname, (err, address, family) => {
            if (err) {
                console.log('DNS lookup failed:', err.message);
            } else {
                console.log('DNS lookup successful:', address, family);
            }
        });
    } catch (error) {
        console.log('URL parsing failed:', error.message);
    }
}
