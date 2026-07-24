"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Container } from "@/components/shared/container";
import { useHeroSlides } from "@/hooks/use-hero-slides";
import { heroSlides as staticHeroSlides } from "@/constants/hero-slides";
import { ROUTES } from "@/constants/routes";
import { optimizeImage } from "@/lib/optimize-image";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;
const EASE = [0.16, 1, 0.3, 1] as const;

interface NormalizedSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tone: "canvas" | "evergreen" | "ink";
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const FALLBACK_TONES = ["canvas", "evergreen", "ink"] as const;

const overlayTone: Record<string, string> = {
  canvas: "from-ink/70 via-ink/30 to-transparent",
  evergreen: "from-ink/75 via-ink/35 to-transparent",
  ink: "from-ink/80 via-ink/40 to-transparent",
};

function Hero() {
  const { data: adminSlides, isLoading } = useHeroSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides: NormalizedSlide[] = useMemo(() => {
    if (adminSlides && adminSlides.length > 0) {
      return adminSlides.map((slide, index) => ({
        id: String(slide.id),
        eyebrow: "Featured",
        title: slide.title ?? "",
        description: slide.subtitle ?? "",
        imageUrl: slide.imageUrl,
        tone: FALLBACK_TONES[index % FALLBACK_TONES.length]!,
        primaryCta: { label: slide.ctaLabel ?? "Shop Now", href: slide.linkUrl ?? ROUTES.newArrivals },
        secondaryCta: { label: "Explore Collection", href: ROUTES.collections },
      }));
    }

    return staticHeroSlides.map((slide) => ({
      id: slide.id,
      eyebrow: slide.eyebrow,
      title: slide.title,
      description: slide.description,
      imageUrl: null,
      tone: slide.tone,
      primaryCta: slide.primaryCta,
      secondaryCta: slide.secondaryCta,
    }));
  }, [adminSlides]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  if (isLoading) {
    return <section className="h-[88svh] min-h-[560px] w-full bg-ink sm:h-[92svh]" aria-hidden="true" />;
  }

  const slide = slides[activeIndex]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative flex h-[88svh] min-h-[560px] w-full items-end overflow-hidden bg-ink sm:h-[92svh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: EASE }, scale: { duration: 6.5, ease: "linear" } }}
          className="absolute inset-0"
          aria-hidden={false}
        >
          {slide.imageUrl ? (
  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary hero image, arbitrary external URL
 <img src={optimizeImage(slide.imageUrl, 1600)} alt={slide.title} className="h-full w-full object-cover" />
) : (
  <MediaPlaceholder ratio="wide" tone={slide.tone} label={slide.title} className="h-full w-full" />
)}
          <div className={cn("absolute inset-0 bg-gradient-to-t", overlayTone[slide.tone])} />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 pb-16 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EASE, staggerChildren: 0.08 }}
            className="flex max-w-2xl flex-col gap-5 text-porcelain"
          >
            <span className="font-mono text-overline uppercase tracking-widest text-brass-light">
              {slide.eyebrow}
            </span>
            <h1 className="font-display text-display-md font-light leading-[1.05] sm:text-display-xl">
              {slide.title}
            </h1>
            <p className="max-w-lg text-body-md text-porcelain/85">{slide.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button asChild variant="brass" size="lg">
                <Link href={slide.primaryCta.href}>
                  {slide.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-porcelain/60 text-porcelain hover:bg-porcelain hover:text-ink"
              >
                <Link href={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>

      {slides.length > 1 ? (
        <div className="absolute bottom-6 right-6 z-10 flex gap-2 sm:bottom-10 sm:right-12">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show slide: ${item.title}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
              className="group/dot flex h-6 w-6 items-center justify-center"
            >
              <span
                className={cn(
                  "h-1.5 rounded-pill bg-porcelain/40 transition-all duration-400 ease-luxury-ease",
                  index === activeIndex ? "w-6 bg-brass" : "w-1.5 group-hover/dot:bg-porcelain/70",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { Hero };