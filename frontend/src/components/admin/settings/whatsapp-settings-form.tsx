"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import type { WhatsAppSettings } from "@/types/admin/settings";

const inputClass =
  "h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

/**
 * Controls `lib/whatsapp.ts:buildWhatsAppOrderLink` (Phase 5) — that
 * function currently reads `siteConfig.whatsAppNumber`, a hard-coded
 * frontend placeholder documented at the time as "pending real admin
 * configuration." This form is that configuration becoming real; the
 * next step (making `buildWhatsAppOrderLink` read from this settings
 * endpoint instead of the static config) is a small follow-up wiring
 * change, not part of this form's own scope.
 */
function WhatsAppSettingsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("whatsapp");
  const [values, setValues] = useState<WhatsAppSettings | null>(null);

  useEffect(() => {
    if (data?.whatsapp && !values) setValues(data.whatsapp);
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
      <h2 className="font-display text-heading-sm text-foreground">WhatsApp Settings</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="wa-number" className={labelClass}>WhatsApp Number</label>
        <input
          id="wa-number"
          value={values.number}
          onChange={(e) => setValues({ ...values, number: e.target.value })}
          placeholder="923001234567"
          className={inputClass}
        />
        <p className="text-caption text-muted-foreground">International format, no leading + or spaces.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="wa-message" className={labelClass}>Default Message</label>
        <textarea
          id="wa-message"
          rows={3}
          value={values.defaultMessage}
          onChange={(e) => setValues({ ...values, defaultMessage: e.target.value })}
          className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">WhatsApp Enabled</span>
        <Switch checked={values.enabled} onCheckedChange={(checked) => setValues({ ...values, enabled: checked })} />
      </label>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Floating Button</span>
        <Switch
          checked={values.floatingButtonEnabled}
          onCheckedChange={(checked) => setValues({ ...values, floatingButtonEnabled: checked })}
        />
      </label>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">&quot;Order on WhatsApp&quot; Button (Product Pages)</span>
        <Switch
          checked={values.orderButtonEnabled}
          onCheckedChange={(checked) => setValues({ ...values, orderButtonEnabled: checked })}
        />
      </label>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save WhatsApp Settings
      </Button>
    </form>
  );
}

export { WhatsAppSettingsForm };
