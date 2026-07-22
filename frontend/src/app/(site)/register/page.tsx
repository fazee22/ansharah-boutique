"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { emailSchema } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "", passwordConfirmation: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!values.name.trim()) return setError("Please enter your name.");
    if (!emailSchema.safeParse(values.email).success) return setError("Enter a valid email address.");
    if (values.password.length < 8) return setError("Password must be at least 8 characters.");
    if (values.password !== values.passwordConfirmation) return setError("Passwords don't match.");

    setIsSubmitting(true);
    try {
      await register(values);
      router.push(ROUTES.account);
    } catch (caught) {
      setError((caught as { message?: string })?.message ?? "Couldn't create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container width="narrow" className="flex flex-col items-center gap-8 py-16 sm:py-24">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-display-sm font-light text-foreground">Create an Account</h1>
          <p className="text-body-sm text-muted-foreground">
            Save your addresses, track orders, and build your wishlist.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Full Name
            </label>
            <input
              id="register-name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => set("password", event.target.value)}
              className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password-confirm" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Confirm Password
            </label>
            <input
              id="register-password-confirm"
              type="password"
              autoComplete="new-password"
              value={values.passwordConfirmation}
              onChange={(event) => set("passwordConfirmation", event.target.value)}
              className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          {error ? (
            <p role="alert" className="text-caption text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-body-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
