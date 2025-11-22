import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get DATABASE_URL - check multiple sources
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

// Debug logging
console.log('🔍 Database Configuration Check:');
console.log('  DATABASE_URL:', databaseUrl ? `${databaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PGHOST:', process.env.PGHOST || 'NOT SET');

const isPostgres = databaseUrl?.startsWith('postgresql://') || 
                   databaseUrl?.startsWith('postgres://');

if (isPostgres) {
  console.log('✅ PostgreSQL detected from DATABASE_URL');
} else {
  console.log('⚠️ PostgreSQL NOT detected - will use SQLite');
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR: In production mode but DATABASE_URL is not a PostgreSQL connection string!');
    console.error('   This will cause issues. Please set DATABASE_URL in Railway.');
  }
}

let db: any;
let pool: any = null;
let dbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

// Initialize database connection
async function initDatabase() {
  // Re-check at runtime in case env vars weren't available at module load
  const runtimeDatabaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
  const runtimeIsPostgres = runtimeDatabaseUrl?.startsWith('postgresql://') || 
                             runtimeDatabaseUrl?.startsWith('postgres://');
  
  if (runtimeIsPostgres) {
    // PostgreSQL setup
    console.log('🐘 Using PostgreSQL database');
    console.log('   Connection string:', runtimeDatabaseUrl?.replace(/:[^:@]+@/, ':****@'));
    
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    
    const connectionString = runtimeDatabaseUrl!;
    
    // Parse SSL requirement from connection string
    // Railway internal connections typically don't need SSL, but external ones might
    const needsSSL = connectionString.includes('sslmode=require') || 
                     connectionString.includes('shuttle.proxy.rlwy.net');
    const sslConfig = needsSSL 
      ? { rejectUnauthorized: false } 
      : undefined;
    
    if (needsSSL) {
      console.log('   Using SSL connection');
    }
    
    pool = new Pool({
      connectionString,
      ssl: sslConfig,
      // Add connection timeout
      connectionTimeoutMillis: 10000,
      // Add query timeout
      query_timeout: 10000,
    });
    
    db = drizzle(pool, { schema });
    
    // Test connection
    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ PostgreSQL connection successful');
      console.log('   Server time:', result.rows[0].current_time);
      console.log('   PostgreSQL version:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
      dbInitialized = true;
    } catch (error: any) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Connection string (masked):', connectionString?.replace(/:[^:@]+@/, ':****@'));
      throw error;
    }
  } else {
    // SQLite setup (for local development)
    console.log('📁 Using SQLite database');
    
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    
    let dbPath: string;
    if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
      dbPath = databaseUrl;
    } else if (process.env.NODE_ENV === 'production') {
      dbPath = process.env.DATABASE_PATH || path.join('/tmp', 'mekness.db');
    } else {
      dbPath = path.join(__dirname, '..', 'local.db');
    }
    
    console.log('📁 SQLite database path:', dbPath);
    
    const dbDir = path.dirname(dbPath);
    const fs = await import('fs');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('✅ Created database directory:', dbDir);
    }
    
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    
    db = drizzle(sqlite, { schema });
    console.log('✅ SQLite database initialized');
    dbInitialized = true;
  }
}

// Initialize immediately
dbInitPromise = initDatabase().catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  dbInitialized = false;
  // Don't throw - let the app start and handle errors at runtime
});

// Export a function to ensure DB is ready
export async function ensureDbReady() {
  if (!dbInitialized && dbInitPromise) {
    await dbInitPromise;
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Wrapper for db that ensures it's ready
export async function getDb() {
  await ensureDbReady();
  return db;
}

export { db, pool, dbInitPromise as dbInit };

// Initialize database schema
export async function initializeDatabase() {
  // Re-check at runtime
  const runtimeDatabaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
  const runtimeIsPostgres = runtimeDatabaseUrl?.startsWith('postgresql://') || 
                             runtimeDatabaseUrl?.startsWith('postgres://');
  
  if (runtimeIsPostgres) {
    // For PostgreSQL, automatically create tables if they don't exist
    if (!pool) {
      console.error('❌ PostgreSQL pool not initialized. Cannot create tables.');
      throw new Error('PostgreSQL connection pool not available');
    }
    
    try {
      // Check if users table exists
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      `);
      
      if (result.rows.length > 0) {
        console.log('✅ PostgreSQL schema already exists');
        return;
      }
      
      // Tables don't exist - create them automatically
      console.log('🗄️ PostgreSQL tables not found, creating automatically...');
      const { createPostgresTables } = await import('./pg-migrations.js');
      await createPostgresTables(pool);
      console.log('✅ PostgreSQL schema initialized automatically');
    } catch (error) {
      console.error('❌ Error initializing PostgreSQL schema:', error);
      console.warn('⚠️ Continuing startup, but database operations may fail until schema is created');
      console.warn('💡 You can also run manually: npm run db:push');
    }
  } else {
    // SQLite initialization
    try {
      const Database = (await import('better-sqlite3')).default;
      
      let dbPath: string;
      if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
        dbPath = databaseUrl;
      } else if (process.env.NODE_ENV === 'production') {
        dbPath = process.env.DATABASE_PATH || path.join('/tmp', 'mekness.db');
      } else {
        dbPath = path.join(__dirname, '..', 'local.db');
      }
      
      const sqlite = new Database(dbPath);
      
      // Check if users table exists
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
      
      // Try to use drizzle-kit first (via CLI, not programmatically)
      let schemaCreated = false;
      try {
        // For SQLite, we can use runtime migrations
        console.log('⚠️ Using runtime SQL migrations for SQLite...');
      } catch (drizzleKitError) {
        console.log('⚠️ drizzle-kit not available, using runtime SQL migrations...');
      }
      
      // If drizzle-kit didn't work, use runtime SQL migrations
      if (!schemaCreated) {
        try {
          const migrationsModule = await import('./migrations.js');
          const { createTables } = migrationsModule;
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
      console.warn('⚠️ Continuing startup, but database operations may fail until schema is created');
    }
  }
}
