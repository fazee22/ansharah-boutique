"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import { imageUploadService } from "@/services/api/admin/image-upload.service";
import { toast } from "@/store/toast-store";
import type { AboutSettings } from "@/types/admin/settings";

const FIELDS: { key: keyof AboutSettings; label: string }[] = [
  { key: "missionImageUrl", label: "Our Mission Image" },
  { key: "visionImageUrl", label: "Our Vision Image" },
];

function AboutPageForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("about");
  const [values, setValues] = useState<AboutSettings | null>(null);
  const [uploadingKey, setUploadingKey] = useState<keyof AboutSettings | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (data?.about && !values) setValues(data.about);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function handleImageSelect(key: keyof AboutSettings, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !values) return;

    setUploadingKey(key);
    try {
      const uploaded = await imageUploadService.upload(file, "about");
      setValues({ ...values, [key]: uploaded.url });
      toast("Image uploaded — click Save to publish it.", "success");
    } catch {
      toast("Couldn't upload this image.", "error");
    } finally {
      setUploadingKey(null);
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
      className="flex flex-col gap-6 rounded-lg border border-hairline bg-card p-6"
    >
      <div>
        <h2 className="font-display text-heading-sm text-foreground">About Page Images</h2>
        <p className="mt-1 text-caption text-muted-foreground">
          The two images on the storefront&apos;s About page (&ldquo;Our Mission&rdquo; and &ldquo;Our Vision&rdquo;).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              {field.label}
            </label>
            <input
              ref={(el) => {
                fileInputRefs.current[field.key] = el;
              }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => handleImageSelect(field.key, event)}
            />
            <button
              type="button"
              onClick={() => fileInputRefs.current[field.key]?.click()}
              disabled={uploadingKey === field.key}
              className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-hairline bg-canvas transition-colors hover:border-brass disabled:opacity-60"
            >
              {values[field.key] ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin image preview, arbitrary Cloudinary URL
                <img src={values[field.key] ?? undefined} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground">
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  {uploadingKey === field.key ? "Uploading…" : "Click to upload"}
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save About Page Settings
      </Button>
    </form>
  );
}

export { AboutPageForm };