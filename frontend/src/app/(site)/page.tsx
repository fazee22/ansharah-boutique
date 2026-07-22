import { Hero } from "@/components/home/hero";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { CollectionMarquee } from "@/components/home/collection-marquee";
import { NewArrivalsPreview } from "@/components/home/new-arrivals-preview";
import { SaleSection } from "@/components/home/sale-section";
import { BrandStory } from "@/components/home/brand-story";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { HomeSectionToggle } from "@/components/home/home-section-toggle";

/**
 * The homepage. Section order is deliberate: Hero (immediate impact)
 * -> Featured Collections (the two flagship edits) -> Collection
 * Marquee (browsable long-tail categories) -> New Arrivals (freshness)
 * -> Sale (a change of pace/tone) -> Brand Story (trust/emotion)
 * -> Why Choose Us (reassurance) -> Newsletter (capture intent)
 * -> Instagram (social proof) -> Footer (global, from the root layout).
 *
 * Featured Collections/New Arrivals/Sale/Newsletter/Instagram are
 * each wrapped in `HomeSectionToggle` (Phase 10) so the admin's real
 * Homepage Manager (Phase 7) can actually show/hide them — Hero,
 * Collection Marquee, Brand Story, and Why Choose Us stay
 * unconditional since the Homepage Manager was never scoped to
 * control those.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeSectionToggle setting="showFeaturedCollections">
        <FeaturedCollections />
      </HomeSectionToggle>
      <CollectionMarquee />
      <HomeSectionToggle setting="showNewArrivals">
        <NewArrivalsPreview />
      </HomeSectionToggle>
      <HomeSectionToggle setting="showSale">
        <SaleSection />
      </HomeSectionToggle>
      <BrandStory />
      <WhyChooseUs />
      <HomeSectionToggle setting="showNewsletter">
        <NewsletterSection />
      </HomeSectionToggle>
      <HomeSectionToggle setting="showInstagram">
        <InstagramGallery />
      </HomeSectionToggle>
    </>
  );
}
