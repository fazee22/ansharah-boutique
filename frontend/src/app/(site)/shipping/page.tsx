import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Delivery timelines, costs, and coverage.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping & Delivery"
      updatedAt="July 2026"
      sections={[
        {
          heading: "Processing Time",
          body: <p>Orders are dispatched within 2–5 business days of confirmation, from our atelier to your door.</p>,
        },
        {
          heading: "Delivery Estimates",
          body: (
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Major cities (Karachi, Lahore, Islamabad): 2–4 business days after dispatch.</li>
              <li>Other cities across Pakistan: 4–7 business days after dispatch.</li>
              <li>International shipping is available at checkout once that flow launches.</li>
            </ul>
          ),
        },
        {
          heading: "Shipping Costs",
          body: (
            <p>
              Standard delivery is complimentary on orders over PKR 15,000; a flat rate applies below
              that threshold, shown at checkout before you pay.
            </p>
          ),
        },
        {
          heading: "Order Tracking",
          body: (
            <p>
              Once your order ships, you can follow its status from your account&apos;s Order History — see
              the Order Status Timeline on each order for a step-by-step view.
            </p>
          ),
        },
        {
          heading: "Delays",
          body: (
            <p>
              Occasionally weather, courier volume, or customs (for international orders) can extend
              these estimates. We&apos;ll always let you know if your order is affected.
            </p>
          ),
        },
      ]}
    />
  );
}
