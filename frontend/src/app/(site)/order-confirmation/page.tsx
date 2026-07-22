"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatusPage } from "@/components/payment/payment-status-page";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  return <PaymentStatusPage variant="confirmation" orderNumber={searchParams.get("order")} />;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}
