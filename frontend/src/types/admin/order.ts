export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type PaymentMethod = "cod" | "card" | "bank_transfer";

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productSku: string;
  productImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderStatusHistoryEntry {
  id: number;
  status: OrderStatus;
  note: string | null;
  changedByName: string | null;
  createdAt: string;
}

export interface OrderNote {
  id: number;
  body: string;
  authorName: string | null;
  createdAt: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  userId: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
  notes: OrderNote[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListFilters {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  sort?: "newest" | "oldest" | "total_desc" | "total_asc";
  page?: number;
  perPage?: number;
}
