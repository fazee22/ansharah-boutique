"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatusPage } from "@/components/payment/payment-status-page";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  return <PaymentStatusPage variant="success" orderNumber={searchParams.get("order")} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
