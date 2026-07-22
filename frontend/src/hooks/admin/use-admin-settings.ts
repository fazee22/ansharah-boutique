"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSettingsService } from "@/services/api/admin/settings.service";
import { toast } from "@/store/toast-store";
import type { AllSettings, SettingsGroup } from "@/types/admin/settings";

const settingsKey = ["admin", "settings"] as const;

export function useAllSettings() {
  return useQuery({
    queryKey: settingsKey,
    queryFn: () => adminSettingsService.getAll(),
    staleTime: 30_000,
  });
}

export function useUpdateSettingsGroup<G extends SettingsGroup>(group: G) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AllSettings[G]) => adminSettingsService.updateGroup(group, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKey });
      toast("Settings saved.", "success");
    },
    onError: (error: { message?: string }) => toast(error.message ?? "Couldn't save settings.", "error"),
  });
}
