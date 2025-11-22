// PostgreSQL runtime migrations
// Creates all tables automatically if they don't exist

export async function createPostgresTables(pool: any) {
  console.log('🗄️ Creating PostgreSQL tables...');

  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
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
      verified BOOLEAN DEFAULT false,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Admin Users table
    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      created_by TEXT
    )`,

    // Trading Accounts table
    `CREATE TABLE IF NOT EXISTS trading_accounts (
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
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Deposits table
    `CREATE TABLE IF NOT EXISTS deposits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      account_id TEXT NOT NULL REFERENCES trading_accounts(id),
      merchant TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'Pending',
      transaction_id TEXT,
      verification_file TEXT,
      deposit_date TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    )`,

    // Withdrawals table
    `CREATE TABLE IF NOT EXISTS withdrawals (
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
      created_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP
    )`,

    // Trading History table
    `CREATE TABLE IF NOT EXISTS trading_history (
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
      open_time TIMESTAMP DEFAULT NOW(),
      close_time TIMESTAMP
    )`,

    // Documents table
    `CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      rejection_reason TEXT,
      approved_by TEXT,
      uploaded_at TIMESTAMP DEFAULT NOW(),
      verified_at TIMESTAMP
    )`,

    // Notifications table
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      "read" BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Admin Country Assignments table
    `CREATE TABLE IF NOT EXISTS admin_country_assignments (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admin_users(id),
      country TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Activity Logs table
    `CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT REFERENCES admin_users(id),
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Support Tickets table
    `CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      admin_id TEXT REFERENCES admin_users(id),
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open',
      priority TEXT DEFAULT 'Medium',
      category TEXT,
      attachments TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      resolved_at TIMESTAMP
    )`,

    // Support Ticket Replies table
    `CREATE TABLE IF NOT EXISTS support_ticket_replies (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL REFERENCES support_tickets(id),
      user_id TEXT REFERENCES users(id),
      admin_id TEXT REFERENCES admin_users(id),
      message TEXT NOT NULL,
      attachments TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Fund Transfers table
    `CREATE TABLE IF NOT EXISTS fund_transfers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      from_account_id TEXT NOT NULL REFERENCES trading_accounts(id),
      to_account_id TEXT NOT NULL REFERENCES trading_accounts(id),
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'Pending',
      notes TEXT,
      processed_by TEXT REFERENCES admin_users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP
    )`,

    // IB CB Wallets table
    `CREATE TABLE IF NOT EXISTS ib_cb_wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      wallet_type TEXT NOT NULL,
      balance TEXT DEFAULT '0',
      currency TEXT DEFAULT 'USD',
      commission_rate TEXT DEFAULT '0',
      total_commission TEXT DEFAULT '0',
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // Stripe Payments table
    `CREATE TABLE IF NOT EXISTS stripe_payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      deposit_id TEXT REFERENCES deposits(id),
      stripe_payment_intent_id TEXT NOT NULL UNIQUE,
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL,
      metadata TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    )`,
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (error: any) {
      // Ignore "already exists" errors
      if (error?.code !== '42P07' && !error?.message?.includes('already exists')) {
        console.error('Error creating table:', error);
        throw error;
      }
    }
  }

  console.log('✅ All PostgreSQL tables created successfully');
}

