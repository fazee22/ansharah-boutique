import type { AddressSnapshot, OrderItem, OrderStatus, OrderStatusHistoryEntry, PaymentMethod, PaymentStatus } from "@/types/admin/order";

/**
 * Identical shape to `AdminOrder` — the backend's Account
 * OrderController reuses `Http\Resources\Admin\OrderResource` (see
 * that controller's doc comment), so the frontend mirrors that same
 * reuse rather than duplicating an identical type.
 */
export interface AccountOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: AddressSnapshot;
  billingAddress: AddressSnapshot | null;
  itemCount: number | null;
  items: OrderItem[];
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
}

export interface CheckoutAddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface CheckoutItemInput {
  name: string;
  sku: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: "cod" | "stripe" | "jazzcash" | "easypaisa";
  shippingFee: number;
  currency?: string;
  shippingAddress: CheckoutAddressInput;
  items: CheckoutItemInput[];
}
