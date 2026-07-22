import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "How returns and exchanges work.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Returns & Exchanges"
      updatedAt="July 2026"
      intro="We want you to love what you ordered. If something isn't right, here's how returns work."
      sections={[
        {
          heading: "Return Window",
          body: (
            <p>
              Unworn, unwashed pieces with original tags attached may be returned within 7 days of
              delivery for store credit. The return window starts the day your order is marked delivered.
            </p>
          ),
        },
        {
          heading: "What Can't Be Returned",
          body: (
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Sale items — marked final sale at checkout.</li>
              <li>Pieces that have been worn, washed, or altered.</li>
              <li>Items returned without their original tags.</li>
            </ul>
          ),
        },
        {
          heading: "How to Start a Return",
          body: (
            <p>
              Contact us with your order number and the reason for return. We&apos;ll confirm eligibility and
              share the return address — please wait for that confirmation before sending anything back.
            </p>
          ),
        },
        {
          heading: "Exchanges",
          body: (
            <p>
              Need a different size instead? Let us know when you start your return and we&apos;ll hold the
              replacement piece for you where stock allows.
            </p>
          ),
        },
        {
          heading: "Store Credit",
          body: (
            <p>
              Approved returns are issued as store credit once the piece is received and inspected,
              typically within 5–7 business days.
            </p>
          ),
        },
      ]}
    />
  );
}
