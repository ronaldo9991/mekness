import type { Express } from "express";
import { storage } from "./storage";
import { insertDepositSchema, insertWithdrawalSchema, insertDocumentSchema, insertTradingAccountSchema, insertUserSchema, insertAdminUserSchema, insertAdminCountryAssignmentSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { registerMT5Routes } from "./mt5-routes";
import { mt5Service } from "./mt5-service";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

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
      const { email, password, fullName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create username from email
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        fullName: fullName || "",
      });

      // Set session
      req.session.userId = user.id;
      req.session.save();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
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

  // Stripe Payment Intent - Create deposit with Stripe
  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, tradingAccountId, paymentMethod } = req.body;

      if (!amount || amount < 10) {
        return res.status(400).json({ message: "Minimum deposit is $10" });
      }

      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses cents
        currency: "usd",
        payment_method_types: paymentMethod === "crypto" ? ["card"] : ["card"],
        metadata: {
          userId,
          tradingAccountId: tradingAccountId || "",
          depositType: paymentMethod || "card",
        },
      });

      // Create deposit record
      const deposit = await storage.createDeposit({
        userId,
        accountId: tradingAccountId,
        merchant: paymentMethod === "crypto" ? "Cryptocurrency" : "Stripe",
        amount: amount.toString(),
        status: "Pending",
        transactionId: paymentIntent.id,
      });

      // Store Stripe payment in database
      await storage.createStripePayment({
        userId,
        depositId: deposit.id,
        paymentIntentId: paymentIntent.id,
        amount: amount.toString(),
        currency: "usd",
        status: paymentIntent.status,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        depositId: deposit.id,
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: error.message || "Failed to create payment intent" });
    }
  });

  // Stripe Crypto Payment Intent
  app.post("/api/stripe/create-crypto-payment", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, tradingAccountId, cryptocurrency } = req.body;

      if (!amount || amount < 10) {
        return res.status(400).json({ message: "Minimum deposit is $10" });
      }

      // Create Stripe Checkout Session for crypto
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Stripe crypto is handled via checkout
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Trading Account Deposit",
                description: `Deposit to trading account via ${cryptocurrency || "cryptocurrency"}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL || "http://localhost:5000"}/dashboard/deposit?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5000"}/dashboard/deposit?canceled=true`,
        metadata: {
          userId,
          tradingAccountId: tradingAccountId || "",
          depositType: "crypto",
          cryptocurrency: cryptocurrency || "BTC",
        },
      });

      // Create deposit record
      const deposit = await storage.createDeposit({
        userId,
        accountId: tradingAccountId,
        merchant: `Stripe Crypto (${cryptocurrency || "BTC"})`,
        amount: amount.toString(),
        status: "Pending",
        transactionId: session.id,
      });

      res.json({
        sessionId: session.id,
        url: session.url,
        depositId: deposit.id,
      });
    } catch (error: any) {
      console.error("Stripe crypto payment error:", error);
      res.status(500).json({ message: error.message || "Failed to create crypto payment" });
    }
  });

  // Stripe Webhook - Handle payment confirmations
  app.post("/api/stripe/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { userId, tradingAccountId } = paymentIntent.metadata;

        // Update deposit status
        const stripePayment = await storage.getStripePaymentByIntentId(paymentIntent.id);
        if (stripePayment) {
          await storage.updateDepositStatus(stripePayment.depositId, "Approved");
          await storage.updateStripePaymentStatus(stripePayment.id, "succeeded");

          // Add amount to trading account
          if (tradingAccountId) {
            const account = await storage.getTradingAccount(tradingAccountId);
            if (account) {
              const depositAmount = paymentIntent.amount / 100;
              const newBalance = (parseFloat(account.balance) + depositAmount).toString();
              await storage.updateTradingAccount(tradingAccountId, { balance: newBalance });

              // Sync with MT5 if enabled
              if (process.env.MT5_ENABLED === "true" && account.type === "Live") {
                try {
                  await mt5Service.updateBalance(
                    account.accountId,
                    depositAmount,
                    `Stripe deposit: ${paymentIntent.id}`
                  );
                  console.log(`MT5 balance updated for account ${account.accountId}: +$${depositAmount}`);
                } catch (mt5Error) {
                  console.error("Failed to sync deposit with MT5:", mt5Error);
                  // Continue even if MT5 sync fails - local balance is updated
                }
              }
            }
          }
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        const failedStripePayment = await storage.getStripePaymentByIntentId(failedPayment.id);
        if (failedStripePayment) {
          await storage.updateDepositStatus(failedStripePayment.depositId, "Rejected");
          await storage.updateStripePaymentStatus(failedStripePayment.id, "failed");
        }
        break;

      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionMetadata = session.metadata;
        if (sessionMetadata) {
          // Find deposit by session ID
          const deposit = await storage.getDepositByTransactionId(session.id);
          if (deposit) {
            await storage.updateDepositStatus(deposit.id, "Approved");
            
            // Add amount to trading account
            if (sessionMetadata.tradingAccountId) {
              const account = await storage.getTradingAccount(sessionMetadata.tradingAccountId);
              if (account) {
                const depositAmount = session.amount_total! / 100;
                const newBalance = (parseFloat(account.balance) + depositAmount).toString();
                await storage.updateTradingAccount(sessionMetadata.tradingAccountId, { balance: newBalance });

                // Sync with MT5 if enabled
                if (process.env.MT5_ENABLED === "true" && account.type === "Live") {
                  try {
                    await mt5Service.updateBalance(
                      account.accountId,
                      depositAmount,
                      `Stripe checkout deposit: ${session.id}`
                    );
                    console.log(`MT5 balance updated for account ${account.accountId}: +$${depositAmount}`);
                  } catch (mt5Error) {
                    console.error("Failed to sync deposit with MT5:", mt5Error);
                    // Continue even if MT5 sync fails - local balance is updated
                  }
                }
              }
            }
          }
        }
        break;
    }

    res.json({ received: true });
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
      const requiredTypes = ["ID Proof", "Address Proof"];
      
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
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(400).json({ message: "Invalid request data" });
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

      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
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

      // Create notification for user
      await storage.createNotification({
        userId: document.userId,
        title: "Document Approved",
        message: `Your ${document.type} has been verified.`,
        type: "success",
      });

      // Log activity
      await logActivity(
        adminId,
        "approve_document",
        "document",
        req.params.id,
        `Approved ${document.type} for user ${document.userId}`
      );

      res.json(updated);
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
      const { username, password, email, fullName, role } = req.body;
      
      if (!username || !password || !email || !fullName || !role) {
        return res.status(400).json({ message: "All fields are required" });
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

      // Log activity
      await logActivity(
        adminId,
        "create_admin",
        "admin",
        newAdmin.id,
        `Created ${role} admin: ${username}`
      );

      const { password: _, ...adminWithoutPassword } = newAdmin;
      res.status(201).json(adminWithoutPassword);
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
      };

      res.json(stats);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

}
