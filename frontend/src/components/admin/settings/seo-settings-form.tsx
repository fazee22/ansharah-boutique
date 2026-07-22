"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/admin/products/tag-input";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import type { SeoSettings } from "@/types/admin/settings";

const inputClass =
  "h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

/** Reuses `TagInput` (built for product tags, Phase 6) for the keywords list — same "type and press Enter" interaction, no reason to build a second chip input. */
function SeoSettingsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("seo");
  const [values, setValues] = useState<SeoSettings | null>(null);

  useEffect(() => {
    if (data?.seo && !values) setValues(data.seo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading || !values) {
    return <p className="text-caption text-muted-foreground">Loading settings…</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (values) update.mutate(values);
      }}
      className="flex flex-col gap-5 rounded-lg border border-hairline bg-card p-6"
    >
      <h2 className="font-display text-heading-sm text-foreground">Homepage SEO</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="seo-title" className={labelClass}>
          Default Meta Title <span className="normal-case text-muted-foreground/70">({values.defaultTitle.length}/70)</span>
        </label>
        <input
          id="seo-title"
          maxLength={70}
          value={values.defaultTitle}
          onChange={(e) => setValues({ ...values, defaultTitle: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="seo-description" className={labelClass}>
          Meta Description <span className="normal-case text-muted-foreground/70">({values.defaultDescription.length}/160)</span>
        </label>
        <textarea
          id="seo-description"
          rows={3}
          maxLength={160}
          value={values.defaultDescription}
          onChange={(e) => setValues({ ...values, defaultDescription: e.target.value })}
          className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Keywords</span>
        <TagInput value={values.keywords} onChange={(keywords) => setValues({ ...values, keywords })} placeholder="Add a keyword and press Enter" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="seo-og-image" className={labelClass}>Open Graph Image URL</label>
        <input
          id="seo-og-image"
          value={values.ogImageUrl ?? ""}
          onChange={(e) => setValues({ ...values, ogImageUrl: e.target.value })}
          placeholder="https://…"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="seo-twitter-card" className={labelClass}>Twitter Card Type</label>
        <select
          id="seo-twitter-card"
          value={values.twitterCard}
          onChange={(e) => setValues({ ...values, twitterCard: e.target.value })}
          className={inputClass}
        >
          <option value="summary">Summary</option>
          <option value="summary_large_image">Summary Large Image</option>
        </select>
      </div>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Allow Search Engines to Index (robots)</span>
        <Switch
          checked={values.robotsIndexable}
          onCheckedChange={(checked) => setValues({ ...values, robotsIndexable: checked })}
        />
      </label>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Sitemap Generation</span>
        <Switch
          checked={values.sitemapEnabled}
          onCheckedChange={(checked) => setValues({ ...values, sitemapEnabled: checked })}
        />
      </label>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save SEO Settings
      </Button>
    </form>
  );
}

export { SeoSettingsForm };
