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
    // Check if users table exists using direct SQL query
    const tableCheck = sqlite.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get() as { name: string } | undefined;
    
    if (tableCheck) {
      console.log('✅ Database schema already exists');
      return;
    }
    
    // Table doesn't exist - create it using runtime migrations
    console.log('🗄️ Database schema not found, initializing...');
    
    // Try to use drizzle-kit first (if available during build)
    let schemaCreated = false;
    try {
      const drizzleKit = await import('drizzle-kit');
      if (drizzleKit.push) {
        const { default: drizzleConfig } = await import('../../drizzle.config.js');
        await drizzleKit.push({ config: drizzleConfig });
        console.log('✅ Database schema initialized via drizzle-kit');
        schemaCreated = true;
      }
    } catch (drizzleKitError) {
      // drizzle-kit not available - use runtime SQL migrations
      console.log('⚠️ drizzle-kit not available, using runtime SQL migrations...');
    }
    
    // If drizzle-kit didn't work, use runtime SQL migrations
    if (!schemaCreated) {
      try {
        // Import and use runtime migrations
        const { createTables } = await import('./migrations.js');
        createTables(sqlite);
        console.log('✅ Database schema initialized via runtime migrations');
        schemaCreated = true;
      } catch (migrationError) {
        console.error('❌ Error running runtime migrations:', migrationError);
        throw migrationError;
      }
    }
    
    // Verify tables were created
    const verifyCheck = sqlite.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get() as { name: string } | undefined;
    
    if (!verifyCheck) {
      throw new Error('Database tables were not created successfully');
    }
    
    console.log('✅ Database schema initialization verified');
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
    // Don't throw - app can still start, but database operations may fail
    console.warn('⚠️ Continuing startup, but database operations may fail until schema is created');
  }
}
