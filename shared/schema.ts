import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  country: text("country"),
  city: text("city"),
  address: text("address"),
  zipCode: text("zip_code"),
  referralId: text("referral_id").unique(), // Unique referral ID for each user
  verified: boolean("verified").default(false),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  country: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trading Accounts table
export const tradingAccounts = pgTable("trading_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(), // "Live", "Demo", "Bonus"
  group: text("group").notNull(), // "Standard", "Pro", "VIP", "Startup", "Student"
  leverage: text("leverage").notNull(), // "1:100", "1:200", "1:500"
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  equity: decimal("equity", { precision: 12, scale: 2 }).default("0"),
  margin: decimal("margin", { precision: 12, scale: 2 }).default("0"),
  freeMargin: decimal("free_margin", { precision: 12, scale: 2 }).default("0"),
  marginLevel: decimal("margin_level", { precision: 5, scale: 2 }).default("0"),
  currency: text("currency").default("USD"),
  server: text("server").default("Mekness-Live"),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradingAccountSchema = createInsertSchema(tradingAccounts).omit({
  id: true,
  createdAt: true,
});

export type InsertTradingAccount = z.infer<typeof insertTradingAccountSchema>;
export type TradingAccount = typeof tradingAccounts.$inferSelect;

// Deposits table
export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull().references(() => tradingAccounts.id),
  merchant: text("merchant").notNull(), // "Stripe", "PayPal", "Bank Transfer"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("Pending"), // "Pending", "Completed", "Failed"
  transactionId: text("transaction_id"),
  verificationFile: text("verification_file"), // URL to uploaded verification file
  depositDate: timestamp("deposit_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull().references(() => tradingAccounts.id),
  method: text("method").notNull(), // "Bank Transfer", "PayPal", "Crypto"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountHolderName: text("account_holder_name"),
  swiftCode: text("swift_code"),
  status: text("status").notNull().default("Pending"), // "Pending", "Processing", "Completed", "Rejected"
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;

// Trading History table
export const tradingHistory = pgTable("trading_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull().references(() => tradingAccounts.id),
  ticketId: text("ticket_id").notNull(),
  symbol: text("symbol").notNull(), // "EUR/USD", "GBP/USD", etc.
  type: text("type").notNull(), // "Buy", "Sell"
  volume: decimal("volume", { precision: 10, scale: 2 }).notNull(),
  openPrice: decimal("open_price", { precision: 10, scale: 5 }).notNull(),
  closePrice: decimal("close_price", { precision: 10, scale: 5 }),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 5 }),
  profit: decimal("profit", { precision: 12, scale: 2 }),
  commission: decimal("commission", { precision: 12, scale: 2 }).default("0"),
  swap: decimal("swap", { precision: 12, scale: 2 }).default("0"),
  status: text("status").notNull(), // "Open", "Closed"
  openTime: timestamp("open_time").defaultNow(),
  closeTime: timestamp("close_time"),
});

export const insertTradingHistorySchema = createInsertSchema(tradingHistory).omit({
  id: true,
});

export type InsertTradingHistory = z.infer<typeof insertTradingHistorySchema>;
export type TradingHistory = typeof tradingHistory.$inferSelect;

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "ID Proof", "Address Proof", "Bank Statement"
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("Pending"), // "Pending", "Verified", "Rejected"
  rejectionReason: text("rejection_reason"),
  approvedBy: varchar("approved_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  verifiedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "info", "success", "warning", "error"
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Admin Users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // "super_admin", "middle_admin", "normal_admin"
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Admin Country Assignments (for middle admins)
export const adminCountryAssignments = pgTable("admin_country_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => adminUsers.id),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminCountryAssignmentSchema = createInsertSchema(adminCountryAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminCountryAssignment = z.infer<typeof insertAdminCountryAssignmentSchema>;
export type AdminCountryAssignment = typeof adminCountryAssignments.$inferSelect;

// Activity Logs (immutable)
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => adminUsers.id),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // "created_user", "disabled_account", "approved_document", etc.
  entity: text("entity").notNull(), // "user", "trading_account", "document", etc.
  entityId: varchar("entity_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Support Tickets table
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  adminId: varchar("admin_id").references(() => adminUsers.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("Open"), // "Open", "In Progress", "Resolved", "Closed"
  priority: text("priority").default("Medium"), // "Low", "Medium", "High", "Urgent"
  category: text("category"), // "Technical", "Account", "Payment", "Trading", "Other"
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

// Support Ticket Replies
export const supportTicketReplies = pgTable("support_ticket_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => supportTickets.id),
  userId: varchar("user_id").references(() => users.id),
  adminId: varchar("admin_id").references(() => adminUsers.id),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupportTicketReplySchema = createInsertSchema(supportTicketReplies).omit({
  id: true,
  createdAt: true,
});

export type InsertSupportTicketReply = z.infer<typeof insertSupportTicketReplySchema>;
export type SupportTicketReply = typeof supportTicketReplies.$inferSelect;

// Fund Transfers table
export const fundTransfers = pgTable("fund_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromAccountId: varchar("from_account_id").notNull().references(() => tradingAccounts.id),
  toAccountId: varchar("to_account_id").notNull().references(() => tradingAccounts.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("Pending"), // "Pending", "Completed", "Failed"
  notes: text("notes"),
  processedBy: varchar("processed_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const insertFundTransferSchema = createInsertSchema(fundTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertFundTransfer = z.infer<typeof insertFundTransferSchema>;
export type FundTransfer = typeof fundTransfers.$inferSelect;

// IB CB Wallets table (Introducing Broker / Corporate Broker Wallets)
export const ibCbWallets = pgTable("ib_cb_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  walletType: text("wallet_type").notNull(), // "IB" (Introducing Broker), "CB" (Corporate Broker)
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  currency: text("currency").default("USD"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0"),
  totalCommission: decimal("total_commission", { precision: 12, scale: 2 }).default("0"),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIbCbWalletSchema = createInsertSchema(ibCbWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIbCbWallet = z.infer<typeof insertIbCbWalletSchema>;
export type IbCbWallet = typeof ibCbWallets.$inferSelect;

// Stripe Payment Intents (for tracking Stripe payments)
export const stripePayments = pgTable("stripe_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  depositId: varchar("deposit_id").references(() => deposits.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // "pending", "succeeded", "failed", "canceled"
  metadata: text("metadata"), // JSON object with additional data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertStripePaymentSchema = createInsertSchema(stripePayments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertStripePayment = z.infer<typeof insertStripePaymentSchema>;
export type StripePayment = typeof stripePayments.$inferSelect;
