import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { migrate } from "./db/migrate.js";
import { leadsRouter } from "./routes/leads.js";

const app = express();

// If this ever runs behind a reverse proxy/load balancer (nginx, an ALB,
// CloudFront to an origin server, etc.), req.ip needs `trust proxy` set —
// otherwise every request appears to come from the proxy's IP, and the
// per-IP rate limiter in routes/leads.js effectively applies globally
// instead of per-visitor. Uncomment once actually deployed behind one:
// app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    // No Origin header (curl, server-to-server) — allow.
    if (!origin) return callback(null, true);
    if (config.allowedOrigins.includes(origin)) return callback(null, true);
    // Vite's dev port varies (5173, 5174, ...) — don't make that a chore to track.
    if (!config.isProd && /^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    const err = new Error(`Origin not allowed: ${origin}`);
    err.status = 403;
    return callback(err);
  },
}));

// Resumes arrive base64-encoded in the JSON body; allow a generous limit.
app.use(express.json({ limit: "8mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leads", leadsRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// Catches anything thrown/passed-to-next above, including the CORS
// origin-rejection — without this, Express's default handler returns an
// opaque HTML 500 for every failure instead of a clean, diagnosable JSON body.
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, error: "Malformed JSON body" });
  }
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: status === 500 ? "Internal server error" : err.message });
});

async function start() {
  await migrate();
  app.listen(config.port, () => console.log(`Integrum lead API listening on :${config.port}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
