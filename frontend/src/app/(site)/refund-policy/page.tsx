import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How and when refunds are issued.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund Policy"
      updatedAt="July 2026"
      intro="Most approved returns are issued as store credit — see our Return Policy for that flow. This page covers the cases where a monetary refund applies instead."
      sections={[
        {
          heading: "When a Refund Applies",
          body: (
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>An order is cancelled before it ships.</li>
              <li>An item is confirmed out of stock after your order was placed.</li>
              <li>A piece arrives damaged or materially different from what was ordered.</li>
            </ul>
          ),
        },
        {
          heading: "Refund Method",
          body: (
            <p>
              Refunds are issued to the original payment method. Cash-on-delivery orders are refunded via
              bank transfer — we&apos;ll ask for your account details when we confirm the refund.
            </p>
          ),
        },
        {
          heading: "Processing Time",
          body: (
            <p>
              Once approved, refunds are processed within 5–10 business days. Bank and card providers can
              take a few additional days to reflect the credit on your statement.
            </p>
          ),
        },
        {
          heading: "Questions About a Refund",
          body: <p>Reach out with your order number and we&apos;ll check the status for you.</p>,
        },
      ]}
    />
  );
}
