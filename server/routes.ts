import type { Express } from "express";
import { storage } from "./storage";
import { insertDepositSchema, insertWithdrawalSchema, insertDocumentSchema, insertTradingAccountSchema, insertUserSchema, insertAdminUserSchema, insertAdminCountryAssignmentSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { registerMT5Routes } from "./mt5-routes";
import { mt5Service } from "./mt5-service";

// Fatoorah API Configuration
const FATOORAH_API_KEY = process.env.FATOORAH_API_KEY || "";
const FATOORAH_BASE_URL = process.env.FATOORAH_BASE_URL || "https://apitest.myfatoorah.com"; // Use https://api.myfatoorah.com for production

// Initialize Fatoorah API client
const fatoorahHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${FATOORAH_API_KEY}`,
};

if (FATOORAH_API_KEY) {
  console.log("✓ Fatoorah initialized successfully");
} else {
  console.warn("⚠ Fatoorah not configured - payment features will be disabled");
}

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId?: string;
    adminId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<void> {
  // Register MT5 routes first
  registerMT5Routes(app);

  // Middleware to get authenticated user
  const getCurrentUserId = (req: any): string | undefined => {
    return req.session?.userId;
  };

  // Admin helper functions
  const getCurrentAdminId = (req: any): string | undefined => {
    return req.session?.adminId;
  };

  const requireAdmin = async (req: any, res: any): Promise<boolean> => {
    const adminId = getCurrentAdminId(req);
    if (!adminId) {
      res.status(401).json({ message: "Admin authentication required" });
      return false;
    }
    const admin = await storage.getAdminUser(adminId);
    if (!admin || !admin.enabled) {
      res.status(401).json({ message: "Admin authentication required" });
      return false;
    }
    return true;
  };

  const requireSuperAdmin = async (req: any, res: any): Promise<boolean> => {
    const adminId = getCurrentAdminId(req);
    if (!adminId) {
      res.status(401).json({ message: "Super admin access required" });
      return false;
    }
    const admin = await storage.getAdminUser(adminId);
    if (!admin || !admin.enabled || admin.role !== "super_admin") {
      res.status(403).json({ message: "Super admin access required" });
      return false;
    }
    return true;
  };

  const logActivity = async (
    adminId: string,
    action: string,
    entity: string,
    entityId: string,
    details?: string
  ) => {
    try {
      await storage.createActivityLog({
        adminId,
        action,
        entity,
        entityId,
        details,
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  // Authentication endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName, phone, country, city, ref } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (!phone || !country || !city) {
        return res.status(400).json({ message: "Phone number, country, and city are required" });
      }

      // Ensure database is ready
      const { ensureDbReady } = await import("./db.js");
      await ensureDbReady();

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create username from email
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000);

      // Generate unique referral ID for the new user
      const referralId = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

      // Find referrer if ref parameter is provided
      let referrerId = null;
      if (ref) {
        const referrer = await storage.getAllUsers().then(users => 
          users.find(u => u.referralId === ref)
        );
        if (referrer) {
          referrerId = referrer.id;
        }
      }

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        fullName: fullName || username, // Use username as fallback if fullName not provided
        phone: phone || null,
        country: country || null,
        city: city || null,
        referralId, // User's own referral ID
        referredBy: referrerId || null, // ID of the user who referred them
        referralStatus: referrerId ? "Pending" : null, // Set to Pending if referred, null if not
      });

      // Set session
      req.session.userId = user.id;
      req.session.save();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error?.message || "Failed to create account";
      console.error("Full error details:", {
        message: errorMessage,
        stack: error?.stack,
        code: error?.code,
        detail: error?.detail,
      });
      res.status(500).json({ 
        message: errorMessage.includes("relation") || errorMessage.includes("table") || errorMessage.includes("does not exist")
          ? "Database tables not initialized. Please run migrations: npm run db:push"
          : errorMessage
      });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.save();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Check authentication status (returns user data directly)
  app.get("/api/auth/check", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Trading Accounts
  app.get("/api/trading-accounts", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accounts = await storage.getTradingAccounts(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading accounts" });
    }
  });

  app.post("/api/trading-accounts", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate account ID and password
      const accountId = Math.floor(Math.random() * 90000000) + 10000000;
      const password = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const type = req.body.type || "Demo";
      const group = req.body.group || "Standard";
      const leverage = req.body.leverage || "1:100";

      // Try to create account in MT5 (only for Live accounts)
      let mt5Account = null;
      if (type === "Live" && process.env.MT5_ENABLED === "true") {
        try {
          mt5Account = await mt5Service.createAccount({
            login: accountId.toString(),
            name: user.fullName || user.username,
            email: user.email,
            group: `Mekness-${group}`,
            leverage: parseInt(leverage.split(":")[1]),
            password,
          });
          console.log("MT5 account created successfully:", mt5Account);
        } catch (mt5Error) {
          console.error("MT5 account creation failed (continuing with local account):", mt5Error);
          // Continue even if MT5 fails - create local account anyway
        }
      }
      
      const validatedData = insertTradingAccountSchema.parse({
        userId,
        type,
        group,
        leverage,
        accountId: accountId.toString(),
        password,
        balance: mt5Account ? mt5Account.balance.toString() : "0",
        equity: mt5Account ? mt5Account.equity.toString() : "0",
        margin: mt5Account ? mt5Account.margin.toString() : "0",
        freeMargin: mt5Account ? mt5Account.freeMargin.toString() : "0",
        marginLevel: mt5Account ? mt5Account.marginLevel.toString() : "0",
        currency: "USD",
        server: "MeknessLimited-Live",
      });
      
      const account = await storage.createTradingAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      console.error("Trading account creation error:", error);
      res.status(400).json({ message: "Failed to create trading account" });
    }
  });

  app.patch("/api/trading-accounts/:id", async (req, res) => {
    try {
      const updated = await storage.updateTradingAccount(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update account" });
    }
  });

  // Fatoorah - Create payment invoice
  app.post("/api/fatoorah/create-invoice", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, tradingAccountId, paymentMethod } = req.body;

      if (!amount || amount < 10) {
        return res.status(400).json({ message: "Minimum deposit is $10" });
      }

      if (!FATOORAH_API_KEY) {
        return res.status(500).json({ message: "Fatoorah is not configured" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create deposit record first
      const deposit = await storage.createDeposit({
        userId,
        accountId: tradingAccountId,
        merchant: paymentMethod === "crypto" ? "Fatoorah Crypto" : "Fatoorah",
        amount: amount.toString(),
        status: "Pending",
        transactionId: "", // Will be updated after invoice creation
      });

      // Create Fatoorah invoice
      const invoiceData = {
        InvoiceAmount: amount,
        CurrencyIso: "USD",
        CustomerName: user.fullName || user.username || user.email,
        CustomerEmail: user.email,
        CustomerMobile: user.phone || "",
        CallBackUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/deposit?success=true&depositId=${deposit.id}`,
        ErrorUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/deposit?error=true&depositId=${deposit.id}`,
        Language: "en",
        DisplayCurrencyIso: "USD",
        InvoiceItems: [
          {
            ItemName: "Trading Account Deposit",
            Quantity: 1,
            UnitPrice: amount,
          },
        ],
        CustomerReference: deposit.id,
        CustomerAddress: {
          AddressLine: user.address || "",
          City: user.city || "",
          Country: user.country || "",
        },
      };

      const fatoorahResponse = await fetch(`${FATOORAH_BASE_URL}/v2/SendPayment`, {
        method: "POST",
        headers: fatoorahHeaders,
        body: JSON.stringify(invoiceData),
      });

      if (!fatoorahResponse.ok) {
        const errorData = await fatoorahResponse.json();
        console.error("Fatoorah invoice creation error:", errorData);
        await storage.updateDepositStatus(deposit.id, "Rejected");
        return res.status(500).json({ 
          message: errorData.Message || "Failed to create payment invoice" 
        });
      }

      const fatoorahData = await fatoorahResponse.json();
      
      if (fatoorahData.IsSuccess === false) {
        console.error("Fatoorah error:", fatoorahData);
        await storage.updateDepositStatus(deposit.id, "Rejected");
        return res.status(500).json({ 
          message: fatoorahData.Message || "Failed to create payment invoice" 
        });
      }

      // Update deposit with invoice ID
      const invoiceId = fatoorahData.Data.InvoiceId;
      const invoiceURL = fatoorahData.Data.InvoiceURL;
      
      await storage.updateDeposit(deposit.id, {
        transactionId: invoiceId.toString(),
      });

      // Store Fatoorah payment in database (reusing stripe_payments table structure)
      await storage.createStripePayment({
        userId,
        depositId: deposit.id,
        stripePaymentIntentId: invoiceId.toString(),
        amount: amount.toString(),
        currency: "USD",
        status: "pending",
        metadata: JSON.stringify({
          invoiceId,
          paymentMethod,
          tradingAccountId,
        }),
      });

      res.json({
        invoiceId,
        invoiceURL,
        depositId: deposit.id,
      });
    } catch (error: any) {
      console.error("Fatoorah invoice creation error:", error);
      res.status(500).json({ message: error.message || "Failed to create payment invoice" });
    }
  });

  // Fatoorah Webhook - Handle payment confirmations
  app.post("/api/fatoorah/webhook", async (req, res) => {
    try {
      const { InvoiceId, InvoiceStatus, InvoiceValue, CustomerReference } = req.body;

      if (!InvoiceId) {
        return res.status(400).json({ message: "Missing InvoiceId" });
      }

      // Find deposit by invoice ID
      const fatoorahPayment = await storage.getStripePaymentByIntentId(InvoiceId.toString());
      if (!fatoorahPayment) {
        console.warn(`Fatoorah webhook: Payment not found for invoice ${InvoiceId}`);
        return res.status(404).json({ message: "Payment not found" });
      }

      const deposit = await storage.getDeposit(fatoorahPayment.depositId);
      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }

      // Handle payment status
      if (InvoiceStatus === "Paid") {
        // Update deposit status
        await storage.updateDepositStatus(fatoorahPayment.depositId, "Approved");
        await storage.updateStripePaymentStatus(fatoorahPayment.id, "succeeded");

        // Get metadata to find trading account
        const metadata = fatoorahPayment.metadata ? JSON.parse(fatoorahPayment.metadata) : {};
        const tradingAccountId = metadata.tradingAccountId || deposit.accountId;

        // Add amount to trading account
        if (tradingAccountId) {
          const account = await storage.getTradingAccount(tradingAccountId);
          if (account) {
            const depositAmount = parseFloat(InvoiceValue || deposit.amount);
            const newBalance = (parseFloat(account.balance) + depositAmount).toString();
            await storage.updateTradingAccount(tradingAccountId, { balance: newBalance });

            // Sync with MT5 if enabled
            if (process.env.MT5_ENABLED === "true" && account.type === "Live") {
              try {
                await mt5Service.updateBalance(
                  account.accountId,
                  depositAmount,
                  `Fatoorah deposit: ${InvoiceId}`
                );
                console.log(`MT5 balance updated for account ${account.accountId}: +$${depositAmount}`);
              } catch (mt5Error) {
                console.error("Failed to sync deposit with MT5:", mt5Error);
                // Continue even if MT5 sync fails - local balance is updated
              }
            }

            // Credit commission to IB wallet if user was referred and referral is accepted
            const user = await storage.getUser(deposit.userId);
            if (user && user.referredBy && user.referralStatus === "Accepted") {
              try {
                const ibWallets = await storage.getIBCBWallets(user.referredBy);
                let ibWallet = ibWallets.find(w => w.walletType === "IB");
                
                if (!ibWallet) {
                  ibWallet = await storage.createIBCBWallet({
                    userId: user.referredBy,
                    walletType: "IB",
                    balance: "0",
                    currency: "USD",
                    commissionRate: "5.0",
                    totalCommission: "0",
                    enabled: true,
                  });
                }

                const commissionRate = parseFloat(ibWallet.commissionRate || "5.0");
                const commission = depositAmount * (commissionRate / 100);
                const newBalance = (parseFloat(ibWallet.balance || "0") + commission).toString();
                const newTotalCommission = (parseFloat(ibWallet.totalCommission || "0") + commission).toString();
                
                await storage.updateIBCBWallet(ibWallet.id, {
                  balance: newBalance,
                  totalCommission: newTotalCommission,
                  updatedAt: new Date(),
                });

                await storage.createNotification({
                  userId: user.referredBy,
                  title: "Commission Earned",
                  message: `You earned $${commission.toFixed(2)} commission from ${user.fullName || user.email}'s deposit.`,
                  type: "success",
                });
              } catch (error) {
                console.error("Failed to credit IB commission:", error);
              }
            }
          }
        }
      } else if (InvoiceStatus === "Failed" || InvoiceStatus === "Canceled") {
        await storage.updateDepositStatus(fatoorahPayment.depositId, "Rejected");
        await storage.updateStripePaymentStatus(fatoorahPayment.id, "failed");
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Fatoorah webhook error:", error);
      res.status(500).json({ message: error.message || "Webhook processing failed" });
    }
  });

  // Fatoorah - Check payment status (for callback URL)
  app.get("/api/fatoorah/payment-status/:invoiceId", async (req, res) => {
    try {
      const { invoiceId } = req.params;

      if (!FATOORAH_API_KEY) {
        return res.status(500).json({ message: "Fatoorah is not configured" });
      }

      // Get payment status from Fatoorah
      const response = await fetch(`${FATOORAH_BASE_URL}/v2/GetPaymentStatus`, {
        method: "POST",
        headers: fatoorahHeaders,
        body: JSON.stringify({ Key: invoiceId, KeyType: "InvoiceId" }),
      });

      if (!response.ok) {
        return res.status(500).json({ message: "Failed to get payment status" });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Fatoorah payment status error:", error);
      res.status(500).json({ message: error.message || "Failed to get payment status" });
    }
  });

  // Deposits
  app.get("/api/deposits", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const deposits = await storage.getDeposits(userId);
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deposits" });
    }
  });

  app.post("/api/deposits", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertDepositSchema.parse({
        ...req.body,
        userId,
        transactionId: `TXN${Date.now()}`,
      });
      
      const deposit = await storage.createDeposit(validatedData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Deposit Initiated",
        message: `Your deposit of $${deposit.amount} is being processed.`,
        type: "info",
      });
      
      res.status(201).json(deposit);
    } catch (error) {
      console.error("Deposit error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Withdrawals
  app.get("/api/withdrawals", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const withdrawals = await storage.getWithdrawals(userId);
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.post("/api/withdrawals", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertWithdrawalSchema.parse({
        ...req.body,
        userId,
      });
      
      const withdrawal = await storage.createWithdrawal(validatedData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Withdrawal Request Received",
        message: `Your withdrawal request of $${withdrawal.amount} is being processed.`,
        type: "info",
      });
      
      res.status(201).json(withdrawal);
    } catch (error) {
      console.error("Withdrawal error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Trading History
  app.get("/api/trading-history", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accountId = req.query.accountId as string | undefined;
      const history = await storage.getTradingHistory(userId, accountId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading history" });
    }
  });

  // Check if user has verified documents (required for trading)
  app.get("/api/documents/verification-status", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const documents = await storage.getDocuments(userId);
      const requiredTypes = ["ID Proof"]; // Only ID Proof is required
      
      const verifiedDocs = documents.filter(
        doc => doc.status === "Verified" && requiredTypes.includes(doc.type)
      );
      
      const isVerified = verifiedDocs.length >= requiredTypes.length;
      const pendingDocs = documents.filter(doc => doc.status === "Pending");
      
      res.json({
        isVerified,
        verifiedCount: verifiedDocs.length,
        requiredCount: requiredTypes.length,
        hasPending: pendingDocs.length > 0,
        documents: documents,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check verification status" });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        userId,
      });
      
      const document = await storage.createDocument(validatedData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Document Uploaded",
        message: `Your ${document.type} has been uploaded and is under review.`,
        type: "success",
      });
      
      res.status(201).json(document);
    } catch (error: any) {
      console.error("Document upload error:", error);
      const errorMessage = error?.message || "Invalid request data";
      res.status(400).json({ message: errorMessage });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // User Profile
  app.get("/api/profile", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't send password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Don't allow password update through this endpoint
      const { password, id, ...allowedUpdates } = req.body;
      
      const updated = await storage.updateUser(userId, allowedUpdates);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updated;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Fund Transfers - Internal (between user's own accounts)
  app.get("/api/fund-transfers/internal", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const allTransfers = await storage.getFundTransfers(userId);
      // Filter internal transfers (both accounts belong to the same user)
      const userAccounts = await storage.getTradingAccounts(userId);
      const accountIds = new Set(userAccounts.map(acc => acc.id));
      
      const internalTransfers = allTransfers.filter(transfer => 
        accountIds.has(transfer.fromAccountId) && accountIds.has(transfer.toAccountId)
      );

      res.json(internalTransfers);
    } catch (error) {
      console.error("Failed to fetch internal transfers:", error);
      res.status(500).json({ message: "Failed to fetch transfers" });
    }
  });

  app.post("/api/fund-transfers/internal", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { fromAccountId, toAccountId, amount, notes } = req.body;

      if (!fromAccountId || !toAccountId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify both accounts belong to the user
      const userAccounts = await storage.getTradingAccounts(userId);
      const fromAccount = userAccounts.find(acc => acc.id === fromAccountId);
      const toAccount = userAccounts.find(acc => acc.id === toAccountId);

      if (!fromAccount || !toAccount) {
        return res.status(400).json({ message: "Invalid account(s)" });
      }

      if (fromAccountId === toAccountId) {
        return res.status(400).json({ message: "Source and destination accounts cannot be the same" });
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const currentBalance = parseFloat(fromAccount.balance);
      if (currentBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create transfer record
      const transfer = await storage.createFundTransfer({
        userId,
        fromAccountId,
        toAccountId,
        amount: transferAmount.toString(),
        currency: "USD",
        status: "Completed", // Internal transfers are instant
        notes: notes || null,
      });

      // Update balances
      const newFromBalance = (currentBalance - transferAmount).toString();
      const newToBalance = (parseFloat(toAccount.balance) + transferAmount).toString();

      await storage.updateTradingAccount(fromAccountId, { balance: newFromBalance });
      await storage.updateTradingAccount(toAccountId, { balance: newToBalance });

      // Create notification
      await storage.createNotification({
        userId,
        title: "Internal Transfer Completed",
        message: `Successfully transferred $${transferAmount.toFixed(2)} from ${fromAccount.accountId} to ${toAccount.accountId}.`,
        type: "success",
      });

      res.status(201).json(transfer);
    } catch (error) {
      console.error("Internal transfer error:", error);
      res.status(500).json({ message: "Failed to process transfer" });
    }
  });

  // IB Account Stats
  app.get("/api/ib/stats", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get or create IB wallet
      let ibWallet = (await storage.getIBCBWallets(userId)).find(w => w.walletType === "IB");
      if (!ibWallet) {
        // Create IB wallet with default 5% commission rate
        ibWallet = await storage.createIBCBWallet({
          userId,
          walletType: "IB",
          balance: "0",
          currency: "USD",
          commissionRate: "5.0", // Default 5% commission
          totalCommission: "0",
          enabled: true,
        });
      }

      // Find all users who were referred by this user (referredBy === user.id)
      const allUsers = await storage.getAllUsers();
      const allReferrals = allUsers.filter(u => u.referredBy === userId);
      
      // Only count accepted referrals for commission calculations
      const acceptedReferrals = allReferrals.filter(u => u.referralStatus === "Accepted");

      // Calculate referral stats - only for accepted referrals
      let totalDeposits = 0;
      let totalCommission = parseFloat(ibWallet.totalCommission || "0");
      const referralDetails = await Promise.all(
        allReferrals.map(async (refUser) => {
          const deposits = await storage.getDeposits(refUser.id);
          const completedDeposits = deposits.filter(d => d.status === "Completed" || d.status === "Approved");
          const userTotalDeposits = completedDeposits.reduce((sum, d) => sum + parseFloat(d.amount), 0);
          
          // Only calculate commission if referral is accepted
          let commission = 0;
          if (refUser.referralStatus === "Accepted") {
            commission = userTotalDeposits * (parseFloat(ibWallet.commissionRate || "0") / 100);
            totalDeposits += userTotalDeposits;
          }

          return {
            id: refUser.id,
            email: refUser.email,
            fullName: refUser.fullName || refUser.username,
            joinedAt: refUser.createdAt || new Date(),
            totalDeposits: userTotalDeposits.toFixed(2),
            commissionEarned: commission.toFixed(2),
            status: completedDeposits.length > 0 ? "Active" as const : "Inactive" as const,
            referralStatus: refUser.referralStatus || "Pending",
          };
        })
      );

      // Calculate pending commission (from pending deposits of accepted referrals only)
      let pendingCommission = 0;
      for (const refUser of acceptedReferrals) {
        const deposits = await storage.getDeposits(refUser.id);
        const pendingDeposits = deposits.filter(d => d.status === "Pending");
        const pendingAmount = pendingDeposits.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        pendingCommission += pendingAmount * (parseFloat(ibWallet.commissionRate || "0") / 100);
      }
      
      // Count active referrals (only accepted ones with deposits)
      const activeReferrals = referralDetails.filter(r => 
        r.status === "Active" && r.referralStatus === "Accepted"
      );

      res.json({
        totalReferrals: allReferrals.length,
        acceptedReferrals: acceptedReferrals.length,
        activeReferrals: activeReferrals.length,
        totalCommission: totalCommission.toFixed(2),
        pendingCommission: pendingCommission.toFixed(2),
        wallet: ibWallet,
        referrals: referralDetails.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()),
      });
    } catch (error) {
      console.error("Failed to fetch IB stats:", error);
      res.status(500).json({ message: "Failed to fetch IB statistics" });
    }
  });

  // ========== ADMIN REFERRAL MANAGEMENT ==========

  // Admin - Get all referrals (pending, accepted, rejected)
  app.get("/api/admin/referrals", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const allUsers = await storage.getAllUsers();
      
      // Get all users who have been referred (referredBy is not null)
      const referredUsers = allUsers.filter(u => u.referredBy !== null);
      
      // Enrich with referrer information
      const referrals = referredUsers.map(user => {
        const referrer = allUsers.find(u => u.id === user.referredBy);
        return {
          id: user.id,
          userId: user.id,
          email: user.email,
          fullName: user.fullName || user.username,
          phone: user.phone,
          country: user.country,
          city: user.city,
          joinedAt: user.createdAt || new Date(),
          referralStatus: user.referralStatus || "Pending",
          referrerId: user.referredBy,
          referrerName: referrer?.fullName || referrer?.username || "Unknown",
          referrerEmail: referrer?.email || "Unknown",
          referrerReferralId: referrer?.referralId || "Unknown",
        };
      });

      // Sort by created date (newest first)
      referrals.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

      res.json(referrals);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Admin - Accept referral
  app.patch("/api/admin/referrals/:id/accept", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const userId = req.params.id;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.referredBy) {
        return res.status(400).json({ message: "User was not referred by anyone" });
      }

      // Ensure referral is in Pending status (can only accept after signup)
      if (user.referralStatus !== "Pending") {
        return res.status(400).json({ 
          message: `Referral cannot be accepted. Current status: ${user.referralStatus || "Not set"}. Only pending referrals can be accepted.` 
        });
      }

      // Update referral status
      const updated = await storage.updateUser(userId, {
        referralStatus: "Accepted",
      });

      // Log activity
      await logActivity(
        adminId!,
        "ACCEPT_REFERRAL",
        "user",
        userId,
        `Accepted referral for user ${user.email} referred by ${user.referredBy}`
      );

      // Create or enable IB wallet for the referrer if not exists
      const referrer = await storage.getUser(user.referredBy);
      if (referrer) {
        let ibWallet = (await storage.getIBCBWallets(user.referredBy)).find(w => w.walletType === "IB");
        if (!ibWallet) {
          ibWallet = await storage.createIBCBWallet({
            userId: user.referredBy,
            walletType: "IB",
            balance: "0",
            currency: "USD",
            commissionRate: "5.0", // Default 5% commission
            totalCommission: "0",
            enabled: true,
          });
        } else if (!ibWallet.enabled) {
          await storage.updateIBCBWallet(ibWallet.id, { enabled: true });
        }
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to accept referral:", error);
      res.status(500).json({ message: "Failed to accept referral" });
    }
  });

  // Admin - Reject referral
  app.patch("/api/admin/referrals/:id/reject", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const userId = req.params.id;
      const { reason } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.referredBy) {
        return res.status(400).json({ message: "User was not referred by anyone" });
      }

      // Update referral status
      const updated = await storage.updateUser(userId, {
        referralStatus: "Rejected",
      });

      // Log activity
      await logActivity(
        adminId!,
        "REJECT_REFERRAL",
        "user",
        userId,
        `Rejected referral for user ${user.email} referred by ${user.referredBy}. Reason: ${reason || "No reason provided"}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to reject referral:", error);
      res.status(500).json({ message: "Failed to reject referral" });
    }
  });

  // Admin - Update IB Commission Rate
  app.patch("/api/admin/referrals/:id/commission-rate", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const userId = req.params.id; // This is the referrer's user ID (IB broker)
      const { commissionRate } = req.body;

      if (!commissionRate || isNaN(parseFloat(commissionRate)) || parseFloat(commissionRate) < 0 || parseFloat(commissionRate) > 100) {
        return res.status(400).json({ message: "Invalid commission rate. Must be between 0 and 100." });
      }

      // Get the IB wallet for this user
      const ibWallets = await storage.getIBCBWallets(userId);
      const ibWallet = ibWallets.find(w => w.walletType === "IB");

      if (!ibWallet) {
        return res.status(404).json({ message: "IB wallet not found for this user" });
      }

      // Update commission rate
      await storage.updateIBCBWallet(ibWallet.id, {
        commissionRate: parseFloat(commissionRate).toFixed(2),
        updatedAt: new Date(),
      });

      // Log activity
      const user = await storage.getUser(userId);
      await logActivity(
        adminId!,
        "UPDATE_COMMISSION_RATE",
        "ib_wallet",
        ibWallet.id,
        `Updated commission rate to ${commissionRate}% for IB broker ${user?.email || userId}`
      );

      const updatedWallet = await storage.getIBCBWallet(ibWallet.id);
      res.json(updatedWallet);
    } catch (error) {
      console.error("Failed to update commission rate:", error);
      res.status(500).json({ message: "Failed to update commission rate" });
    }
  });

  // Admin - Send money from IB wallet to broker (IB Payout)
  app.post("/api/admin/referrals/:id/payout", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const userId = req.params.id; // This is the referrer's user ID (IB broker)
      const { amount, notes } = req.body;

      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: "Invalid amount. Must be greater than 0." });
      }

      const payoutAmount = parseFloat(amount);

      // Get the IB wallet for this user
      const ibWallets = await storage.getIBCBWallets(userId);
      const ibWallet = ibWallets.find(w => w.walletType === "IB");

      if (!ibWallet) {
        return res.status(404).json({ message: "IB wallet not found for this user" });
      }

      const currentBalance = parseFloat(ibWallet.balance || "0");
      if (currentBalance < payoutAmount) {
        return res.status(400).json({ 
          message: `Insufficient balance. Available: $${currentBalance.toFixed(2)}, Requested: $${payoutAmount.toFixed(2)}` 
        });
      }

      // Deduct amount from IB wallet
      const newBalance = (currentBalance - payoutAmount).toString();
      await storage.updateIBCBWallet(ibWallet.id, {
        balance: newBalance,
        updatedAt: new Date(),
      });

      // Log activity
      const user = await storage.getUser(userId);
      await logActivity(
        adminId!,
        "IB_PAYOUT",
        "ib_wallet",
        ibWallet.id,
        `Sent $${payoutAmount.toFixed(2)} payout to IB broker ${user?.email || userId}. ${notes || ""}`
      );

      // Create notification for IB broker
      await storage.createNotification({
        userId,
        title: "IB Payout Processed",
        message: `Your payout of $${payoutAmount.toFixed(2)} has been processed and sent to your broker account.`,
        type: "success",
      });

      const updatedWallet = await storage.getIBCBWallet(ibWallet.id);
      res.json({
        success: true,
        message: `Successfully sent $${payoutAmount.toFixed(2)} to IB broker`,
        wallet: updatedWallet,
        payoutAmount: payoutAmount.toFixed(2),
      });
    } catch (error) {
      console.error("Failed to process IB payout:", error);
      res.status(500).json({ message: "Failed to process IB payout" });
    }
  });

  // Fund Transfers - External (to another user's account)
  app.get("/api/fund-transfers/external", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const allTransfers = await storage.getFundTransfers(userId);
      // Filter external transfers (toAccountId is not in user's accounts)
      const userAccounts = await storage.getTradingAccounts(userId);
      const accountIds = new Set(userAccounts.map(acc => acc.id));
      
      const externalTransfers = allTransfers.filter(transfer => 
        accountIds.has(transfer.fromAccountId) && !accountIds.has(transfer.toAccountId)
      );

      res.json(externalTransfers);
    } catch (error) {
      console.error("Failed to fetch external transfers:", error);
      res.status(500).json({ message: "Failed to fetch transfers" });
    }
  });

  app.post("/api/fund-transfers/external", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { fromAccountId, toAccountNumber, amount, otpMethod } = req.body;

      if (!fromAccountId || !toAccountNumber || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify source account belongs to user
      const userAccounts = await storage.getTradingAccounts(userId);
      const fromAccount = userAccounts.find(acc => acc.id === fromAccountId);

      if (!fromAccount) {
        return res.status(400).json({ message: "Invalid source account" });
      }

      // Find destination account by account number
      const allAccounts = await storage.getAllTradingAccounts();
      const toAccount = allAccounts.find(acc => acc.accountId === toAccountNumber);

      if (!toAccount) {
        return res.status(400).json({ message: "Destination account not found" });
      }

      if (toAccount.userId === userId) {
        return res.status(400).json({ message: "Use Internal Transfer for your own accounts" });
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Calculate fee (2.5%)
      const fee = transferAmount * 0.025;
      const totalDeduction = transferAmount + fee;

      const currentBalance = parseFloat(fromAccount.balance);
      if (currentBalance < totalDeduction) {
        return res.status(400).json({ message: `Insufficient balance. Need $${totalDeduction.toFixed(2)} (amount + 2.5% fee)` });
      }

      // Create transfer record (Pending - requires admin approval)
      const transfer = await storage.createFundTransfer({
        userId,
        fromAccountId,
        toAccountId: toAccount.id, // Store the actual account ID
        amount: transferAmount.toString(),
        currency: "USD",
        status: "Pending", // External transfers require approval
        notes: `External transfer to ${toAccountNumber}. Fee: $${fee.toFixed(2)}. OTP Method: ${otpMethod}`,
      });

      // Deduct amount + fee from source account immediately
      const newFromBalance = (currentBalance - totalDeduction).toString();
      await storage.updateTradingAccount(fromAccountId, { balance: newFromBalance });

      // Create notification
      await storage.createNotification({
        userId,
        title: "External Transfer Initiated",
        message: `Transfer of $${transferAmount.toFixed(2)} to ${toAccountNumber} is pending approval. Fee: $${fee.toFixed(2)}.`,
        type: "info",
      });

      res.status(201).json({
        ...transfer,
        fee: fee.toFixed(2),
        totalDeduction: totalDeduction.toFixed(2),
        message: "Transfer initiated. Please verify with OTP if required.",
      });
    } catch (error) {
      console.error("External transfer error:", error);
      res.status(500).json({ message: "Failed to process transfer" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const accounts = await storage.getTradingAccounts(userId);
      const trades = await storage.getTradingHistory(userId);
      const deposits = await storage.getDeposits(userId);
      
      // Calculate total balance and equity across all accounts
      const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || "0"), 0);
      const totalEquity = accounts.reduce((sum, acc) => sum + parseFloat(acc.equity || "0"), 0);
      const totalMargin = accounts.reduce((sum, acc) => sum + parseFloat(acc.margin || "0"), 0);
      
      // Calculate total P/L from closed trades
      const totalProfitLoss = trades
        .filter(t => t.status === "Closed" && t.profit)
        .reduce((sum, t) => sum + parseFloat(t.profit!), 0);
      
      res.json({
        balance: totalBalance.toFixed(2),
        equity: totalEquity.toFixed(2),
        margin: totalMargin.toFixed(2),
        profitLoss: totalProfitLoss.toFixed(2),
        totalAccounts: accounts.length,
        openTrades: trades.filter(t => t.status === "Open").length,
        totalDeposits: deposits.filter(d => d.status === "Completed").length,
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // ===================== ADMIN ROUTES =====================

  // Admin Authentication
  app.post("/api/admin/auth/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find admin
      const admin = await storage.getAdminUserByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Check if admin is enabled
      if (!admin.enabled) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Set session
      req.session.adminId = admin.id;
      req.session.save();

      // Log activity
      await logActivity(admin.id, "signin", "admin", admin.id, "Admin signed in");

      // Return admin without password
      const { password: _, ...adminWithoutPassword } = admin;
      res.json({ admin: adminWithoutPassword });
    } catch (error) {
      console.error("Admin signin error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  app.post("/api/admin/auth/logout", async (req, res) => {
    const adminId = getCurrentAdminId(req);
    if (adminId) {
      await logActivity(adminId, "logout", "admin", adminId, "Admin signed out");
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/auth/me", async (req, res) => {
    try {
      const adminId = getCurrentAdminId(req);
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const admin = await storage.getAdminUser(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const { password: _, ...adminWithoutPassword } = admin;
      res.json({ admin: adminWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin" });
    }
  });

  // Admin User Management
  app.get("/api/admin/users", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let users;
      if (admin!.role === "super_admin") {
        // Super admin sees all users
        users = await storage.getAllUsers();
      } else if (admin!.role === "middle_admin") {
        // Middle admin sees users from assigned countries
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        
        const allUsers = await storage.getAllUsers();
        users = allUsers.filter(user => 
          user.country && countries.includes(user.country)
        );
      } else {
        // Normal admin sees all users (can be modified based on requirements)
        users = await storage.getAllUsers();
      }

      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/:id", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't allow password or id updates through this endpoint
      const { password, id, ...allowedUpdates } = req.body;

      const updated = await storage.updateUser(req.params.id, allowedUpdates);

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log activity
      await logActivity(
        adminId,
        "update_user",
        "user",
        req.params.id,
        `Updated user details: ${user.email}`
      );

      const { password: _, ...userWithoutPassword } = updated;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.patch("/api/admin/users/:id/toggle", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newEnabledStatus = !user.enabled;
      const updated = await storage.updateUser(req.params.id, {
        enabled: newEnabledStatus,
      });

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log activity
      await logActivity(
        adminId,
        newEnabledStatus ? "enable_user" : "disable_user",
        "user",
        req.params.id,
        `User ${newEnabledStatus ? "enabled" : "disabled"}: ${user.email}`
      );

      const { password, ...userWithoutPassword } = updated;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Failed to toggle user:", error);
      res.status(500).json({ message: "Failed to toggle user status" });
    }
  });

  // Admin Document Management
  app.get("/api/admin/documents", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let documents: Document[];
      
      if (admin!.role === "super_admin") {
        // Super admin sees all documents
        documents = await storage.getAllDocuments();
      } else if (admin!.role === "middle_admin") {
        // Middle admin sees documents from users in assigned countries
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        
        const allUsers = await storage.getAllUsers();
        const userIds = allUsers
          .filter(user => user.country && countries.includes(user.country))
          .map(user => user.id);
        
        const allDocuments = await storage.getAllDocuments();
        documents = allDocuments.filter(doc => userIds.includes(doc.userId));
      } else {
        // Normal admin sees all documents
        documents = await storage.getAllDocuments();
      }
      
      // Sort by uploaded date (newest first)
      documents.sort((a, b) => {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return dateB - dateA;
      });
      
      res.json(documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Admin - Verify or reject document (all admin types can verify)
  app.patch("/api/admin/documents/:id/verify", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const { status, rejectionReason } = req.body;

      if (!["Verified", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const updated = await storage.updateDocument(req.params.id, {
        status,
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: status === "Rejected" ? rejectionReason : null,
      });

      // Log activity
      await logActivity(
        adminId!,
        status === "Verified" ? "VERIFY_DOCUMENT" : "REJECT_DOCUMENT",
        "document",
        req.params.id,
        `Document ${document.type} ${status.toLowerCase()} for user ${document.userId}`
      );

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  // Admin Deposit Management
  app.get("/api/admin/deposits", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let deposits;

      if (admin!.role === "super_admin") {
        deposits = await storage.getAllDeposits();
      } else if (admin!.role === "middle_admin") {
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        const allUsers = await storage.getAllUsers();
        const filteredUsers = allUsers.filter(user => user.country && countries.includes(user.country));
        const userIds = filteredUsers.map(u => u.id);
        const allDeposits = await storage.getAllDeposits();
        deposits = allDeposits.filter(dep => userIds.includes(dep.userId));
      } else {
        deposits = await storage.getAllDeposits();
      }

      res.json(deposits);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
      res.status(500).json({ message: "Failed to fetch deposits" });
    }
  });

  app.patch("/api/admin/deposits/:id/approve", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const { amount } = req.body;

      const deposit = await storage.getDeposit(req.params.id);
      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }

      const depositAmount = amount ? parseFloat(amount) : parseFloat(deposit.amount);
      
      // Update deposit status
      const updated = await storage.updateDepositStatus(deposit.id, "Completed");

      // Add amount to trading account
      if (deposit.accountId) {
        const account = await storage.getTradingAccount(deposit.accountId);
        if (account) {
          const newBalance = (parseFloat(account.balance || "0") + depositAmount).toString();
          await storage.updateTradingAccount(deposit.accountId, { balance: newBalance });

          // Sync with MT5 if enabled
          if (process.env.MT5_ENABLED === "true" && account.type === "Live") {
            try {
              await mt5Service.updateBalance(
                account.accountId,
                depositAmount,
                `Deposit approved: ${deposit.id}`
              );
            } catch (mt5Error) {
              console.error("Failed to sync deposit with MT5:", mt5Error);
            }
          }
        }
      }

      // Credit commission to IB wallet if user was referred and referral is accepted
      const user = await storage.getUser(deposit.userId);
      if (user && user.referredBy && user.referralStatus === "Accepted") {
        try {
          const ibWallets = await storage.getIBCBWallets(user.referredBy);
          let ibWallet = ibWallets.find(w => w.walletType === "IB");
          
          if (!ibWallet) {
            // Create IB wallet if it doesn't exist
            ibWallet = await storage.createIBCBWallet({
              userId: user.referredBy,
              walletType: "IB",
              balance: "0",
              currency: "USD",
              commissionRate: "5.0",
              totalCommission: "0",
              enabled: true,
            });
          }

          // Calculate commission (default 5% or use wallet rate)
          const commissionRate = parseFloat(ibWallet.commissionRate || "5.0");
          const commission = depositAmount * (commissionRate / 100);
          
          // Update IB wallet balance and total commission
          const newBalance = (parseFloat(ibWallet.balance || "0") + commission).toString();
          const newTotalCommission = (parseFloat(ibWallet.totalCommission || "0") + commission).toString();
          
          await storage.updateIBCBWallet(ibWallet.id, {
            balance: newBalance,
            totalCommission: newTotalCommission,
            updatedAt: new Date(),
          });

          // Create notification for IB
          await storage.createNotification({
            userId: user.referredBy,
            title: "Commission Earned",
            message: `You earned $${commission.toFixed(2)} commission from ${user.fullName || user.email}'s deposit of $${depositAmount.toFixed(2)}.`,
            type: "success",
          });
        } catch (error) {
          console.error("Failed to credit IB commission:", error);
          // Don't fail the deposit approval if commission crediting fails
        }
      }

      // Log activity
      await logActivity(
        adminId,
        "approve_deposit",
        "deposit",
        deposit.id,
        `Approved deposit of $${depositAmount.toFixed(2)} for user ${deposit.userId}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to approve deposit:", error);
      res.status(500).json({ message: "Failed to approve deposit" });
    }
  });

  app.patch("/api/admin/deposits/:id/reject", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const deposit = await storage.getDeposit(req.params.id);
      
      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }

      const updated = await storage.updateDepositStatus(deposit.id, "Rejected");

      // Log activity
      await logActivity(
        adminId,
        "reject_deposit",
        "deposit",
        deposit.id,
        `Rejected deposit of $${deposit.amount} for user ${deposit.userId}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to reject deposit:", error);
      res.status(500).json({ message: "Failed to reject deposit" });
    }
  });

  // Admin - Add funds to user account (super admin feature)
  app.post("/api/admin/users/:userId/add-funds", async (req, res) => {
    try {
      const canProceed = await requireSuperAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const { tradingAccountId, amount, reason } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const account = await storage.getTradingAccount(tradingAccountId);
      if (!account) {
        return res.status(404).json({ message: "Trading account not found" });
      }

      if (account.userId !== req.params.userId) {
        return res.status(400).json({ message: "Account does not belong to user" });
      }

      // Add funds to account
      const newBalance = (parseFloat(account.balance) + parseFloat(amount)).toString();
      await storage.updateTradingAccount(tradingAccountId, { balance: newBalance });

      // Create deposit record
      await storage.createDeposit({
        userId: req.params.userId,
        accountId: tradingAccountId,
        merchant: "Admin Credit",
        amount: amount.toString(),
        status: "Approved",
        transactionId: `ADMIN-${Date.now()}`,
      });

      // Log activity
      await logActivity(
        adminId!,
        "ADD_FUNDS",
        "user",
        req.params.userId,
        `Added $${amount} to account ${account.accountId}. Reason: ${reason || "N/A"}`
      );

      res.json({ message: "Funds added successfully", newBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to add funds" });
    }
  });

  // Admin - Remove funds from user account (super admin feature)
  app.post("/api/admin/users/:userId/remove-funds", async (req, res) => {
    try {
      const canProceed = await requireSuperAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const { tradingAccountId, amount, reason } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const account = await storage.getTradingAccount(tradingAccountId);
      if (!account) {
        return res.status(404).json({ message: "Trading account not found" });
      }

      if (account.userId !== req.params.userId) {
        return res.status(400).json({ message: "Account does not belong to user" });
      }

      const currentBalance = parseFloat(account.balance);
      if (currentBalance < parseFloat(amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Remove funds from account
      const newBalance = (currentBalance - parseFloat(amount)).toString();
      await storage.updateTradingAccount(tradingAccountId, { balance: newBalance });

      // Log activity
      await logActivity(
        adminId!,
        "REMOVE_FUNDS",
        "user",
        req.params.userId,
        `Removed $${amount} from account ${account.accountId}. Reason: ${reason || "N/A"}`
      );

      res.json({ message: "Funds removed successfully", newBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove funds" });
    }
  });

  // Admin - Impersonate user (super admin only)
  app.post("/api/admin/users/:userId/impersonate", async (req, res) => {
    try {
      const canProceed = await requireSuperAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req);
      const user = await storage.getUser(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Store current admin ID and switch to user session
      req.session.originalAdminId = adminId;
      req.session.userId = user.id;
      req.session.adminId = undefined;

      // Log activity
      await logActivity(
        adminId!,
        "IMPERSONATE_USER",
        "user",
        req.params.userId,
        `Admin impersonating user ${user.email}`
      );

      res.json({ 
        message: "Impersonation started",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to impersonate user" });
    }
  });

  // Admin - Stop impersonating user
  app.post("/api/admin/stop-impersonation", async (req, res) => {
    try {
      const originalAdminId = req.session.originalAdminId;
      
      if (!originalAdminId) {
        return res.status(400).json({ message: "Not currently impersonating" });
      }

      // Restore admin session
      req.session.adminId = originalAdminId;
      req.session.userId = undefined;
      req.session.originalAdminId = undefined;

      res.json({ message: "Impersonation ended" });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop impersonation" });
    }
  });

  app.patch("/api/admin/documents/:id/approve", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const updated = await storage.updateDocument(req.params.id, {
        status: "Verified",
        approvedBy: adminId,
        verifiedAt: new Date(),
      });

      if (!updated) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if user is now fully verified
      const userDocuments = await storage.getDocuments(document.userId);
      const requiredTypes = ["ID Proof"];
      const verifiedDocs = userDocuments.filter(
        doc => doc.status === "Verified" && requiredTypes.includes(doc.type)
      );
      const isNowVerified = verifiedDocs.length >= requiredTypes.length;

      // Create notification for user
      await storage.createNotification({
        userId: document.userId,
        title: isNowVerified ? "🎉 Verification Complete!" : "Document Approved",
        message: isNowVerified 
          ? "Your identity has been verified. You can now access all trading features!"
          : `Your ${document.type} has been verified.`,
        type: "success",
      });

      // Log activity
      await logActivity(
        adminId,
        "approve_document",
        "document",
        req.params.id,
        `Approved ${document.type} for user ${document.userId}${isNowVerified ? " - User is now fully verified" : ""}`
      );

      res.json({
        ...updated,
        isUserVerified: isNowVerified, // Include verification status in response
      });
    } catch (error) {
      console.error("Failed to approve document:", error);
      res.status(500).json({ message: "Failed to approve document" });
    }
  });

  app.patch("/api/admin/documents/:id/reject", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }

      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const updated = await storage.updateDocument(req.params.id, {
        status: "Rejected",
        rejectionReason: reason,
      });

      if (!updated) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Create notification for user
      await storage.createNotification({
        userId: document.userId,
        title: "Document Rejected",
        message: `Your ${document.type} was rejected: ${reason}`,
        type: "error",
      });

      // Log activity
      await logActivity(
        adminId,
        "reject_document",
        "document",
        req.params.id,
        `Rejected ${document.type} for user ${document.userId}: ${reason}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to reject document:", error);
      res.status(500).json({ message: "Failed to reject document" });
    }
  });

  // Admin Management (Super Admin only)
  app.post("/api/admin/admins", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const { username, password, email, fullName, role, countries } = req.body;
      
      if (!username || !password || !email || !fullName || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate role
      const validRoles = ["super_admin", "middle_admin", "normal_admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be super_admin, middle_admin, or normal_admin" });
      }

      // Validate countries for middle_admin
      if (role === "middle_admin") {
        if (!countries || !Array.isArray(countries) || countries.length === 0) {
          return res.status(400).json({ message: "At least one country is required for middle admin" });
        }
      }

      // Check if admin already exists
      const existingAdmin = await storage.getAdminUserByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getAdminUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const validatedData = insertAdminUserSchema.parse({
        username,
        password: hashedPassword,
        email,
        fullName,
        role,
        enabled: true,
        createdBy: adminId,
      });
      
      const newAdmin = await storage.createAdminUser(validatedData);

      // Create country assignments for middle_admin
      const createdCountries: any[] = [];
      if (role === "middle_admin" && countries && Array.isArray(countries)) {
        for (const country of countries) {
          try {
            const assignment = await storage.createAdminCountryAssignment({
              adminId: newAdmin.id,
              country: country,
            });
            createdCountries.push(assignment);
          } catch (error) {
            console.error(`Failed to assign country ${country}:`, error);
            // Continue with other countries
          }
        }
      }

      // Log activity
      const activityDetails = role === "middle_admin" && createdCountries.length > 0
        ? `Created ${role} admin: ${username} with countries: ${createdCountries.map(c => c.country).join(", ")}`
        : `Created ${role} admin: ${username}`;
      
      await logActivity(
        adminId,
        "create_admin",
        "admin",
        newAdmin.id,
        activityDetails
      );

      const { password: _, ...adminWithoutPassword } = newAdmin;
      res.status(201).json({
        admin: adminWithoutPassword,
        countries: createdCountries,
        credentials: {
          username: username,
          password: password, // Return password only on creation
        }
      });
    } catch (error) {
      console.error("Failed to create admin:", error);
      res.status(400).json({ message: "Failed to create admin" });
    }
  });

  app.get("/api/admin/admins", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const admins = await storage.getAllAdminUsers();
      const adminsWithoutPasswords = admins.map(({ password, ...admin }) => admin);
      res.json(adminsWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  // Get all country assignments (for super admin to see all)
  app.get("/api/admin/all-country-assignments", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const allAdmins = await storage.getAllAdminUsers();
      const middleAdmins = allAdmins.filter(a => a.role === "middle_admin");
      
      const allAssignments: Array<{ adminId: string; country: string }> = [];
      for (const admin of middleAdmins) {
        const assignments = await storage.getAdminCountryAssignments(admin.id);
        assignments.forEach(assignment => {
          allAssignments.push({
            adminId: admin.id,
            country: assignment.country,
          });
        });
      }
      
      res.json(allAssignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country assignments" });
    }
  });

  app.patch("/api/admin/admins/:id", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const { password, id, ...allowedUpdates } = req.body;
      
      // Hash password if provided
      if (password) {
        allowedUpdates.password = await bcrypt.hash(password, 10);
      }

      const updated = await storage.updateAdminUser(req.params.id, allowedUpdates);
      if (!updated) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Log activity
      await logActivity(
        adminId,
        "update_admin",
        "admin",
        req.params.id,
        `Updated admin: ${updated.username}`
      );

      const { password: _, ...adminWithoutPassword } = updated;
      res.json(adminWithoutPassword);
    } catch (error) {
      console.error("Failed to update admin:", error);
      res.status(500).json({ message: "Failed to update admin" });
    }
  });

  app.post("/api/admin/admins/:id/countries", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const { country } = req.body;
      
      if (!country) {
        return res.status(400).json({ message: "Country is required" });
      }

      const targetAdmin = await storage.getAdminUser(req.params.id);
      if (!targetAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (targetAdmin.role !== "middle_admin") {
        return res.status(400).json({ message: "Can only assign countries to middle admins" });
      }

      const validatedData = insertAdminCountryAssignmentSchema.parse({
        adminId: req.params.id,
        country,
      });

      const assignment = await storage.createAdminCountryAssignment(validatedData);

      // Log activity
      await logActivity(
        adminId,
        "assign_country",
        "admin",
        req.params.id,
        `Assigned country ${country} to ${targetAdmin.username}`
      );

      res.status(201).json(assignment);
    } catch (error) {
      console.error("Failed to assign country:", error);
      res.status(400).json({ message: "Failed to assign country" });
    }
  });

  app.delete("/api/admin/admins/:id/countries/:country", async (req, res) => {
    try {
      if (!(await requireSuperAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      
      await storage.deleteAdminCountryAssignment(req.params.id, req.params.country);

      // Log activity
      await logActivity(
        adminId,
        "remove_country",
        "admin",
        req.params.id,
        `Removed country ${req.params.country} from admin`
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to remove country:", error);
      res.status(500).json({ message: "Failed to remove country assignment" });
    }
  });

  // Admin Trading Accounts
  app.get("/api/admin/trading-accounts", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let accounts = await storage.getAllTradingAccounts();

      if (admin!.role === "middle_admin") {
        // Filter by assigned countries
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        
        // Get all users from assigned countries
        const allUsers = await storage.getAllUsers();
        const userIds = allUsers
          .filter(user => user.country && countries.includes(user.country))
          .map(user => user.id);
        
        accounts = accounts.filter(account => userIds.includes(account.userId));
      }

      res.json(accounts);
    } catch (error) {
      console.error("Failed to fetch trading accounts:", error);
      res.status(500).json({ message: "Failed to fetch trading accounts" });
    }
  });

  app.patch("/api/admin/trading-accounts/:id/toggle", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const account = await storage.getTradingAccount(req.params.id);
      
      if (!account) {
        return res.status(404).json({ message: "Trading account not found" });
      }

      const newEnabledStatus = !account.enabled;
      const updated = await storage.updateTradingAccount(req.params.id, {
        enabled: newEnabledStatus,
      });

      if (!updated) {
        return res.status(404).json({ message: "Trading account not found" });
      }

      // Log activity
      await logActivity(
        adminId,
        newEnabledStatus ? "enable_trading_account" : "disable_trading_account",
        "trading_account",
        req.params.id,
        `Trading account ${account.accountId} ${newEnabledStatus ? "enabled" : "disabled"}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to toggle trading account:", error);
      res.status(500).json({ message: "Failed to toggle trading account" });
    }
  });

  // Activity Logs
  app.get("/api/admin/activity-logs", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let logs;
      if (admin!.role === "super_admin") {
        logs = await storage.getAllActivityLogs();
      } else {
        logs = await storage.getActivityLogs(adminId);
      }

      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Admin Statistics
  // Admin - Account Types Stats
  app.get("/api/admin/accounts/stats", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let accounts;

      if (admin!.role === "super_admin") {
        accounts = await storage.getAllTradingAccounts();
      } else if (admin!.role === "middle_admin") {
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        const allUsers = await storage.getAllUsers();
        const filteredUsers = allUsers.filter(user => user.country && countries.includes(user.country));
        const userIds = filteredUsers.map(u => u.id);
        const allAccounts = await storage.getAllTradingAccounts();
        accounts = allAccounts.filter(acc => userIds.includes(acc.userId));
      } else {
        accounts = await storage.getAllTradingAccounts();
      }

      // Count by account type/group combinations
      const liveAccounts = accounts.filter(a => a.type === "Live").length;
      const ibAccounts = accounts.filter(a => a.group === "IB" || a.type === "IB").length;
      const championAccounts = accounts.filter(a => a.group === "Champion" || a.type === "Champion").length;
      const ndbAccounts = accounts.filter(a => a.type === "Bonus" || a.group === "NDB" || a.type === "NDB").length;
      const socialTradingAccounts = accounts.filter(a => a.group === "Social" || a.type === "Social").length;
      const bonusShiftingAccounts = accounts.filter(a => a.group === "Bonus" && a.type !== "Bonus").length;

      res.json({
        liveAccounts,
        ibAccounts,
        championAccounts,
        ndbAccounts,
        socialTradingAccounts,
        bonusShiftingAccounts,
      });
    } catch (error) {
      console.error("Failed to fetch account stats:", error);
      res.status(500).json({ message: "Failed to fetch account statistics" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const adminId = getCurrentAdminId(req)!;
      const admin = await storage.getAdminUser(adminId);
      
      let users, documents, accounts, deposits, withdrawals;

      if (admin!.role === "super_admin") {
        users = await storage.getAllUsers();
        documents = await storage.getAllDocuments();
        accounts = await storage.getAllTradingAccounts();
        deposits = await storage.getAllDeposits();
        withdrawals = await storage.getAllWithdrawals();
      } else if (admin!.role === "middle_admin") {
        const assignments = await storage.getAdminCountryAssignments(adminId);
        const countries = assignments.map(a => a.country);
        
        const allUsers = await storage.getAllUsers();
        users = allUsers.filter(user => user.country && countries.includes(user.country));
        
        const userIds = users.map(u => u.id);
        
        const allDocuments = await storage.getAllDocuments();
        documents = allDocuments.filter(doc => userIds.includes(doc.userId));
        
        const allAccounts = await storage.getAllTradingAccounts();
        accounts = allAccounts.filter(acc => userIds.includes(acc.userId));
        
        const allDeposits = await storage.getAllDeposits();
        deposits = allDeposits.filter(dep => userIds.includes(dep.userId));
        
        const allWithdrawals = await storage.getAllWithdrawals();
        withdrawals = allWithdrawals.filter(wd => userIds.includes(wd.userId));
      } else {
        users = await storage.getAllUsers();
        documents = await storage.getAllDocuments();
        accounts = await storage.getAllTradingAccounts();
        deposits = await storage.getAllDeposits();
        withdrawals = await storage.getAllWithdrawals();
      }

      // Calculate country breakdown (users)
      const countryBreakdown: Record<string, number> = {};
      users.forEach(user => {
        if (user.country) {
          countryBreakdown[user.country] = (countryBreakdown[user.country] || 0) + 1;
        }
      });
      const countryList = Object.entries(countryBreakdown)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

      // Calculate country breakdown for trading accounts
      const countryAccountsBreakdown: Record<string, number> = {};
      const userMap = new Map(users.map(u => [u.id, u]));
      accounts.forEach(account => {
        const user = userMap.get(account.userId);
        if (user && user.country) {
          countryAccountsBreakdown[user.country] = (countryAccountsBreakdown[user.country] || 0) + 1;
        }
      });
      const countryAccountsList = Object.entries(countryAccountsBreakdown)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

      const stats = {
        totalUsers: users.length,
        enabledUsers: users.filter(u => u.enabled).length,
        verifiedUsers: users.filter(u => u.verified).length,
        pendingDocuments: documents.filter(d => d.status === "Pending").length,
        verifiedDocuments: documents.filter(d => d.status === "Verified").length,
        rejectedDocuments: documents.filter(d => d.status === "Rejected").length,
        totalTradingAccounts: accounts.length,
        liveAccounts: accounts.filter(a => a.type === "Live").length,
        demoAccounts: accounts.filter(a => a.type === "Demo").length,
        pendingDeposits: deposits.filter(d => d.status === "Pending").length,
        completedDeposits: deposits.filter(d => d.status === "Completed").length,
        totalDepositAmount: deposits
          .filter(d => d.status === "Completed")
          .reduce((sum, d) => sum + parseFloat(d.amount), 0)
          .toFixed(2),
        pendingWithdrawals: withdrawals.filter(w => w.status === "Pending").length,
        completedWithdrawals: withdrawals.filter(w => w.status === "Completed").length,
        totalWithdrawalAmount: withdrawals
          .filter(w => w.status === "Completed")
          .reduce((sum, w) => sum + parseFloat(w.amount), 0)
          .toFixed(2),
        countryBreakdown: countryList,
        countryAccountsBreakdown: countryAccountsList,
      };

      res.json(stats);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // ========== SUPPORT TICKETS ==========

  // User - Get own support tickets
  app.get("/api/support-tickets", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tickets = await storage.getSupportTickets(userId);
      // Also fetch replies for each ticket
      const ticketsWithReplies = await Promise.all(
        tickets.map(async (ticket) => {
          const replies = await storage.getSupportTicketReplies(ticket.id);
          return { ...ticket, replies };
        })
      );

      res.json(ticketsWithReplies);
    } catch (error) {
      console.error("Failed to fetch support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // User - Create support ticket
  app.post("/api/support-tickets", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { subject, message, category, priority } = req.body;

      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }

      const ticket = await storage.createSupportTicket({
        userId,
        subject,
        message,
        category: category || "Other",
        priority: priority || "Medium",
        status: "Open",
      });

      // Note: Admin notifications would need a separate admin_notifications table
      // For now, we'll skip admin notifications as they can see tickets in the admin panel

      res.status(201).json(ticket);
    } catch (error: any) {
      console.error("Failed to create support ticket:", error);
      const errorMessage = error?.message || "Failed to create support ticket";
      res.status(500).json({ message: errorMessage });
    }
  });

  // User - Reply to support ticket
  app.post("/api/support-tickets/:id/reply", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }

      const ticket = await storage.getSupportTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (ticket.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const reply = await storage.createSupportTicketReply({
        ticketId: req.params.id,
        userId,
        message: message.trim(),
      });

      // Update ticket status if it was closed
      if (ticket.status === "Closed") {
        await storage.updateSupportTicketStatus(req.params.id, "Open");
      }

      res.status(201).json(reply);
    } catch (error) {
      console.error("Failed to add reply:", error);
      res.status(500).json({ message: "Failed to add reply" });
    }
  });

  // Admin - Get all support tickets
  app.get("/api/admin/support-tickets", async (req, res) => {
    try {
      if (!(await requireAdmin(req, res))) return;

      const tickets = await storage.getSupportTickets();
      // Fetch replies for each ticket
      const ticketsWithReplies = await Promise.all(
        tickets.map(async (ticket) => {
          const replies = await storage.getSupportTicketReplies(ticket.id);
          return { ...ticket, replies };
        })
      );

      res.json(ticketsWithReplies);
    } catch (error) {
      console.error("Failed to fetch support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Admin - Reply to support ticket
  app.post("/api/admin/support-tickets/:id/reply", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req)!;
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }

      const ticket = await storage.getSupportTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const reply = await storage.createSupportTicketReply({
        ticketId: req.params.id,
        adminId,
        message: message.trim(),
      });

      // Update ticket status to "In Progress" if it was "Open"
      if (ticket.status === "Open") {
        await storage.updateSupportTicketStatus(req.params.id, "In Progress");
      }

      // Notify user
      if (ticket.userId) {
        await storage.createNotification({
          userId: ticket.userId,
          title: "New Reply to Your Ticket",
          message: `Admin replied to: ${ticket.subject}`,
          type: "info",
        });
      }

      // Log activity
      await logActivity(
        adminId,
        "reply_support_ticket",
        "support_ticket",
        req.params.id,
        `Replied to ticket: ${ticket.subject}`
      );

      res.status(201).json(reply);
    } catch (error) {
      console.error("Failed to add admin reply:", error);
      res.status(500).json({ message: "Failed to add reply" });
    }
  });

  // Admin - Update ticket status
  app.patch("/api/admin/support-tickets/:id/status", async (req, res) => {
    try {
      const canProceed = await requireAdmin(req, res);
      if (!canProceed) return;

      const adminId = getCurrentAdminId(req)!;
      const { status } = req.body;

      if (!status || !["Open", "In Progress", "Resolved", "Closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const ticket = await storage.getSupportTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const updated = await storage.updateSupportTicketStatus(req.params.id, status);

      // Notify user if status changed
      if (ticket.userId && ticket.status !== status) {
        await storage.createNotification({
          userId: ticket.userId,
          title: "Ticket Status Updated",
          message: `Your ticket "${ticket.subject}" status changed to ${status}`,
          type: "info",
        });
      }

      // Log activity
      await logActivity(
        adminId,
        "update_ticket_status",
        "support_ticket",
        req.params.id,
        `Updated ticket status to ${status}`
      );

      res.json(updated);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      res.status(500).json({ message: "Failed to update ticket status" });
    }
  });

}
