"use client";

import { useState, type FormEvent } from "react";
import { CustomerGuard } from "@/components/account/customer-guard";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/account/use-account-profile";

const inputClass =
  "h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

function ChangePasswordForm() {
  const [values, setValues] = useState({ currentPassword: "", password: "", passwordConfirmation: "" });
  const [error, setError] = useState<string | null>(null);
  const changePassword = useChangePassword();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (values.password.length < 8) return setError("New password must be at least 8 characters.");
    if (values.password !== values.passwordConfirmation) return setError("Passwords don't match.");

    changePassword.mutate(values, {
      onSuccess: () => setValues({ currentPassword: "", password: "", passwordConfirmation: "" }),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
      <h2 className="font-display text-heading-sm text-foreground">Change Password</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="current-password" className={labelClass}>
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          value={values.currentPassword}
          onChange={(e) => setValues({ ...values, currentPassword: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-password" className={labelClass}>
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm-password" className={labelClass}>
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={values.passwordConfirmation}
          onChange={(e) => setValues({ ...values, passwordConfirmation: e.target.value })}
          className={inputClass}
        />
      </div>

      {error ? (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="md" isLoading={changePassword.isPending} className="w-fit">
        Update Password
      </Button>
    </form>
  );
}

export default function AccountSettingsPage() {
  return (
    <CustomerGuard>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">Account Settings</h1>
          <p className="text-body-sm text-muted-foreground">Manage your password and account security.</p>
        </div>
        <ChangePasswordForm />
      </div>
    </CustomerGuard>
  );
}
