import pg from "pg";

const { Pool } = pg;

const useSSL = String(process.env.PGSSL_INSECURE || "").toLowerCase() === "true";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});
