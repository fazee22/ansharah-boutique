"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountProfileService, type ChangePasswordPayload, type UpdateProfilePayload } from "@/services/api/account/profile.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const profileKey = ["account", "profile"] as const;

export function useAccountProfile() {
  return useQuery({
    queryKey: profileKey,
    queryFn: () => accountProfileService.get(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => accountProfileService.update(payload),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: profileKey });
      // Keep the header/account UI in sync immediately, not just after the next /auth/me refetch.
      useAuthStore.setState({ user });
      toast("Profile updated.", "success");
    },
    onError: (error: { message?: string }) => toast(error.message ?? "Couldn't update your profile.", "error"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => accountProfileService.changePassword(payload),
    onSuccess: () => toast("Password updated.", "success"),
    onError: (error: { message?: string; errors?: Record<string, string[]> }) =>
      toast(error.errors?.current_password?.[0] ?? error.message ?? "Couldn't update your password.", "error"),
  });
}
