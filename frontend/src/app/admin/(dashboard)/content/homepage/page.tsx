import { HomepageSectionsForm } from "@/components/admin/content/homepage-sections-form";

export default function AdminHomepageManagerPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Homepage Manager</h1>
        <p className="text-body-sm text-muted-foreground">
          Control which sections appear on the homepage. Manage the Hero Banner and Auto Moving
          Slider from their own pages in the sidebar.
        </p>
      </div>
      <HomepageSectionsForm />
    </div>
  );
}
