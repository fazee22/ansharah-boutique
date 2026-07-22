export interface WebsiteSettings {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
  socialLinks: { platform: string; url: string }[];
}

export interface WhatsAppSettings {
  number: string;
  defaultMessage: string;
  floatingButtonEnabled: boolean;
  orderButtonEnabled: boolean;
  enabled: boolean;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImageUrl: string | null;
  twitterCard: string;
  robotsIndexable: boolean;
  sitemapEnabled: boolean;
}
export interface AboutSettings {
  missionImageUrl: string | null;
  visionImageUrl: string | null;
}

export interface HomepageSettings {
  showFeaturedCollections: boolean;
  showNewArrivals: boolean;
  showSale: boolean;
  showNewsletter: boolean;
  showInstagram: boolean;
  instagramHandle: string;
  brandStoryImageUrl: string | null;
}

export interface MarqueeSettings {
  speed: number;
  direction: "left" | "right";
  pauseOnHover: boolean;
  mobileSwipeEnabled: boolean;
}

export interface SaleSettings {
  bannerHeadline: string;
  bannerSubtext: string;
  defaultPercentage: number;
  timerEnabled: boolean;
  timerEndsAt: string | null;
}

export interface AllSettings {
  website: WebsiteSettings;
  whatsapp: WhatsAppSettings;
  seo: SeoSettings;
  homepage: HomepageSettings;
  about: AboutSettings;
  marquee: MarqueeSettings;
  sale: SaleSettings;
}

export type SettingsGroup = keyof AllSettings;
