import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
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
  referredBy: text("referred_by"), // ID of the user who referred this user
  referralStatus: text("referral_status").default("Pending"), // "Pending", "Accepted", "Rejected" - Status of referral approval
  verified: integer("verified", { mode: "boolean" }).default(false),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
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
export const tradingAccounts = sqliteTable("trading_accounts", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(), // "Live", "Demo", "Bonus"
  group: text("group").notNull(), // "Standard", "Pro", "VIP", "Startup", "Student"
  leverage: text("leverage").notNull(), // "1:100", "1:200", "1:500"
  balance: text("balance").default("0"),
  equity: text("equity").default("0"),
  margin: text("margin").default("0"),
  freeMargin: text("free_margin").default("0"),
  marginLevel: text("margin_level").default("0"),
  currency: text("currency").default("USD"),
  server: text("server").default("Mekness-Live"),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertTradingAccountSchema = createInsertSchema(tradingAccounts).omit({
  id: true,
  createdAt: true,
});

export type InsertTradingAccount = z.infer<typeof insertTradingAccountSchema>;
export type TradingAccount = typeof tradingAccounts.$inferSelect;

// Deposits table
export const deposits = sqliteTable("deposits", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().references(() => tradingAccounts.id),
  merchant: text("merchant").notNull(), // "Stripe", "PayPal", "Bank Transfer"
  amount: text("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("Pending"), // "Pending", "Completed", "Failed"
  transactionId: text("transaction_id"),
  verificationFile: text("verification_file"), // URL to uploaded verification file
  depositDate: integer("deposit_date", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// Withdrawals table
export const withdrawals = sqliteTable("withdrawals", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().references(() => tradingAccounts.id),
  method: text("method").notNull(), // "Bank Transfer", "PayPal", "Crypto"
  amount: text("amount").notNull(),
  currency: text("currency").default("USD"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountHolderName: text("account_holder_name"),
  swiftCode: text("swift_code"),
  status: text("status").notNull().default("Pending"), // "Pending", "Processing", "Completed", "Rejected"
  rejectionReason: text("rejection_reason"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  processedAt: integer("processed_at", { mode: "timestamp_ms" }),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;

// Trading History table
export const tradingHistory = sqliteTable("trading_history", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().references(() => tradingAccounts.id),
  ticketId: text("ticket_id").notNull(),
  symbol: text("symbol").notNull(), // "EUR/USD", "GBP/USD", etc.
  type: text("type").notNull(), // "Buy", "Sell"
  volume: text("volume").notNull(),
  openPrice: text("open_price").notNull(),
  closePrice: text("close_price"),
  stopLoss: text("stop_loss"),
  takeProfit: text("take_profit"),
  profit: text("profit"),
  commission: text("commission").default("0"),
  swap: text("swap").default("0"),
  status: text("status").notNull(), // "Open", "Closed"
  openTime: integer("open_time", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  closeTime: integer("close_time", { mode: "timestamp_ms" }),
});

export const insertTradingHistorySchema = createInsertSchema(tradingHistory).omit({
  id: true,
});

export type InsertTradingHistory = z.infer<typeof insertTradingHistorySchema>;
export type TradingHistory = typeof tradingHistory.$inferSelect;

// Documents table
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "ID Proof", "Address Proof", "Bank Statement"
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("Pending"), // "Pending", "Verified", "Rejected"
  rejectionReason: text("rejection_reason"),
  approvedBy: text("approved_by"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  verifiedAt: integer("verified_at", { mode: "timestamp_ms" }),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  verifiedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "info", "success", "warning", "error"
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Admin Users table
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // "super_admin", "middle_admin", "normal_admin"
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  createdBy: text("created_by"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Admin Country Assignments (for middle admins)
export const adminCountryAssignments = sqliteTable("admin_country_assignments", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  adminId: text("admin_id").notNull().references(() => adminUsers.id),
  country: text("country").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertAdminCountryAssignmentSchema = createInsertSchema(adminCountryAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminCountryAssignment = z.infer<typeof insertAdminCountryAssignmentSchema>;
export type AdminCountryAssignment = typeof adminCountryAssignments.$inferSelect;

// Activity Logs (immutable)
export const activityLogs = sqliteTable("activity_logs", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  adminId: text("admin_id").references(() => adminUsers.id),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // "created_user", "disabled_account", "approved_document", etc.
  entity: text("entity").notNull(), // "user", "trading_account", "document", etc.
  entityId: text("entity_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Support Tickets table
export const supportTickets = sqliteTable("support_tickets", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => users.id),
  adminId: text("admin_id").references(() => adminUsers.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("Open"), // "Open", "In Progress", "Resolved", "Closed"
  priority: text("priority").default("Medium"), // "Low", "Medium", "High", "Urgent"
  category: text("category"), // "Technical", "Account", "Payment", "Trading", "Other"
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
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
export const supportTicketReplies = sqliteTable("support_ticket_replies", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ticketId: text("ticket_id").notNull().references(() => supportTickets.id),
  userId: text("user_id").references(() => users.id),
  adminId: text("admin_id").references(() => adminUsers.id),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertSupportTicketReplySchema = createInsertSchema(supportTicketReplies).omit({
  id: true,
  createdAt: true,
});

export type InsertSupportTicketReply = z.infer<typeof insertSupportTicketReplySchema>;
export type SupportTicketReply = typeof supportTicketReplies.$inferSelect;

// Fund Transfers table
export const fundTransfers = sqliteTable("fund_transfers", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  fromAccountId: text("from_account_id").notNull().references(() => tradingAccounts.id),
  toAccountId: text("to_account_id").notNull().references(() => tradingAccounts.id),
  amount: text("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("Pending"), // "Pending", "Completed", "Failed"
  notes: text("notes"),
  processedBy: text("processed_by").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  processedAt: integer("processed_at", { mode: "timestamp_ms" }),
});

export const insertFundTransferSchema = createInsertSchema(fundTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type InsertFundTransfer = z.infer<typeof insertFundTransferSchema>;
export type FundTransfer = typeof fundTransfers.$inferSelect;

// IB CB Wallets table (Introducing Broker / Corporate Broker Wallets)
export const ibCbWallets = sqliteTable("ib_cb_wallets", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  walletType: text("wallet_type").notNull(), // "IB" (Introducing Broker), "CB" (Corporate Broker)
  balance: text("balance").default("0"),
  currency: text("currency").default("USD"),
  commissionRate: text("commission_rate").default("0"),
  totalCommission: text("total_commission").default("0"),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const insertIbCbWalletSchema = createInsertSchema(ibCbWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIbCbWallet = z.infer<typeof insertIbCbWalletSchema>;
export type IbCbWallet = typeof ibCbWallets.$inferSelect;

// Stripe Payment Intents (for tracking Stripe payments)
export const stripePayments = sqliteTable("stripe_payments", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  depositId: text("deposit_id").references(() => deposits.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  amount: text("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // "pending", "succeeded", "failed", "canceled"
  metadata: text("metadata"), // JSON object with additional data
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});

export const insertStripePaymentSchema = createInsertSchema(stripePayments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertStripePayment = z.infer<typeof insertStripePaymentSchema>;
export type StripePayment = typeof stripePayments.$inferSelect;
