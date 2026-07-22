import { AboutPageForm } from "@/components/admin/content/about-page-form";

export default function AdminAboutPageManagerPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">About Page</h1>
        <p className="text-body-sm text-muted-foreground">
          Upload the images shown in the storefront&apos;s About page.
        </p>
      </div>
      <AboutPageForm />
    </div>
  );
}