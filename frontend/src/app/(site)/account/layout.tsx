import type { ReactNode } from "react";
import { Container } from "@/components/shared/container";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Container width="wide" className="flex flex-col gap-8 py-10 sm:py-14 lg:flex-row lg:gap-12">
      <AccountNav />
      <div className="min-w-0 flex-1">{children}</div>
    </Container>
  );
}
