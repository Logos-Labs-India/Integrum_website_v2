import React from "react";

// A crash anywhere in the component tree currently produces a blank white
// page with no way back for the visitor. This catches it and offers a way
// out instead, without needing any of the app's own components (which may
// be exactly what's broken) to render.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Uncaught error in component tree:", error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: 24, fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif",
      }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong.</h1>
        <p style={{ color: "#6C7E90", marginBottom: 20, maxWidth: 420 }}>
          This page hit an unexpected error. Reloading usually fixes it.
        </p>
        <button
          onClick={() => { this.setState({ error: null }); window.location.href = "/"; }}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "#014976", color: "#fff", fontSize: 15, cursor: "pointer",
          }}
        >
          Back to home
        </button>
      </div>
    );
  }
}
