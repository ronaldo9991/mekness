import { defineConfig } from "drizzle-kit";
import path from "path";

const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://') || 
                   process.env.DATABASE_URL?.startsWith('postgres://');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isPostgres ? "postgresql" : "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || path.join(process.cwd(), "local.db"),
  },
});
