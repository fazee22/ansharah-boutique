"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAllSettings, useUpdateSettingsGroup } from "@/hooks/admin/use-admin-settings";
import type { MarqueeSettings } from "@/types/admin/settings";

/**
 * Controls the Auto Moving Slider's playback behavior — maps 1:1 onto
 * `useMarquee`'s options (`hooks/use-marquee.ts`, built Phase 3):
 * `speed`, `direction`, `pauseOnHover`. `mobileSwipeEnabled` toggles
 * whether the marquee accepts pointer/touch drag at all versus
 * running purely on autoplay.
 */
function MarqueeSettingsForm() {
  const { data, isLoading } = useAllSettings();
  const update = useUpdateSettingsGroup("marquee");
  const [values, setValues] = useState<MarqueeSettings | null>(null);

  useEffect(() => {
    if (data?.marquee && !values) setValues(data.marquee);
    // Seed local state once from the fetched settings; further syncing isn't needed since this form owns the value after that.
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
      <h2 className="font-display text-heading-sm text-foreground">Slider Behavior</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="marquee-speed" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Speed (px/sec)
          </label>
          <input
            id="marquee-speed"
            type="number"
            min={10}
            max={200}
            value={values.speed}
            onChange={(event) => setValues({ ...values, speed: Number(event.target.value) })}
            className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="marquee-direction" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Direction
          </label>
          <select
            id="marquee-direction"
            value={values.direction}
            onChange={(event) => setValues({ ...values, direction: event.target.value as "left" | "right" })}
            className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <option value="left">Right to Left</option>
            <option value="right">Left to Right</option>
          </select>
        </div>
      </div>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Pause on Hover (desktop)</span>
        <Switch
          checked={values.pauseOnHover}
          onCheckedChange={(checked) => setValues({ ...values, pauseOnHover: checked })}
        />
      </label>

      <label className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Enable Mobile Swipe</span>
        <Switch
          checked={values.mobileSwipeEnabled}
          onCheckedChange={(checked) => setValues({ ...values, mobileSwipeEnabled: checked })}
        />
      </label>

      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save Slider Settings
      </Button>
    </form>
  );
}

export { MarqueeSettingsForm };
