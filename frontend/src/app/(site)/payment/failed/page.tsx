"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatusPage } from "@/components/payment/payment-status-page";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  return <PaymentStatusPage variant="failed" orderNumber={searchParams.get("order")} />;
}

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentFailedContent />
    </Suspense>
  );
}
