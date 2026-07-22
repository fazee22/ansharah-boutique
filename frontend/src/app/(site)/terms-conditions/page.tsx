import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy/policy-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that govern your use of ${siteConfig.name}.`,
};

export default function TermsConditionsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      updatedAt="July 2026"
      intro="By using this site or placing an order, you agree to the terms below."
      sections={[
        {
          heading: "Use of This Site",
          body: (
            <p>
              You may browse and shop this site for personal, non-commercial use. Product photography,
              copy, and the overall design are the property of {siteConfig.name} and may not be
              reproduced without permission.
            </p>
          ),
        },
        {
          heading: "Product Availability & Pricing",
          body: (
            <p>
              We work to keep stock levels and prices accurate, but availability isn&apos;t guaranteed until
              your order is confirmed. Prices are listed in PKR and may change without notice; the price at
              the time you place an order is the price you&apos;ll pay for that order.
            </p>
          ),
        },
        {
          heading: "Orders & Payment",
          body: (
            <p>
              Placing an order is an offer to purchase, which we may accept or decline (for example, if an
              item turns out to be out of stock). Accepted payment methods are shown at checkout.
            </p>
          ),
        },
        {
          heading: "Account Responsibility",
          body: (
            <p>
              You&apos;re responsible for keeping your account credentials secure and for all activity under
              your account. Let us know immediately if you suspect unauthorized access.
            </p>
          ),
        },
        {
          heading: "Limitation of Liability",
          body: (
            <p>
              {siteConfig.name} is not liable for indirect or incidental damages arising from use of this
              site, to the fullest extent permitted by law.
            </p>
          ),
        },
        {
          heading: "Changes to These Terms",
          body: <p>We may update these terms from time to time; continued use of the site means you accept the current version.</p>,
        },
      ]}
    />
  );
}
