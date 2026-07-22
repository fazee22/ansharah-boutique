"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { emailSchema } from "@/lib/validation";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/**
 * Admin sign-in — a real login against the Phase 1 JWT backend (not a
 * mock), with a client-side role check for immediate feedback (the
 * server-side `role:admin,super_admin` middleware is the actual
 * enforcement — see `AdminGuard`). Deliberately outside
 * `admin/(dashboard)/layout.tsx`'s route group, so it renders without
 * the guarded sidebar/topbar shell or a redirect loop.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!emailSchema.safeParse(email).success) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await login({ email, password }, rememberMe);

      if (!ADMIN_ROLES.has(session.user.role)) {
        setError("This account doesn't have admin access.");
        return;
      }

      router.push(ROUTES.admin.root);
    } catch (caught) {
      const message = (caught as { message?: string })?.message;
      setError(message ?? "Couldn't sign in. Check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-porcelain p-8 shadow-floating">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <span className="flex items-center gap-1.5 font-mono text-caption uppercase tracking-widest text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Admin Access
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-ink">
            <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
            Remember me on this device
          </label>

          {error ? (
            <p role="alert" className="text-caption text-destructive">
              {error}
            </p>
          ) : null}

          <Button
  type="submit"
  variant="primary"
  size="lg"
  isLoading={isSubmitting}
  className="mt-2"
  style={{ backgroundColor: "#14140f", color: "#ffffff" }}
>
  Sign In
</Button>
        </form>

        <Link
          href={ROUTES.home}
          className="mt-6 block text-center text-caption text-muted-foreground transition-colors hover:text-brass-dark"
        >
          ← Back to the storefront
        </Link>
      </div>
    </div>
  );
}
