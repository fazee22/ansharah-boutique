export type SlideType = "hero" | "marquee";

export interface AdminSlide {
  id: number;
  type: SlideType;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaLabel: string | null;
  position: number;
  isActive: boolean;
}

export interface SlideFormFields {
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  ctaLabel?: string;
  isActive?: boolean;
}
