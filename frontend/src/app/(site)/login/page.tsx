"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { emailSchema } from "@/lib/validation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await login({ email, password }, true);
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo && returnTo.startsWith("/") ? returnTo : ROUTES.account);
    } catch (caught) {
      setError((caught as { message?: string })?.message ?? "Couldn't sign in. Check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      {error ? (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Container width="narrow" className="flex flex-col items-center gap-8 py-16 sm:py-24">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-display-sm font-light text-foreground">Welcome Back</h1>
          <p className="text-body-sm text-muted-foreground">Sign in to view your orders, wishlist, and account.</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="text-center text-body-sm text-muted-foreground">
          New here?{" "}
          <Link href={ROUTES.register} className="text-ink underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Container>
  );
}
