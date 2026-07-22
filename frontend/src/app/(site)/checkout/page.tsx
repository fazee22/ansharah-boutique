"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { checkoutService } from "@/services/api/checkout.service";
import { paymentService } from "@/services/api/payment.service";
import { rememberOrderLookupEmail } from "@/lib/order-lookup-memory";
import { formatCurrency } from "@/lib/format";
import { emailSchema } from "@/lib/validation";
import { ROUTES } from "@/constants/routes";
import type { PaymentGatewayKey } from "@/types/payment";

const FREE_SHIPPING_THRESHOLD = 15000;
const FLAT_SHIPPING_FEE = 250;

const inputClass =
  "h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

/**
 * The real checkout flow this project has deferred since Phase 5's
 * cart page ("Checkout — Coming Soon"). Ties together three phases at
 * once: places a real order through `POST /api/v1/orders` (Phase 10),
 * then hands off to `PaymentService.initiate()` (Phase 9) — Cash on
 * Delivery completes immediately and lands on `/order-confirmation`;
 * a configured redirect-based gateway sends the customer to its
 * hosted checkout; an unconfigured one shows an inline error rather
 * than a dead end. `rememberOrderLookupEmail` (Phase 9) is what lets
 * the confirmation/payment pages resolve the order automatically on
 * return.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
  });
  const [gateway, setGateway] = useState<PaymentGatewayKey | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setValues((current) => ({ ...current, name: user.name, email: user.email, phone: user.phone ?? current.phone }));
    }
  }, [user]);

  const subtotal = lines.reduce((sum, line) => sum + (line.salePrice ?? line.price) * line.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  function set(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors.name = "Required";
    if (!emailSchema.safeParse(values.email).success) nextErrors.email = "Enter a valid email address.";
    if (!values.phone.trim()) nextErrors.phone = "Required";
    if (!values.line1.trim()) nextErrors.line1 = "Required";
    if (!values.city.trim()) nextErrors.city = "Required";
    if (!gateway) nextErrors.gateway = "Choose a payment method.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || !gateway) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const order = await checkoutService.placeOrder({
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        paymentMethod: gateway,
        shippingFee,
        shippingAddress: {
          fullName: values.name,
          phone: values.phone,
          line1: values.line1,
          line2: values.line2 || undefined,
          city: values.city,
          postalCode: values.postalCode || undefined,
          country: "Pakistan",
        },
        items: lines.map((line) => ({
  name: line.name,
  sku: line.productId,
  imageUrl: line.imageUrl,
  unitPrice: line.salePrice ?? line.price,
  quantity: line.quantity,
})),
      });

      rememberOrderLookupEmail(values.email);

      const payment = await paymentService.initiate(order.orderNumber, values.email, gateway);
      clearCart();

      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      router.push(`${ROUTES.orderConfirmation}?order=${order.orderNumber}`);
    } catch (caught) {
      setSubmitError((caught as { message?: string })?.message ?? "Couldn't place your order — please try again.");
      setIsSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add something you love before checking out."
          action={{ label: "Browse Collections", href: ROUTES.collections }}
        />
      </Container>
    );
  }

  return (
    <Container width="wide" className="flex flex-col gap-8 py-10 sm:py-16">
      <h1 className="font-display text-display-sm font-light text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
            <h2 className="font-display text-heading-sm text-foreground">Contact & Shipping</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-name" className={labelClass}>Full Name</label>
                <input id="checkout-name" value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                {errors.name ? <span className="text-caption text-destructive">{errors.name}</span> : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-email" className={labelClass}>Email</label>
                <input id="checkout-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
                {errors.email ? <span className="text-caption text-destructive">{errors.email}</span> : null}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-phone" className={labelClass}>Phone</label>
              <input id="checkout-phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
              {errors.phone ? <span className="text-caption text-destructive">{errors.phone}</span> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-line1" className={labelClass}>Address Line 1</label>
              <input id="checkout-line1" value={values.line1} onChange={(e) => set("line1", e.target.value)} className={inputClass} />
              {errors.line1 ? <span className="text-caption text-destructive">{errors.line1}</span> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-line2" className={labelClass}>Address Line 2 (optional)</label>
              <input id="checkout-line2" value={values.line2} onChange={(e) => set("line2", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-city" className={labelClass}>City</label>
                <input id="checkout-city" value={values.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
                {errors.city ? <span className="text-caption text-destructive">{errors.city}</span> : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-postal" className={labelClass}>Postal Code (optional)</label>
                <input id="checkout-postal" value={values.postalCode} onChange={(e) => set("postalCode", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
            <h2 className="font-display text-heading-sm text-foreground">Payment Method</h2>
            <PaymentMethodSelector value={gateway} onChange={setGateway} />
            {errors.gateway ? <span className="text-caption text-destructive">{errors.gateway}</span> : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-heading-sm text-foreground">Order Summary</h2>
          <ul className="flex flex-col divide-y divide-hairline">
            {lines.map((line) => (
              <li key={line.productId} className="flex items-center justify-between gap-3 py-3">
                <span className="flex-1 text-body-sm text-ink">
                  {line.name} <span className="text-caption text-muted-foreground">× {line.quantity}</span>
                </span>
                <span className="font-mono text-body-sm text-ink">
                  {formatCurrency((line.salePrice ?? line.price) * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 border-t border-hairline pt-4 text-body-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="font-mono">{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-medium text-ink">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(total)}</span>
            </div>
          </div>

          {submitError ? (
            <p role="alert" className="text-caption text-destructive">
              {submitError}
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            Place Order
          </Button>
          <Link href={ROUTES.cart} className="text-center text-caption text-muted-foreground hover:text-ink">
            ← Back to Bag
          </Link>
        </div>
      </form>
    </Container>
  );
}
