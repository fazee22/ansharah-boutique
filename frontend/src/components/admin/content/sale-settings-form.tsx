"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import type { SaleSettings } from "@/types/admin/settings";

/** Controls `components/home/sale-section.tsx`'s banner copy and the default discount percentage suggested when marking a product on sale. The countdown timer is optional per the brief ("Sale Timer (optional)"). */
function SaleSettingsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("sale");
  const [values, setValues] = useState<SaleSettings | null>(null);

  useEffect(() => {
    if (data?.sale && !values) setValues(data.sale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      <h2 className="font-display text-heading-sm text-foreground">Sale Banner</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sale-headline" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Headline
        </label>
        <input
          id="sale-headline"
          value={values.bannerHeadline}
          onChange={(event) => setValues({ ...values, bannerHeadline: event.target.value })}
          className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sale-subtext" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Subtext
        </label>
        <textarea
          id="sale-subtext"
          rows={2}
          value={values.bannerSubtext}
          onChange={(event) => setValues({ ...values, bannerSubtext: event.target.value })}
          className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sale-percentage" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Default Sale Percentage
        </label>
        <input
          id="sale-percentage"
          type="number"
          min={0}
          max={90}
          value={values.defaultPercentage}
          onChange={(event) => setValues({ ...values, defaultPercentage: Number(event.target.value) })}
          className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Countdown Timer</span>
        <Switch
          checked={values.timerEnabled}
          onCheckedChange={(checked) => setValues({ ...values, timerEnabled: checked })}
        />
      </label>

      {values.timerEnabled ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sale-timer-end" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Sale Ends At
          </label>
          <input
            id="sale-timer-end"
            type="datetime-local"
            value={values.timerEndsAt ?? ""}
            onChange={(event) => setValues({ ...values, timerEndsAt: event.target.value })}
            className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save Sale Settings
      </Button>
    </form>
  );
}

export { SaleSettingsForm };
