"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import { imageUploadService } from "@/services/api/admin/image-upload.service";
import { toast } from "@/store/toast-store";
import type { HomepageSettings } from "@/types/admin/settings";

const SECTION_TOGGLES: { key: keyof Omit<HomepageSettings, "instagramHandle" | "brandStoryImageUrl">; label: string }[] = [
  { key: "showFeaturedCollections", label: "Featured Collections" },
  { key: "showNewArrivals", label: "New Arrivals Section" },
  { key: "showSale", label: "Sale Section" },
  { key: "showNewsletter", label: "Newsletter Section" },
  { key: "showInstagram", label: "Instagram Section" },
];

function HomepageSectionsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("homepage");
  const [values, setValues] = useState<HomepageSettings | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.homepage && !values) setValues(data.homepage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !values) return;

    setIsUploading(true);
    try {
      const uploaded = await imageUploadService.upload(file, "homepage");
      setValues({ ...values, brandStoryImageUrl: uploaded.url });
      toast("Image uploaded — click Save to publish it.", "success");
    } catch {
      toast("Couldn't upload this image.", "error");
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading || !values) {
    return <p className="text-caption text-muted-foreground">Loading settings…</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        update.mutate(values);
      }}
      className="flex flex-col gap-5 rounded-lg border border-hairline bg-card p-6"
    >
      <h2 className="font-display text-heading-sm text-foreground">Homepage Sections</h2>
      <p className="text-caption text-muted-foreground">
        Show or hide entire sections of the homepage without editing any code.
      </p>

      <div className="flex flex-col gap-3">
        {SECTION_TOGGLES.map((toggle) => (
          <label key={toggle.key} className="flex items-center justify-between border-b border-hairline pb-3 last:border-b-0 last:pb-0">
            <span className="text-body-sm text-ink">{toggle.label}</span>
            <Switch
              checked={values[toggle.key]}
              onCheckedChange={(checked) => setValues({ ...values, [toggle.key]: checked })}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="instagram-handle" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Instagram Handle
        </label>
        <input
          id="instagram-handle"
          value={values.instagramHandle}
          onChange={(event) => setValues({ ...values, instagramHandle: event.target.value })}
          className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Brand Story Image (&ldquo;Our Story&rdquo; section)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-md border border-dashed border-hairline bg-canvas transition-colors hover:border-brass disabled:opacity-60"
        >
          {values.brandStoryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin image preview, arbitrary Cloudinary URL
            <img src={values.brandStoryImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground">
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              {isUploading ? "Uploading…" : "Click to upload"}
            </span>
          )}
        </button>
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save Homepage Settings
      </Button>
    </form>
  );
}

export { HomepageSectionsForm };