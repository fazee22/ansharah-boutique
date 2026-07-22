"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { fadeUp, staggerContainer } from "@/lib/animations";

const posts = Array.from({ length: 6 }, (_, index) => ({
  id: `ig-${index + 1}`,
  label: `Instagram post ${index + 1}`,
}));

/**
 * Instagram gallery placeholder grid — UI shell only. No Instagram
 * API integration exists yet; each tile is a `MediaPlaceholder` with
 * the same hover treatment real embedded posts will use once that
 * integration is wired up.
 */
function InstagramGallery() {
  return (
    <Section tone="porcelain" spacing="lg">
      <SectionTitle
        eyebrow="@verriere"
        title="Follow the Edit"
        description="Styled by our community, worn beyond the studio."
        align="center"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px 0px" }}
        variants={staggerContainer(0.06)}
        className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
      >
        {posts.map((post) => (
          <motion.a
            key={post.id}
            variants={fadeUp}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden rounded-md"
          >
            <MediaPlaceholder
              ratio="square"
              label={post.label}
              className="transition-transform duration-[900ms] ease-luxury-ease group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-400 ease-luxury-ease group-hover:bg-ink/50">
              <Instagram
                className="h-6 w-6 text-porcelain opacity-0 transition-opacity duration-400 ease-luxury-ease group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  );
}

export { InstagramGallery };
