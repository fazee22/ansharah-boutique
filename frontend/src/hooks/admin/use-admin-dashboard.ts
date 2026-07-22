"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/services/api/admin/dashboard.service";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"] as const,
    queryFn: () => adminDashboardService.get(),
    staleTime: 30_000,
  });
}
