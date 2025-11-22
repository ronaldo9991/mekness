import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
const isPostgres = databaseUrl?.startsWith('postgresql://') || 
                   databaseUrl?.startsWith('postgres://');

let db: any;
let pool: any = null;
let dbInitialized = false;

// Initialize database connection
async function initDatabase() {
  if (isPostgres) {
    // PostgreSQL setup
    console.log('🐘 Using PostgreSQL database');
    
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    
    const connectionString = databaseUrl!;
    
    // Parse SSL requirement from connection string
    const sslConfig = connectionString.includes('sslmode=require') 
      ? { rejectUnauthorized: false } 
      : undefined;
    
    pool = new Pool({
      connectionString,
      ssl: sslConfig,
    });
    
    db = drizzle(pool, { schema });
    
    // Test connection
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL connection successful');
      dbInitialized = true;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
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

// Initialize immediately and wait for it
const dbInit = initDatabase().catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  dbInitialized = false;
  // Don't throw - let the app start and handle errors at runtime
});

// Export a function to ensure DB is ready
export async function ensureDbReady() {
  if (!dbInitialized) {
    await dbInit;
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export { db, pool, dbInit };

// Initialize database schema
export async function initializeDatabase() {
  if (isPostgres) {
    // For PostgreSQL, use drizzle-kit push or migrations
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
      
      // Schema will be created via migrations or drizzle-kit push
      // Run migrations manually: npm run db:push
      console.log('💡 To create tables, run: npm run db:push');
    } catch (error) {
      console.error('❌ Error initializing PostgreSQL schema:', error);
      console.warn('⚠️ Continuing startup, but database operations may fail until schema is created');
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
