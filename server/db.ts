import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use SQLite for development (works great on AWS EC2/containers too)
// For PostgreSQL support on AWS RDS, see AWS_DEPLOYMENT.md
// The schema would need to be migrated from sqliteTable to pgTable
const databaseUrl = process.env.DATABASE_URL;

// Determine database path - use writable location in production
let dbPath: string;
if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  // Use custom path from environment variable
  dbPath = databaseUrl;
} else if (process.env.NODE_ENV === 'production') {
  // In production (App Runner), use /tmp for writable storage
  // Note: This is ephemeral - data will be lost on restart
  // For persistent data, use DATABASE_URL to point to S3 or external storage
  dbPath = process.env.DATABASE_PATH || path.join('/tmp', 'mekness.db');
} else {
  // Development - use project root
  dbPath = path.join(__dirname, '..', 'local.db');
}

console.log('📁 SQLite database path:', dbPath);

// Ensure directory exists for the database file
const dbDir = path.dirname(dbPath);
try {
  const fs = await import('fs');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Created database directory:', dbDir);
  }
} catch (error) {
  console.warn('⚠️ Could not ensure database directory exists:', error);
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export const pool = null; // SQLite doesn't use connection pools

// Initialize database schema on first run
export async function initializeDatabase() {
  try {
    // Try to query a table to check if schema exists
    await db.select().from(schema.users).limit(1);
    console.log('✅ Database schema already exists');
    return;
  } catch (error) {
    // Schema doesn't exist, need to create it
    console.log('🗄️ Database schema not found, initializing...');
  }

  // Create tables using Drizzle's SQL execution
  try {
    const { sql } = await import('drizzle-orm');
    
    // Get SQLite database instance for direct SQL execution
    const dbInstance = sqlite;
    
    // Check if users table exists
    const tableCheck = dbInstance.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();
    
    if (!tableCheck) {
      console.log('Creating database tables...');
      
      // Note: Drizzle's migrate() or push() would be ideal here,
      // but for runtime initialization, we'll create a basic schema
      // The full schema creation is best done via drizzle-kit push during build
      
      // For now, log that schema needs to be created
      console.warn('⚠️ Database tables not found. Schema should be initialized via migrations.');
      console.warn('⚠️ In production, ensure drizzle-kit push runs during build or deployment.');
      console.warn('⚠️ For App Runner, consider running: npm run db:push in build step');
      
      // Try to import and use drizzle-kit if available
      try {
        const drizzleKit = await import('drizzle-kit');
        if (drizzleKit.push) {
          const { default: drizzleConfig } = await import('../../drizzle.config.js');
          await drizzleKit.push({ config: drizzleConfig });
          console.log('✅ Database schema initialized via drizzle-kit');
          return;
        }
      } catch (drizzleKitError) {
        // drizzle-kit not available in production bundle
        console.warn('⚠️ drizzle-kit not available, schema must be pre-initialized');
      }
    } else {
      console.log('✅ Database schema already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
    // Don't throw - app can still start, but database operations may fail
    console.warn('⚠️ Continuing startup, but database operations may fail until schema is created');
  }
}
