import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { createServer } from "http";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";

const app = express();
const isVercel = Boolean(process.env.VERCEL);

// Session configuration - will be updated in bootstrap() for PostgreSQL store
app.use(session({
  secret: process.env.SESSION_SECRET || "mekness-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" && !process.env.RAILWAY_ENVIRONMENT,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  }
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '50mb', // Increase limit for file uploads
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});


async function bootstrap(): Promise<{ app: express.Express; server: Server }> {
  // Configure PostgreSQL session store in production
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
  const isPostgres = databaseUrl?.startsWith('postgresql://') || 
                     databaseUrl?.startsWith('postgres://');
  
  if (process.env.NODE_ENV === "production" && isPostgres) {
    try {
      const pgSession = (await import("connect-pg-simple")).default(session);
      const { Pool } = await import("pg");
      
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl?.includes('sslmode=require') || databaseUrl?.includes('shuttle.proxy.rlwy.net')
          ? { rejectUnauthorized: false }
          : undefined,
      });
      
      const sessionStore = new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
      });
      
      // Update session middleware with PostgreSQL store
      app.use(session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET || "mekness-secret-key-change-in-production",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // Railway uses HTTP internally
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
        }
      }));
      
      log("✅ Using PostgreSQL session store");
    } catch (error) {
      log("⚠️ Warning: Failed to initialize PostgreSQL session store:", error);
      log("   Sessions will use MemoryStore (not recommended for production)");
    }
  } else if (process.env.NODE_ENV === "production") {
    log("⚠️ Warning: Using MemoryStore for sessions (not recommended for production)");
    log("   Set DATABASE_URL to use PostgreSQL session store");
  }

  // Wait for database connection to be established
  try {
    const { dbInit, ensureDbReady } = await import("./db.js");
    await dbInit;
    await ensureDbReady();
    log("✅ Database connection established");
  } catch (error) {
    log("⚠️ Warning: Database connection failed:", error);
    // Continue anyway - connection might be retried
  }

  // Initialize database schema first
  try {
    const { initializeDatabase } = await import("./db.js");
    await initializeDatabase();
  } catch (error) {
    log("⚠️ Warning: Database initialization failed:", error);
    log("💡 If using PostgreSQL, run: npm run db:push");
    // Continue anyway - schema might already exist
  }

  // Seed database with initial data
  try {
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } catch (error) {
    log("⚠️ Warning: Database seeding failed (may already be seeded):", error);
  }

  await registerRoutes(app);
  const httpServer = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (!isVercel && app.get("env") === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  if (isVercel) {
    return { app, server: httpServer };
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  return { app, server: httpServer };
}

const ready = bootstrap();

export default async function handler(req: any, res: any) {
  const { app: readyApp } = await ready;
  return readyApp(req, res);
}
