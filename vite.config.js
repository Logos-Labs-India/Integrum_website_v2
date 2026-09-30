import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // VITE_API_BASE_URL is baked into the bundle at build time (Vite env vars
  // aren't readable at runtime). If it's unset, src/leads.js silently falls
  // back to http://localhost:4000 — harmless in dev, but in a production
  // build that means every visitor's browser tries to POST leads to their
  // own machine, always fails, and every form site-wide silently drops to
  // browser-local storage only, with nothing failing loudly to reveal it.
  if (command === "build" && !env.VITE_API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not set. A production build must not silently default to " +
      "http://localhost:4000 — set VITE_API_BASE_URL to the deployed lead API's base URL " +
      "before running `npm run build` (see DEPLOYMENT.md, section 5)."
    );
  }

  return {
    plugins: [react()],
  };
});
