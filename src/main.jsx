import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { loadContent } from "./content/cms";

import "./styles.css";
import "./components.css";
import "./pages.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
const path = window.location.pathname.slice(base.length) || "/";

async function boot() {
  // The CMS admin is its own app at /admin — no site chrome, and it works
  // from the built-in defaults plus the API rather than published content.
  if (path === "/admin" || path.startsWith("/admin/")) {
    const { AdminApp } = await import("./admin/AdminApp");
    root.render(
      <React.StrictMode>
        <ErrorBoundary><AdminApp /></ErrorBoundary>
      </React.StrictMode>
    );
    return;
  }

  // Published CMS content is written into the data modules BEFORE the app
  // (and so every page) is imported — see content/cms.js. ?cms-preview shows
  // the signed-in admin's unpublished drafts instead.
  const wantsPreview = new URLSearchParams(window.location.search).has("cms-preview");
  const { preview } = await loadContent({ preview: wantsPreview });
  const { App } = await import("./App");

  root.render(
    <React.StrictMode>
      {/* import.meta.env.BASE_URL follows Vite's `base` config (see vite.config.js)
          — the React Router equivalent of main's runtime subpath-detection script,
          for deploying under a subdirectory instead of the domain root. */}
      <ErrorBoundary>
        {preview && <div className="cms-preview-bar">Preview — showing unpublished changes. Only signed-in admins see this.</div>}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

boot();
