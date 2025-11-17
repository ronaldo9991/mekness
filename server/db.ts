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
  } catch (error) {
    console.log('🗄️ Database schema not found, initializing...');
    try {
      // Import drizzle-kit to push schema
      const { push } = await import('drizzle-kit');
      const drizzleConfig = await import('../../drizzle.config.ts');
      await push({ config: drizzleConfig.default });
      console.log('✅ Database schema initialized successfully');
    } catch (initError) {
      console.error('⚠️ Could not auto-initialize schema with drizzle-kit, trying manual creation...');
      // Fallback: try to create tables manually
      try {
        // Get SQL from schema - create tables manually as fallback
        const { sql } = await import('drizzle-orm');
        // This is a basic fallback - drizzle-kit push is preferred
        console.warn('⚠️ Manual schema creation not implemented, please run: npm run db:push');
      } catch (manualError) {
        console.error('❌ Could not initialize database schema:', manualError);
        throw manualError;
      }
    }
  }
}
