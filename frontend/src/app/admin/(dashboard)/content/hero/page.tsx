import { SlideManager } from "@/components/admin/content/slide-manager";

export default function AdminHeroBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Hero Banner</h1>
        <p className="text-body-sm text-muted-foreground">
          Upload, edit, reorder, and enable/disable the homepage's multi-slide hero banner.
        </p>
      </div>
      <SlideManager type="hero" showEditorialFields />
    </div>
  );
}
