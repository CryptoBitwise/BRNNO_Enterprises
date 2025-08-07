// Database setup script for BRNNO API
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🗄️ Setting up BRNNO API database...\n');

if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is not set in .env file');
    console.log('Please add your PostgreSQL connection string to .env file');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
    try {
        // Test connection
        console.log('1️⃣ Testing database connection...');
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful\n');

        // Read and execute schema
        console.log('2️⃣ Creating base schema...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Base schema created\n');

        // Read and execute migrations in order
        const migrationsDir = path.join(__dirname, 'database', 'migrations');
        const migrationFiles = [
            '002_create_clients_table.sql',
            '003_create_services_table.sql',
            '004_create_quotes_tables.sql',
            '005_create_invoices_tables.sql'
        ];

        console.log('3️⃣ Running migrations...');
        for (const file of migrationFiles) {
            console.log(`   Running: ${file}`);
            const migrationPath = path.join(migrationsDir, file);
            const migration = fs.readFileSync(migrationPath, 'utf8');
            await pool.query(migration);
            console.log(`   ✅ ${file} completed`);
        }
        console.log('✅ All migrations completed\n');

        // Verify tables were created
        console.log('4️⃣ Verifying tables...');
        const tables = ['users', 'clients', 'services', 'quotes', 'quote_items', 'invoices', 'invoice_items'];
        for (const table of tables) {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                );
            `, [table]);

            if (result.rows[0].exists) {
                console.log(`   ✅ Table '${table}' exists`);
            } else {
                console.log(`   ❌ Table '${table}' missing`);
            }
        }

        console.log('\n🎉 Database setup completed successfully!');
        console.log('🚀 Your BRNNO API is ready to use!');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase();
