import { sql } from "drizzle-orm";
import { sqliteTable, text as sqliteText, integer } from "drizzle-orm/sqlite-core";
import { pgTable, text as pgText, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Detect database type from environment
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://') || 
                   process.env.DATABASE_URL?.startsWith('postgres://');

// Helper functions to use correct table builder and column types
const tableBuilder = isPostgres ? pgTable : sqliteTable;
const textCol = isPostgres ? pgText : sqliteText;

// Helper for boolean columns
const boolCol = (name: string, defaultValue: boolean = false) => {
  if (isPostgres) {
    return boolean(name).default(defaultValue);
  }
  return integer(name, { mode: "boolean" }).default(defaultValue);
};

// Helper for timestamp columns
const timestampCol = (name: string, withDefault: boolean = false) => {
  if (isPostgres) {
    return withDefault ? timestamp(name).defaultNow() : timestamp(name);
  }
  return integer(name, { mode: "timestamp_ms" }).$defaultFn(() => new Date());
};

// Users table
export const users = tableBuilder("users", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  username: textCol("username").notNull().unique(),
  password: textCol("password").notNull(),
  email: textCol("email").notNull().unique(),
  fullName: textCol("full_name"),
  phone: textCol("phone"),
  country: textCol("country"),
  city: textCol("city"),
  address: textCol("address"),
  zipCode: textCol("zip_code"),
  referralId: textCol("referral_id").unique(),
  referredBy: textCol("referred_by"),
  referralStatus: textCol("referral_status").default("Pending"),
  verified: boolCol("verified", false),
  enabled: boolCol("enabled", true),
  createdAt: timestampCol("created_at", true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  country: true,
  city: true,
  referralId: true,
  referredBy: true,
  referralStatus: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trading Accounts table
export const tradingAccounts = tableBuilder("trading_accounts", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  accountId: textCol("account_id").notNull().unique(),
  password: textCol("password").notNull(),
  type: textCol("type").notNull(),
  group: textCol("group").notNull(),
  leverage: textCol("leverage").notNull(),
  balance: textCol("balance").default("0"),
  equity: textCol("equity").default("0"),
  margin: textCol("margin").default("0"),
  freeMargin: textCol("free_margin").default("0"),
  marginLevel: textCol("margin_level").default("0"),
  currency: textCol("currency").default("USD"),
  server: textCol("server").default("Mekness-Live"),
  enabled: boolCol("enabled", true),
  createdAt: timestampCol("created_at", true),
});

export const insertTradingAccountSchema = createInsertSchema(tradingAccounts).omit({
  id: true,
  createdAt: true,
});

export type InsertTradingAccount = z.infer<typeof insertTradingAccountSchema>;
export type TradingAccount = typeof tradingAccounts.$inferSelect;

// Deposits table
export const deposits = tableBuilder("deposits", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  accountId: textCol("account_id").notNull().references(() => tradingAccounts.id),
  merchant: textCol("merchant").notNull(),
  amount: textCol("amount").notNull(),
  currency: textCol("currency").default("USD"),
  status: textCol("status").notNull().default("Pending"),
  transactionId: textCol("transaction_id"),
  verificationFile: textCol("verification_file"),
  depositDate: timestampCol("deposit_date", true),
  createdAt: timestampCol("created_at", true),
  completedAt: timestampCol("completed_at", false),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// Withdrawals table
export const withdrawals = tableBuilder("withdrawals", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  accountId: textCol("account_id").notNull().references(() => tradingAccounts.id),
  method: textCol("method").notNull(),
  amount: textCol("amount").notNull(),
  currency: textCol("currency").default("USD"),
  bankName: textCol("bank_name"),
  accountNumber: textCol("account_number"),
  accountHolderName: textCol("account_holder_name"),
  swiftCode: textCol("swift_code"),
  status: textCol("status").notNull().default("Pending"),
  rejectionReason: textCol("rejection_reason"),
  createdAt: timestampCol("created_at", true),
  processedAt: timestampCol("processed_at", false),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;

// Trading History table
export const tradingHistory = tableBuilder("trading_history", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  accountId: textCol("account_id").notNull().references(() => tradingAccounts.id),
  ticketId: textCol("ticket_id").notNull(),
  symbol: textCol("symbol").notNull(),
  type: textCol("type").notNull(),
  volume: textCol("volume").notNull(),
  openPrice: textCol("open_price").notNull(),
  closePrice: textCol("close_price"),
  stopLoss: textCol("stop_loss"),
  takeProfit: textCol("take_profit"),
  profit: textCol("profit"),
  commission: textCol("commission").default("0"),
  swap: textCol("swap").default("0"),
  status: textCol("status").notNull(),
  openTime: timestampCol("open_time", true),
  closeTime: timestampCol("close_time", false),
});

export const insertTradingHistorySchema = createInsertSchema(tradingHistory).omit({
  id: true,
});

export type InsertTradingHistory = z.infer<typeof insertTradingHistorySchema>;
export type TradingHistory = typeof tradingHistory.$inferSelect;

// Documents table
export const documents = tableBuilder("documents", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  type: textCol("type").notNull(),
  fileName: textCol("file_name").notNull(),
  fileUrl: textCol("file_url").notNull(),
  status: textCol("status").notNull().default("Pending"),
  rejectionReason: textCol("rejection_reason"),
  approvedBy: textCol("approved_by"),
  uploadedAt: timestampCol("uploaded_at", true),
  verifiedAt: timestampCol("verified_at", false),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  verifiedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Notifications table
export const notifications = tableBuilder("notifications", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  title: textCol("title").notNull(),
  message: textCol("message").notNull(),
  type: textCol("type").notNull(),
  read: boolCol("read", false),
  createdAt: timestampCol("created_at", true),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Admin Users table
export const adminUsers = tableBuilder("admin_users", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  username: textCol("username").notNull().unique(),
  password: textCol("password").notNull(),
  email: textCol("email").notNull().unique(),
  fullName: textCol("full_name").notNull(),
  role: textCol("role").notNull(),
  enabled: boolCol("enabled", true),
  createdAt: timestampCol("created_at", true),
  createdBy: textCol("created_by"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Admin Country Assignments (for middle admins)
export const adminCountryAssignments = tableBuilder("admin_country_assignments", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  adminId: textCol("admin_id").notNull().references(() => adminUsers.id),
  country: textCol("country").notNull(),
  createdAt: timestampCol("created_at", true),
});

export const insertAdminCountryAssignmentSchema = createInsertSchema(adminCountryAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminCountryAssignment = z.infer<typeof insertAdminCountryAssignmentSchema>;
export type AdminCountryAssignment = typeof adminCountryAssignments.$inferSelect;

// Activity Logs (immutable)
export const activityLogs = tableBuilder("activity_logs", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  adminId: textCol("admin_id").references(() => adminUsers.id),
  userId: textCol("user_id").references(() => users.id),
  action: textCol("action").notNull(),
  entity: textCol("entity").notNull(),
  entityId: textCol("entity_id"),
  details: textCol("details"),
  ipAddress: textCol("ip_address"),
  createdAt: timestampCol("created_at", true),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Support Tickets table
export const supportTickets = tableBuilder("support_tickets", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").references(() => users.id),
  adminId: textCol("admin_id").references(() => adminUsers.id),
  subject: textCol("subject").notNull(),
  message: textCol("message").notNull(),
  status: textCol("status").notNull().default("Open"),
  priority: textCol("priority").default("Medium"),
  category: textCol("category"),
  attachments: textCol("attachments"),
  createdAt: timestampCol("created_at", true),
  updatedAt: timestampCol("updated_at", true),
  resolvedAt: timestampCol("resolved_at", false),
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
export const supportTicketReplies = tableBuilder("support_ticket_replies", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  ticketId: textCol("ticket_id").notNull().references(() => supportTickets.id),
  userId: textCol("user_id").references(() => users.id),
  adminId: textCol("admin_id").references(() => adminUsers.id),
  message: textCol("message").notNull(),
  attachments: textCol("attachments"),
  createdAt: timestampCol("created_at", true),
});

export const insertSupportTicketReplySchema = createInsertSchema(supportTicketReplies).omit({
  id: true,
  createdAt: true,
});

export type InsertSupportTicketReply = z.infer<typeof insertSupportTicketReplySchema>;
export type SupportTicketReply = typeof supportTicketReplies.$inferSelect;

// Fund Transfers table
export const fundTransfers = tableBuilder("fund_transfers", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  fromAccountId: textCol("from_account_id").notNull().references(() => tradingAccounts.id),
  toAccountId: textCol("to_account_id").notNull().references(() => tradingAccounts.id),
  amount: textCol("amount").notNull(),
  currency: textCol("currency").default("USD"),
  status: textCol("status").notNull().default("Pending"),
  notes: textCol("notes"),
  processedBy: textCol("processed_by").references(() => adminUsers.id),
  createdAt: timestampCol("created_at", true),
  processedAt: timestampCol("processed_at", false),
});

export const insertFundTransferSchema = createInsertSchema(fundTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertFundTransfer = z.infer<typeof insertFundTransferSchema>;
export type FundTransfer = typeof fundTransfers.$inferSelect;

// IB CB Wallets table (Introducing Broker / Corporate Broker Wallets)
export const ibCbWallets = tableBuilder("ib_cb_wallets", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  walletType: textCol("wallet_type").notNull(),
  balance: textCol("balance").default("0"),
  currency: textCol("currency").default("USD"),
  commissionRate: textCol("commission_rate").default("0"),
  totalCommission: textCol("total_commission").default("0"),
  enabled: boolCol("enabled", true),
  createdAt: timestampCol("created_at", true),
  updatedAt: timestampCol("updated_at", true),
});

export const insertIbCbWalletSchema = createInsertSchema(ibCbWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIbCbWallet = z.infer<typeof insertIbCbWalletSchema>;
export type IbCbWallet = typeof ibCbWallets.$inferSelect;

// Stripe Payment Intents (for tracking Stripe payments)
export const stripePayments = tableBuilder("stripe_payments", {
  id: textCol("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: textCol("user_id").notNull().references(() => users.id),
  depositId: textCol("deposit_id").references(() => deposits.id),
  stripePaymentIntentId: textCol("stripe_payment_intent_id").notNull().unique(),
  amount: textCol("amount").notNull(),
  currency: textCol("currency").default("USD"),
  status: textCol("status").notNull(),
  metadata: textCol("metadata"),
  createdAt: timestampCol("created_at", true),
  completedAt: timestampCol("completed_at", false),
});

export const insertStripePaymentSchema = createInsertSchema(stripePayments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertStripePayment = z.infer<typeof insertStripePaymentSchema>;
export type StripePayment = typeof stripePayments.$inferSelect;
