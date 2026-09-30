import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";

import "./styles.css";
import "./components.css";
import "./pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* import.meta.env.BASE_URL follows Vite's `base` config (see vite.config.js)
        — the React Router equivalent of main's runtime subpath-detection script,
        for deploying under a subdirectory instead of the domain root. */}
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
