/**
 * Run database migrations
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function runMigrations() {
  console.log('🚀 Running database migrations...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    console.log('📡 Connecting to database...');
    await migrate(db, { migrationsFolder: './migrations' });

    console.log('\n✅ Migrations completed successfully!');
    console.log('\nNext steps:');
    console.log('  npx tsx scripts/seed-sample-portfolio.ts');
    console.log('  npx tsx scripts/seed-reviews.ts\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
