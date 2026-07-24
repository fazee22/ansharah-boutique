import type { Metadata } from "next";
import { Compass, Leaf, Sparkles } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Reveal } from "@/components/shared/reveal";
import { publicSettingsService } from "@/services/api/settings.service";
import { siteConfig } from "@/config/site";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "About Us",
  description: `The story, mission, and values behind ${siteConfig.name}.`,
};

const values = [
  {
    icon: Leaf,
    title: "Considered Sourcing",
    body: "Every fabric is tested by hand before it becomes a pattern — nothing enters production on trend alone.",
  },
  {
    icon: Sparkles,
    title: "Small, Deliberate Runs",
    body: "We build in small batches rather than mass volume, so quality never gets rushed to hit a season deadline.",
  },
  {
    icon: Compass,
    title: "Made to Last",
    body: "The measure of a piece isn't the first wear — it's the third season, still exactly as considered as day one.",
  },
];

export default async function AboutPage() {
  const settings = await publicSettingsService.getAll();
  const missionImageUrl = settings.about?.missionImageUrl;
  const visionImageUrl = settings.about?.visionImageUrl;

  return (
    <div className="flex flex-col">
      <Section tone="ink" spacing="lg" className="text-center">
        <Reveal className="mx-auto flex max-w-2xl flex-col gap-4">
          <span className="font-mono text-overline uppercase tracking-widest text-brass-light">Our Story</span>
          <h1 className="font-display text-display-md font-light text-porcelain sm:text-display-lg">
            Made with intention, worn with ease
          </h1>
          <p className="text-body-md text-porcelain/75">
            {siteConfig.name} began with a simple frustration: luxury fashion that looked considered in
            photographs but rarely felt considered to actually live in. We set out to build the opposite —
            pieces cut for how you move, not just how you pose.
          </p>
        </Reveal>
      </Section>

      <Section tone="canvas" spacing="lg">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-overline uppercase tracking-widest text-brass-dark">
                Our Mission
              </span>
              <h2 className="font-display text-display-sm font-light text-foreground">
                Slow down the wardrobe, without slowing down style
              </h2>
              <p className="text-body-md text-muted-foreground">
                We exist to make considered dressing effortless — fabric that earns its place, cuts that
                don&apos;t chase a single season, and a shopping experience that respects your time as much
                as your taste.
              </p>
            </div>
          </Reveal>
          <div className="order-1 overflow-hidden rounded-lg lg:order-2">
            {missionImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary image
              <img src={missionImageUrl} alt="Our mission" className="aspect-square w-full object-cover" />
            ) : (
              <MediaPlaceholder ratio="square" tone="evergreen" label="Our mission" />
            )}
          </div>
        </div>
      </Section>

      <Section tone="porcelain" spacing="lg">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="overflow-hidden rounded-lg">
            {visionImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary image
              <img src={visionImageUrl} alt="Our vision" className="aspect-square w-full object-cover" />
            ) : (
              <MediaPlaceholder ratio="square" tone="canvas" label="Our vision" />
            )}
          </div>
          <Reveal>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-overline uppercase tracking-widest text-brass-dark">
                Our Vision
              </span>
              <h2 className="font-display text-display-sm font-light text-foreground">
                A wardrobe you reach for, season after season
              </h2>
              <p className="text-body-md text-muted-foreground">
                We want {siteConfig.name} to be the label you think of not for a single occasion, but for
                the pieces that quietly anchor your wardrobe year after year — considered enough to still
                feel right long after the trend cycle has moved on.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" spacing="lg">
        <SectionTitle eyebrow="What Guides Us" title="Our Values" align="center" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <Reveal key={title} className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-brass-dark">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-heading-sm text-foreground">{title}</h3>
              <p className="max-w-[28ch] text-body-sm text-muted-foreground">{body}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}