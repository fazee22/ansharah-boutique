/**
 * Static site-wide configuration that is not sensitive and does not
 * change between environments (contrast with `env.ts`, which holds
 * environment-dependent values).
 */
export const siteConfig = {
  name: "Ansharah Boutique",
  tagline: "Feel the Fabric",
  /**
   * WhatsApp Business number in international format (no leading
   * "+", no spaces) used to build "Order on WhatsApp" links — see
   * `lib/whatsapp.ts`. Placeholder value; admin-configurable in a
   * future phase (env var or admin settings), not hard-coded like
   * this long-term.
   */
  whatsAppNumber: "923317790457",
  /**
   * Static fallback contact details shown on the Contact page footer,
   * etc. Mirrors the defaults seeded into the admin's Website
   * Settings (`backend/database/seeders/SettingsSeeder.php`) —
   * wiring this page to read the live, admin-editable value instead
   * is the same "storefront still on static data" follow-up noted
   * throughout Phases 6–7.
   */
  contact: {
    email: "hello@verriere.test",
    phone: "+92 300 1234567",
    address: "Karachi, Pakistan",
  },
  defaultLocale: "en",
  supportedLocales: ["en"] as const,
  defaultCurrency: "PKR",
  supportedCurrencies: ["PKR", "USD", "AED"] as const,
  pagination: {
    defaultPageSize: 24,
    maxPageSize: 96,
  },
  seo: {
    defaultDescription:
      "A premium fashion destination for considered, contemporary luxury.",
  },
} as const;

export type SupportedCurrency = (typeof siteConfig.supportedCurrencies)[number];
export type SupportedLocale = (typeof siteConfig.supportedLocales)[number];
