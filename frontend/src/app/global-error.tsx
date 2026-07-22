"use client";

import { useEffect } from "react";

/**
 * Next.js's `global-error.tsx` convention — the one error boundary
 * that can catch a failure in the ROOT layout itself (fonts,
 * providers), which `(site)/error.tsx` and `admin/.../error.tsx`
 * cannot, since both render *inside* that root layout. Must define
 * its own `<html>`/`<body>` because it fully replaces the root layout
 * when triggered — no design-system components, no Tailwind classes
 * that depend on the root layout's font variables being present,
 * since that's exactly what may have failed.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          backgroundColor: "#f4f0e6",
          color: "#14140f",
        }}
      >
        <div style={{ textAlign: "center", padding: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 400, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ fontSize: "14px", color: "#5a5347", margin: "0 0 24px" }}>
            The application hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 28px",
              backgroundColor: "#14140f",
              color: "#fbf9f4",
              border: "none",
              borderRadius: "2px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
