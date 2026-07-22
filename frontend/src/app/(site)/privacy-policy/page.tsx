import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy/policy-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updatedAt="July 2026"
      intro={`This policy explains what information ${siteConfig.name} collects when you shop with us, how we use it, and the choices you have.`}
      sections={[
        {
          heading: "Information We Collect",
          body: (
            <>
              <p>
                When you create an account, place an order, or subscribe to our newsletter, we collect
                information you provide directly — your name, email address, phone number, and shipping or
                billing address.
              </p>
              <p>
                We also collect information automatically as you browse: pages viewed, products you&apos;ve
                shown interest in, and general device/browser information, used to keep the site working
                correctly and to understand how it&apos;s used.
              </p>
            </>
          ),
        },
        {
          heading: "How We Use Your Information",
          body: (
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>To process and fulfill your orders, including shipping and customer support.</li>
              <li>To send order confirmations, shipping updates, and — only if you&apos;ve opted in — newsletter emails.</li>
              <li>To improve the site, our product range, and your shopping experience.</li>
              <li>To detect and prevent fraud or abuse of our services.</li>
            </ul>
          ),
        },
        {
          heading: "How We Protect Your Information",
          body: (
            <p>
              Your account is protected by industry-standard authentication, and payment information is
              never stored on our servers. Access to customer data within our team is limited to what&apos;s
              needed to do the job — fulfilling orders, responding to support requests.
            </p>
          ),
        },
        {
          heading: "Your Choices",
          body: (
            <p>
              You can review and update your account details at any time from your{" "}
              <span className="text-ink">Account</span> dashboard, unsubscribe from marketing emails using
              the link in any newsletter, and request that we delete your account and associated data by
              contacting us.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: <p>Questions about this policy can be sent to {siteConfig.name}&apos;s support team via our Contact page.</p>,
        },
      ]}
    />
  );
}
