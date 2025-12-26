const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'localmarket',
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migration...');
    
    // Add phone column
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN 
          ALTER TABLE users ADD COLUMN phone VARCHAR(20); 
        END IF; 
      END $$;
    `);
    console.log('Checked/Added phone column');

    // Add address column
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN 
          ALTER TABLE users ADD COLUMN address TEXT; 
        END IF; 
      END $$;
    `);
    console.log('Checked/Added address column');

    // Add image column (just in case)
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN 
          ALTER TABLE users ADD COLUMN image TEXT; 
        END IF; 
      END $$;
    `);
    console.log('Checked/Added image column');

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
