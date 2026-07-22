import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Removes the "X-Powered-By: Next.js" response header — a small
  // but real piece of security-through-obscurity (no reason to
  // advertise the exact framework/version to a would-be attacker).
  poweredByHeader: false,

  compress: true,

  images: {
    // Cloudinary is the sole external image origin for Phase 1.
    // Add further remote patterns here as integrations are introduced.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // Re-enable once every route referenced in `constants/navigation.ts`
    // and `constants/routes.ts` has a corresponding page (Phase 3+) —
    // until then, typed routes would fail to compile against links
    // that intentionally point at not-yet-built pages.
    typedRoutes: false,
    // Phase 9: only import the specific icons/exports actually used
    // from these packages into each page's bundle, instead of the
    // whole library — meaningfully smaller client JS with zero code
    // changes required at call sites.
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Fonts and other build-hashed static assets are safe to cache
        // for a full year — their filename changes whenever the
        // content does, so a stale cache is never actually stale.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
