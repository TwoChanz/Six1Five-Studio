import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNeonHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "../shared/schema.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we should use SQLite for local development
const useSqlite = process.env.USE_SQLITE === 'true';

let pool: Pool | null = null;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzleSqlite> | ReturnType<typeof drizzleNeonHttp>;

if (useSqlite) {
  // Use SQLite for local development
  console.log('📦 Using SQLite database for local development');
  const sqliteDb = new Database(path.join(__dirname, '..', 'local.db'));
  sqliteDb.pragma('foreign_keys = ON');
  db = drizzleSqlite({ client: sqliteDb, schema });
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set when USE_SQLITE is not true. Did you forget to provision a database?",
    );
  }

  // Use PostgreSQL/Neon for production
  // For Vercel serverless, use HTTP driver (faster for serverless)
  if (process.env.VERCEL) {
    console.log('🌐 Using Neon HTTP driver for Vercel serverless');
    const sql = neon(process.env.DATABASE_URL);
    db = drizzleNeonHttp(sql, { schema });
  } else {
    // Use WebSocket Pool for local development with PostgreSQL
    console.log('🐘 Using Neon WebSocket Pool for local PostgreSQL');
    neonConfig.webSocketConstructor = ws;
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzleNeon({ client: pool, schema });
  }
}

export { pool, db };