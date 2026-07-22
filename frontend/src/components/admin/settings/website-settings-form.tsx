"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import type { WebsiteSettings } from "@/types/admin/settings";

const inputClass =
  "h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

function WebsiteSettingsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("website");
  const [values, setValues] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    if (data?.website && !values) setValues(data.website);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading || !values) {
    return <p className="text-caption text-muted-foreground">Loading settings…</p>;
  }

  function updateSocialLink(index: number, patch: Partial<{ platform: string; url: string }>) {
    if (!values) return;
    const links = [...values.socialLinks];
    const current = links[index];
    if (!current) return;
    links[index] = { ...current, ...patch };
    setValues({ ...values, socialLinks: links });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (values) update.mutate(values);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
        <h2 className="font-display text-heading-sm text-foreground">Site Identity</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="site-name" className={labelClass}>Website Name</label>
            <input id="site-name" value={values.siteName} onChange={(e) => setValues({ ...values, siteName: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="logo-url" className={labelClass}>Logo URL</label>
            <input id="logo-url" value={values.logoUrl ?? ""} onChange={(e) => setValues({ ...values, logoUrl: e.target.value })} placeholder="https://…" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="favicon-url" className={labelClass}>Favicon URL</label>
            <input id="favicon-url" value={values.faviconUrl ?? ""} onChange={(e) => setValues({ ...values, faviconUrl: e.target.value })} placeholder="https://…" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
        <h2 className="font-display text-heading-sm text-foreground">Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className={labelClass}>Email</label>
            <input id="contact-email" type="email" value={values.contactEmail} onChange={(e) => setValues({ ...values, contactEmail: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className={labelClass}>Phone</label>
            <input id="contact-phone" value={values.contactPhone} onChange={(e) => setValues({ ...values, contactPhone: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-address" className={labelClass}>Address</label>
          <input id="contact-address" value={values.contactAddress} onChange={(e) => setValues({ ...values, contactAddress: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
        <h2 className="font-display text-heading-sm text-foreground">Footer</h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="footer-text" className={labelClass}>Footer Tagline</label>
          <input id="footer-text" value={values.footerText} onChange={(e) => setValues({ ...values, footerText: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="copyright-text" className={labelClass}>Copyright Text</label>
          <input id="copyright-text" value={values.copyrightText} onChange={(e) => setValues({ ...values, copyrightText: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Social Media Links</span>
          {values.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={link.platform}
                onChange={(e) => updateSocialLink(index, { platform: e.target.value })}
                placeholder="Platform"
                className={`${inputClass} w-32`}
              />
              <input
                value={link.url}
                onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                placeholder="https://…"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                aria-label="Remove link"
                onClick={() => setValues({ ...values, socialLinks: values.socialLinks.filter((_, i) => i !== index) })}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValues({ ...values, socialLinks: [...values.socialLinks, { platform: "", url: "" }] })}
            className="flex w-fit items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-caption text-ink hover:border-brass hover:text-brass-dark"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Link
          </button>
        </div>
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save Website Settings
      </Button>
    </form>
  );
}

export { WebsiteSettingsForm };
