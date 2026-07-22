"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CustomerGuard } from "@/components/account/customer-guard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountProfile, useUpdateProfile } from "@/hooks/account/use-account-profile";

const inputClass =
  "h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

function ProfileForm() {
  const { data: user, isLoading } = useAccountProfile();
  const update = useUpdateProfile();
  const [values, setValues] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (user) setValues({ name: user.name, email: user.email, phone: user.phone ?? "" });
  }, [user]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate(values);
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full max-w-lg rounded-lg" />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-name" className={labelClass}>
          Full Name
        </label>
        <input
          id="profile-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-email" className={labelClass}>
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-phone" className={labelClass}>
          Phone
        </label>
        <input
          id="profile-phone"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          className={inputClass}
        />
      </div>
      <Button type="submit" variant="primary" size="md" isLoading={update.isPending} className="w-fit">
        Save Changes
      </Button>
    </form>
  );
}

export default function ProfilePage() {
  return (
    <CustomerGuard>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">Profile</h1>
          <p className="text-body-sm text-muted-foreground">Keep your contact details up to date.</p>
        </div>
        <ProfileForm />
      </div>
    </CustomerGuard>
  );
}
