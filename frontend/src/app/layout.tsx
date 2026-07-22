import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { env } from "@/config/env";
import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/shared/toaster";
import { AnalyticsScripts } from "@/components/shared/analytics-scripts";
import "@/styles/globals.css";

/**
 * Root layout — deliberately minimal (html/body/fonts/providers/
 * Toaster only). The public storefront's chrome (Header/Footer, skip
 * link) lives in `(site)/layout.tsx`; the admin dashboard's chrome
 * (sidebar/topbar) lives in `admin/layout.tsx`. Splitting it this way
 * (Next.js route groups) is what lets `/admin/*` render without the
 * storefront header/footer ever mounting — a route group's
 * parentheses are excluded from the URL, so this refactor changed no
 * existing link or URL in the app.
 *
 * `metadataBase` (Phase 9) is what lets every page's relative OG/
 * Twitter image paths resolve to absolute URLs without each one
 * repeating the site origin — required for social previews to work
 * at all once this is deployed somewhere other than localhost.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.app.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.seo.defaultDescription,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.seo.defaultDescription,
  },
  alternates: {
    canonical: "/",
  },
  verification: env.analytics.googleSiteVerification
    ? { google: env.analytics.googleSiteVerification }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#14140f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
