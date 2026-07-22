"use client";

import { motion } from "framer-motion";
import { Gem, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { fadeUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    id: "quality",
    icon: Gem,
    title: "Premium Quality",
    description: "Fabrics sourced and tested by hand before a single stitch is cut.",
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Fast Delivery",
    description: "Dispatched within 48 hours, tracked from our atelier to your door.",
  },
  {
    id: "payment",
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Encrypted checkout with the payment method you already trust.",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Customer Support",
    description: "A real person, not a queue — for anything before or after you buy.",
  },
];

function WhyChooseUs() {
  return (
    <Section tone="canvas" spacing="lg">
      <SectionTitle
        eyebrow="Why Verrière"
        title="A Luxury Experience, End to End"
        align="center"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px 0px" }}
        variants={staggerContainer(0.1)}
        className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map(({ id, icon: Icon, title, description }) => (
          <motion.div
            key={id}
            variants={fadeUp}
            className="group flex flex-col items-center gap-4 rounded-lg px-4 py-2 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-brass-dark transition-all duration-500 ease-luxury-ease group-hover:-translate-y-1 group-hover:border-brass group-hover:shadow-soft">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="font-display text-heading-sm text-foreground">{title}</h3>
            <p className="max-w-[26ch] text-body-sm text-muted-foreground">{description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

export { WhyChooseUs };
