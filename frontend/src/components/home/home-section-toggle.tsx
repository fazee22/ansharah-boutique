"use client";

import type { ReactNode } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { HomepageSettings } from "@/types/admin/settings";

export interface HomeSectionToggleProps {
  setting: keyof Omit<HomepageSettings, "instagramHandle">;
  children: ReactNode;
}

/**
 * Wraps one homepage section, hiding it when the admin's real
 * Homepage Manager (Phase 7) has toggled it off. Defaults to
 * **visible** while settings are still loading or if the request
 * fails — a slow/unreachable settings endpoint should never be the
 * reason a section silently vanishes from the homepage; only an
 * explicit `false` from the admin hides it.
 */
function HomeSectionToggle({ setting, children }: HomeSectionToggleProps) {
  const { data: settings } = useSiteSettings();

  if (settings?.homepage && settings.homepage[setting] === false) {
    return null;
  }

  return <>{children}</>;
}

export { HomeSectionToggle };
