// Base URL of the Integrum API (server/). Baked in at build time from
// VITE_API_BASE_URL — vite.config.js refuses a production build without it.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");
