import "dotenv/config";
import express from "express";
import cors from "cors";
import { migrate } from "./db/migrate.js";
import { leadsRouter } from "./routes/leads.js";

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const isProd = process.env.NODE_ENV === "production";

const app = express();

app.use(cors({
  origin(origin, callback) {
    // No Origin header (curl, server-to-server) — allow.
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Vite's dev port varies (5173, 5174, ...) — don't make that a chore to track.
    if (!isProd && /^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    return callback(new Error(`Origin not allowed: ${origin}`));
  },
}));

// Resumes arrive base64-encoded in the JSON body; allow a generous limit.
app.use(express.json({ limit: "8mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leads", leadsRouter);

async function start() {
  await migrate();
  app.listen(PORT, () => console.log(`Integrum lead API listening on :${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
