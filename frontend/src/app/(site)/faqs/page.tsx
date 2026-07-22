import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, shipping, returns, and care.",
};

const FAQ_GROUPS: { category: string; items: { question: string; answer: string }[] }[] = [
  {
    category: "Ordering",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Add pieces to your bag from any product page, then review your bag and check out. You'll receive an order confirmation by email once it's placed.",
      },
      {
        question: "Can I change or cancel my order after placing it?",
        answer:
          "Contact us as soon as possible with your order number. We can usually accommodate changes before an order ships, but can't guarantee it once it's already dispatched.",
      },
      {
        question: "Do you offer Cash on Delivery?",
        answer: "Yes — Cash on Delivery, card, and bank transfer are all available at checkout.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Major cities typically see delivery in 2–4 business days after dispatch; other cities in 4–7 business days. See our Shipping Policy for full detail.",
      },
      {
        question: "Do you ship internationally?",
        answer: "International shipping is coming soon — for now we ship across Pakistan.",
      },
      {
        question: "How do I track my order?",
        answer: "Once your order ships, its status and timeline are visible from your Account's Order History.",
      },
    ],
  },
  {
    category: "Returns & Sizing",
    items: [
      {
        question: "What's your return policy?",
        answer:
          "Unworn pieces with tags attached can be returned within 7 days of delivery for store credit. Sale items are final. Full detail is on our Return Policy page.",
      },
      {
        question: "How do I know what size to order?",
        answer:
          "Each product page lists the fabric and fit notes. If you're between sizes or unsure, reach out via our Contact page before ordering and we'll help.",
      },
    ],
  },
  {
    category: "Product Care",
    items: [
      {
        question: "How should I care for my pieces?",
        answer:
          "Care instructions are specific to each fabric and listed on every product page's Care Guide tab — most pieces prefer a gentle hand wash or dry clean for the first wash.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <Container width="narrow" className="flex flex-col gap-10 py-12 sm:py-16">
      <SectionTitle
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Can't find what you're looking for? Our team is happy to help directly."
      />

      <div className="flex flex-col gap-10">
        {FAQ_GROUPS.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <h2 className="font-mono text-overline uppercase tracking-widest text-brass-dark">
              {group.category}
            </h2>
            <Accordion type="multiple" className="w-full">
              {group.items.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-lg border border-hairline bg-porcelain p-8 text-center">
        <p className="text-body-md text-ink">Still have a question?</p>
        <Link href={ROUTES.contact} className="font-mono text-caption uppercase tracking-widest text-brass-dark hover:underline">
          Get in touch →
        </Link>
      </div>
    </Container>
  );
}
