/**
 * Automated database setup script
 * Sets up PostgreSQL schema and seeds with sample data
 */

import 'dotenv/config';
import { db } from '../server/db';
import { portfolioItems, blogPosts, reviews, contactSubmissions } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  console.log('🗄️  Setting up PostgreSQL database...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful!\n');

    // Check if tables exist
    console.log('🔍 Checking existing tables...');
    const tablesResult = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const existingTables = tablesResult.rows.map((row: any) => row.table_name);
    console.log('📋 Existing tables:', existingTables.join(', ') || 'none');

    if (existingTables.length === 0) {
      console.log('\n⚠️  No tables found. Please run: npm run db:push\n');
      console.log('Instructions:');
      console.log('1. Run: npm run db:push');
      console.log('2. When prompted, press ENTER to create tables');
      console.log('3. Then run this script again: npx tsx scripts/setup-database.ts\n');
      process.exit(1);
    }

    // Count existing data
    console.log('\n📊 Checking existing data...');
    const portfolioCount = await db.select({ count: sql`count(*)` }).from(portfolioItems);
    const reviewCount = await db.select({ count: sql`count(*)` }).from(reviews);
    const blogCount = await db.select({ count: sql`count(*)` }).from(blogPosts);

    console.log(`- Portfolio items: ${portfolioCount[0].count}`);
    console.log(`- Reviews: ${reviewCount[0].count}`);
    console.log(`- Blog posts: ${blogCount[0].count}`);

    if (portfolioCount[0].count > 0 || reviewCount[0].count > 0) {
      console.log('\n✅ Database already has data. Setup complete!');
      console.log('\nTo reseed with fresh data, run:');
      console.log('  npx tsx scripts/seed-sample-portfolio.ts');
      console.log('  npx tsx scripts/seed-reviews.ts\n');
    } else {
      console.log('\n⏳ Database is empty. Run seeding scripts:');
      console.log('  npx tsx scripts/seed-sample-portfolio.ts');
      console.log('  npx tsx scripts/seed-reviews.ts\n');
    }

    console.log('🎉 Database setup check complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\nMake sure:');
    console.error('1. DATABASE_URL is set in .env');
    console.error('2. PostgreSQL database is accessible');
    console.error('3. You have run: npm run db:push\n');
    process.exit(1);
  }
}

setupDatabase();
