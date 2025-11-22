import { getDb } from "./db";
import { 
  users, tradingAccounts, deposits, withdrawals, tradingHistory, 
  documents, notifications, adminUsers, adminCountryAssignments, 
  activityLogs, supportTickets, supportTicketReplies, fundTransfers,
  ibCbWallets, stripePayments,
  type User, type InsertUser,
  type TradingAccount, type InsertTradingAccount,
  type Deposit, type InsertDeposit,
  type Withdrawal, type InsertWithdrawal,
  type TradingHistory, type InsertTradingHistory,
  type Document, type InsertDocument,
  type Notification, type InsertNotification,
  type AdminUser, type InsertAdminUser,
  type AdminCountryAssignment, type InsertAdminCountryAssignment,
  type ActivityLog, type InsertActivityLog,
  type SupportTicket, type InsertSupportTicket,
  type SupportTicketReply, type InsertSupportTicketReply,
  type FundTransfer, type InsertFundTransfer,
  type IbCbWallet, type InsertIbCbWallet,
  type StripePayment, type InsertStripePayment
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import type { IStorage } from "./storage";
import bcrypt from "bcryptjs";

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = await getDb();
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDb();
    return await db.select().from(users);
  }

  async getUsersByCountry(country: string): Promise<User[]> {
    const db = await getDb();
    return await db.select().from(users).where(eq(users.country, country));
  }

  // Trading Accounts
  async getTradingAccounts(userId: string): Promise<TradingAccount[]> {
    const db = await getDb();
    return await db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, userId));
  }

  async getTradingAccount(id: string): Promise<TradingAccount | undefined> {
    const db = await getDb();
    const result = await db.select().from(tradingAccounts).where(eq(tradingAccounts.id, id)).limit(1);
    return result[0];
  }

  async createTradingAccount(account: InsertTradingAccount): Promise<TradingAccount> {
    const db = await getDb();
    const result = await db.insert(tradingAccounts).values(account).returning();
    return result[0];
  }

  async updateTradingAccount(id: string, updates: Partial<TradingAccount>): Promise<TradingAccount | undefined> {
    const db = await getDb();
    const result = await db.update(tradingAccounts).set(updates).where(eq(tradingAccounts.id, id)).returning();
    return result[0];
  }

  async getAllTradingAccounts(): Promise<TradingAccount[]> {
    const db = await getDb();
    return await db.select().from(tradingAccounts);
  }

  // Deposits
  async getDeposits(userId: string): Promise<Deposit[]> {
    const db = await getDb();
    return await db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
  }

  async getDeposit(id: string): Promise<Deposit | undefined> {
    const db = await getDb();
    const result = await db.select().from(deposits).where(eq(deposits.id, id)).limit(1);
    return result[0];
  }

  async getDepositByTransactionId(transactionId: string): Promise<Deposit | undefined> {
    const db = await getDb();
    const result = await db.select().from(deposits).where(eq(deposits.transactionId, transactionId)).limit(1);
    return result[0];
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const db = await getDb();
    const result = await db.insert(deposits).values(deposit).returning();
    return result[0];
  }

  async updateDeposit(id: string, updates: Partial<Deposit>): Promise<Deposit | undefined> {
    const db = await getDb();
    const result = await db.update(deposits).set(updates).where(eq(deposits.id, id)).returning();
    return result[0];
  }

  async updateDepositStatus(id: string, status: string): Promise<Deposit | undefined> {
    const db = await getDb();
    const result = await db.update(deposits).set({ status }).where(eq(deposits.id, id)).returning();
    return result[0];
  }

  async getAllDeposits(): Promise<Deposit[]> {
    const db = await getDb();
    return await db.select().from(deposits).orderBy(desc(deposits.createdAt));
  }

  // Stripe Payments
  async createStripePayment(payment: InsertStripePayment): Promise<StripePayment> {
    const db = await getDb();
    const result = await db.insert(stripePayments).values(payment).returning();
    return result[0];
  }

  async getStripePayment(id: string): Promise<StripePayment | undefined> {
    const db = await getDb();
    const result = await db.select().from(stripePayments).where(eq(stripePayments.id, id)).limit(1);
    return result[0];
  }

  async getStripePaymentByIntentId(paymentIntentId: string): Promise<StripePayment | undefined> {
    const db = await getDb();
    const result = await db.select().from(stripePayments).where(eq(stripePayments.stripePaymentIntentId, paymentIntentId)).limit(1);
    return result[0];
  }

  async updateStripePaymentStatus(id: string, status: string): Promise<StripePayment | undefined> {
    const db = await getDb();
    const result = await db.update(stripePayments).set({ status }).where(eq(stripePayments.id, id)).returning();
    return result[0];
  }

  // Withdrawals
  async getWithdrawals(userId: string): Promise<Withdrawal[]> {
    const db = await getDb();
    return await db.select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
  }

  async getWithdrawal(id: string): Promise<Withdrawal | undefined> {
    const db = await getDb();
    const result = await db.select().from(withdrawals).where(eq(withdrawals.id, id)).limit(1);
    return result[0];
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const db = await getDb();
    const result = await db.insert(withdrawals).values(withdrawal).returning();
    return result[0];
  }

  async updateWithdrawal(id: string, updates: Partial<Withdrawal>): Promise<Withdrawal | undefined> {
    const db = await getDb();
    const result = await db.update(withdrawals).set(updates).where(eq(withdrawals.id, id)).returning();
    return result[0];
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    const db = await getDb();
    return await db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  }

  // Trading History
  async getTradingHistory(userId: string, accountId?: string): Promise<TradingHistory[]> {
    const db = await getDb();
    if (accountId) {
      return await db.select().from(tradingHistory)
        .where(and(eq(tradingHistory.userId, userId), eq(tradingHistory.accountId, accountId)))
        .orderBy(desc(tradingHistory.openTime));
    }
    return await db.select().from(tradingHistory).where(eq(tradingHistory.userId, userId)).orderBy(desc(tradingHistory.openTime));
  }

  async createTradingHistory(history: InsertTradingHistory): Promise<TradingHistory> {
    const db = await getDb();
    const result = await db.insert(tradingHistory).values(history).returning();
    return result[0];
  }

  async getAllTradingHistory(): Promise<TradingHistory[]> {
    const db = await getDb();
    return await db.select().from(tradingHistory).orderBy(desc(tradingHistory.openTime));
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    const db = await getDb();
    return await db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.uploadedAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const db = await getDb();
    const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
    return result[0];
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const db = await getDb();
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const db = await getDb();
    const result = await db.update(documents).set(updates).where(eq(documents.id, id)).returning();
    return result[0];
  }

  async getAllDocuments(): Promise<Document[]> {
    const db = await getDb();
    return await db.select().from(documents).orderBy(desc(documents.uploadedAt));
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const db = await getDb();
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const db = await getDb();
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const db = await getDb();
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  }

  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return result[0];
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    return result[0];
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    return result[0];
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return result[0];
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return result[0];
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const db = await getDb();
    const result = await db.insert(adminUsers).values(admin).returning();
    return result[0];
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id)).returning();
    return result[0];
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    const db = await getDb();
    return await db.select().from(adminUsers);
  }

  // Admin Country Assignments
  async getAdminCountryAssignments(adminId: string): Promise<AdminCountryAssignment[]> {
    const db = await getDb();
    return await db.select().from(adminCountryAssignments).where(eq(adminCountryAssignments.adminId, adminId));
  }

  async createAdminCountryAssignment(assignment: InsertAdminCountryAssignment): Promise<AdminCountryAssignment> {
    const db = await getDb();
    const result = await db.insert(adminCountryAssignments).values(assignment).returning();
    return result[0];
  }

  async deleteAdminCountryAssignment(adminId: string, country: string): Promise<void> {
    const db = await getDb();
    await db.delete(adminCountryAssignments)
      .where(and(eq(adminCountryAssignments.adminId, adminId), eq(adminCountryAssignments.country, country)));
  }

  // Activity Logs
  async getActivityLogs(adminId?: string): Promise<ActivityLog[]> {
    const db = await getDb();
    if (adminId) {
      return await db.select().from(activityLogs).where(eq(activityLogs.adminId, adminId)).orderBy(desc(activityLogs.createdAt));
    }
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const db = await getDb();
    const result = await db.insert(activityLogs).values(log).returning();
    return result[0];
  }

  // Support Tickets
  async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    const db = await getDb();
    if (userId) {
      return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
    }
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const db = await getDb();
    const result = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    return result[0];
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const db = await getDb();
    const result = await db.insert(supportTickets).values(ticket).returning();
    return result[0];
  }

  async updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined> {
    const db = await getDb();
    const now = new Date();
    const result = await db.update(supportTickets)
      .set({ 
        status, 
        updatedAt: now,
        resolvedAt: status === "Resolved" || status === "Closed" ? now : undefined
      })
      .where(eq(supportTickets.id, id))
      .returning();
    return result[0];
  }

  async getSupportTicketReplies(ticketId: string): Promise<SupportTicketReply[]> {
    const db = await getDb();
    return await db.select().from(supportTicketReplies).where(eq(supportTicketReplies.ticketId, ticketId)).orderBy(supportTicketReplies.createdAt);
  }

  async createSupportTicketReply(reply: InsertSupportTicketReply): Promise<SupportTicketReply> {
    const db = await getDb();
    const result = await db.insert(supportTicketReplies).values(reply).returning();
    // Update ticket's updatedAt
    await db.update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, reply.ticketId));
    return result[0];
  }

  // Fund Transfers
  async getFundTransfers(userId?: string): Promise<FundTransfer[]> {
    const db = await getDb();
    if (userId) {
      return await db.select().from(fundTransfers).where(eq(fundTransfers.userId, userId)).orderBy(desc(fundTransfers.createdAt));
    }
    return await db.select().from(fundTransfers).orderBy(desc(fundTransfers.createdAt));
  }

  async createFundTransfer(transfer: InsertFundTransfer): Promise<FundTransfer> {
    const db = await getDb();
    const result = await db.insert(fundTransfers).values(transfer).returning();
    return result[0];
  }

  // IB/CB Wallets
  async getIBCBWallets(userId?: string): Promise<IbCbWallet[]> {
    const db = await getDb();
    if (userId) {
      return await db.select().from(ibCbWallets).where(eq(ibCbWallets.userId, userId)).orderBy(desc(ibCbWallets.createdAt));
    }
    return await db.select().from(ibCbWallets).orderBy(desc(ibCbWallets.createdAt));
  }

  async getIBCBWallet(id: string): Promise<IbCbWallet | undefined> {
    const db = await getDb();
    const result = await db.select().from(ibCbWallets).where(eq(ibCbWallets.id, id)).limit(1);
    return result[0];
  }

  async createIBCBWallet(wallet: InsertIbCbWallet): Promise<IbCbWallet> {
    const db = await getDb();
    const result = await db.insert(ibCbWallets).values(wallet).returning();
    return result[0];
  }

  async updateIBCBWallet(id: string, updates: Partial<IbCbWallet>): Promise<IbCbWallet | undefined> {
    const db = await getDb();
    const result = await db.update(ibCbWallets).set(updates).where(eq(ibCbWallets.id, id)).returning();
    return result[0];
  }

  // Activity Logs - Get all (for super admin)
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    const db = await getDb();
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  // Trading Accounts by User ID (for MT5)
  async getTradingAccountsByUserId(userId: string): Promise<TradingAccount[]> {
    const db = await getDb();
    return await db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, userId));
  }

  // Additional methods from IStorage interface
  async createTrade(trade: InsertTradingHistory): Promise<TradingHistory> {
    return this.createTradingHistory(trade);
  }

  async updateTrade(id: string, updates: Partial<TradingHistory>): Promise<TradingHistory | undefined> {
    const db = await getDb();
    const result = await db.update(tradingHistory).set(updates).where(eq(tradingHistory.id, id)).returning();
    return result[0];
  }

  async getPendingDocuments(): Promise<Document[]> {
    const db = await getDb();
    return await db.select().from(documents).where(eq(documents.status, "Pending")).orderBy(desc(documents.uploadedAt));
  }
}

