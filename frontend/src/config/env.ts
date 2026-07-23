/**
 * Centralized, validated access to environment variables.
 *
 * Import from `@/config/env` instead of reading `process.env` directly
 * throughout the codebase — this is the single place that knows which
 * variables are required, gives a clear startup error if one is
 * missing, and gives every consumer a typed value instead of
 * `string | undefined`.
 */

function readEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env.local against .env.example.`,
    );
  }
  return value;
}

export const env = {
  api: {
    baseUrl: readEnv("NEXT_PUBLIC_API_BASE_URL", "https://ansharah-boutique-production.up.railway.app/api/v1"),
    timeoutMs: Number(readEnv("NEXT_PUBLIC_API_TIMEOUT_MS", "15000")),
  },
  app: {
    name: readEnv("NEXT_PUBLIC_APP_NAME", "Luxury Fashion"),
    url: readEnv("NEXT_PUBLIC_APP_URL", "http://127.0.0.1:3000"),
    env: readEnv("NEXT_PUBLIC_APP_ENV", "development") as
      | "development"
      | "staging"
      | "production",
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
  },
  auth: {
    cookieName: readEnv("NEXT_PUBLIC_AUTH_COOKIE_NAME", "lux_session"),
  },
  features: {
    adminDashboard: process.env.NEXT_PUBLIC_FEATURE_ADMIN_DASHBOARD === "true",
    wishlist: process.env.NEXT_PUBLIC_FEATURE_WISHLIST === "true",
  },
  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "",
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  },
} as const;

export const isProduction = env.app.env === "production";
export const isDevelopment = env.app.env === "development";
