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
        // Note: migrations.ts needs to be bundled with the server code
        let createTables: (db: Database.Database) => void;
        try {
          const migrationsModule = await import('./migrations.js');
          createTables = migrationsModule.createTables;
        } catch (importError) {
          console.error('❌ Could not import migrations.js:', importError);
          // Fallback: create tables inline if migrations can't be imported
          console.log('⚠️ Using inline SQL migrations as fallback...');
          createTables = (db: Database.Database) => {
            console.log('🗄️ Creating database tables inline...');
            
            // Users table
            db.exec(`
              CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                full_name TEXT,
                phone TEXT,
                country TEXT,
                city TEXT,
                address TEXT,
                zip_code TEXT,
                referral_id TEXT UNIQUE,
                referred_by TEXT,
                referral_status TEXT DEFAULT 'Pending',
                verified INTEGER DEFAULT 0,
                enabled INTEGER DEFAULT 1,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Admin Users table
            db.exec(`
              CREATE TABLE IF NOT EXISTS admin_users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL,
                enabled INTEGER DEFAULT 1,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                created_by TEXT
              )
            `);

            // Trading Accounts table
            db.exec(`
              CREATE TABLE IF NOT EXISTS trading_accounts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                account_id TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                type TEXT NOT NULL,
                "group" TEXT NOT NULL,
                leverage TEXT NOT NULL,
                balance TEXT DEFAULT '0',
                equity TEXT DEFAULT '0',
                margin TEXT DEFAULT '0',
                free_margin TEXT DEFAULT '0',
                margin_level TEXT DEFAULT '0',
                currency TEXT DEFAULT 'USD',
                server TEXT DEFAULT 'Mekness-Live',
                enabled INTEGER DEFAULT 1,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Deposits table
            db.exec(`
              CREATE TABLE IF NOT EXISTS deposits (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                account_id TEXT NOT NULL REFERENCES trading_accounts(id),
                merchant TEXT NOT NULL,
                amount TEXT NOT NULL,
                currency TEXT DEFAULT 'USD',
                status TEXT NOT NULL DEFAULT 'Pending',
                transaction_id TEXT,
                verification_file TEXT,
                deposit_date INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                completed_at INTEGER
              )
            `);

            // Withdrawals table
            db.exec(`
              CREATE TABLE IF NOT EXISTS withdrawals (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                account_id TEXT NOT NULL REFERENCES trading_accounts(id),
                method TEXT NOT NULL,
                amount TEXT NOT NULL,
                currency TEXT DEFAULT 'USD',
                bank_name TEXT,
                account_number TEXT,
                account_holder_name TEXT,
                swift_code TEXT,
                status TEXT NOT NULL DEFAULT 'Pending',
                rejection_reason TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                processed_at INTEGER
              )
            `);

            // Trading History table
            db.exec(`
              CREATE TABLE IF NOT EXISTS trading_history (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                account_id TEXT NOT NULL REFERENCES trading_accounts(id),
                ticket_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                type TEXT NOT NULL,
                volume TEXT NOT NULL,
                open_price TEXT NOT NULL,
                close_price TEXT,
                stop_loss TEXT,
                take_profit TEXT,
                profit TEXT,
                commission TEXT DEFAULT '0',
                swap TEXT DEFAULT '0',
                status TEXT NOT NULL,
                open_time INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                close_time INTEGER
              )
            `);

            // Documents table
            db.exec(`
              CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                type TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_url TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Pending',
                rejection_reason TEXT,
                approved_by TEXT,
                uploaded_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                verified_at INTEGER
              )
            `);

            // Notifications table
            db.exec(`
              CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT NOT NULL,
                "read" INTEGER DEFAULT 0,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Admin Country Assignments table
            db.exec(`
              CREATE TABLE IF NOT EXISTS admin_country_assignments (
                id TEXT PRIMARY KEY,
                admin_id TEXT NOT NULL REFERENCES admin_users(id),
                country TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Activity Logs table
            db.exec(`
              CREATE TABLE IF NOT EXISTS activity_logs (
                id TEXT PRIMARY KEY,
                admin_id TEXT REFERENCES admin_users(id),
                user_id TEXT REFERENCES users(id),
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                entity_id TEXT,
                details TEXT,
                ip_address TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Support Tickets table
            db.exec(`
              CREATE TABLE IF NOT EXISTS support_tickets (
                id TEXT PRIMARY KEY,
                user_id TEXT REFERENCES users(id),
                admin_id TEXT REFERENCES admin_users(id),
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Open',
                priority TEXT DEFAULT 'Medium',
                category TEXT,
                attachments TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                resolved_at INTEGER
              )
            `);

            // Support Ticket Replies table
            db.exec(`
              CREATE TABLE IF NOT EXISTS support_ticket_replies (
                id TEXT PRIMARY KEY,
                ticket_id TEXT NOT NULL REFERENCES support_tickets(id),
                user_id TEXT REFERENCES users(id),
                admin_id TEXT REFERENCES admin_users(id),
                message TEXT NOT NULL,
                attachments TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Fund Transfers table
            db.exec(`
              CREATE TABLE IF NOT EXISTS fund_transfers (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                from_account_id TEXT NOT NULL REFERENCES trading_accounts(id),
                to_account_id TEXT NOT NULL REFERENCES trading_accounts(id),
                amount TEXT NOT NULL,
                currency TEXT DEFAULT 'USD',
                status TEXT NOT NULL DEFAULT 'Pending',
                notes TEXT,
                processed_by TEXT REFERENCES admin_users(id),
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                processed_at INTEGER
              )
            `);

            // IB CB Wallets table
            db.exec(`
              CREATE TABLE IF NOT EXISTS ib_cb_wallets (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                wallet_type TEXT NOT NULL,
                balance TEXT DEFAULT '0',
                currency TEXT DEFAULT 'USD',
                commission_rate TEXT DEFAULT '0',
                total_commission TEXT DEFAULT '0',
                enabled INTEGER DEFAULT 1,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
              )
            `);

            // Stripe Payments table
            db.exec(`
              CREATE TABLE IF NOT EXISTS stripe_payments (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id),
                deposit_id TEXT REFERENCES deposits(id),
                stripe_payment_intent_id TEXT NOT NULL UNIQUE,
                amount TEXT NOT NULL,
                currency TEXT DEFAULT 'USD',
                status TEXT NOT NULL,
                metadata TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                completed_at INTEGER
              )
            `);

            console.log('✅ All database tables created successfully');
          };
        }
        
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
