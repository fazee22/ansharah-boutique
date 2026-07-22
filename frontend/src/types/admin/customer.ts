export type AccountStatus = "active" | "blocked";

export interface AdminAddress {
  id: number;
  type: "shipping" | "billing";
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
}

export interface CustomerNote {
  id: number;
  body: string;
  authorName: string | null;
  createdAt: string;
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  accountStatus: AccountStatus;
  ordersCount?: number;
  addresses: AdminAddress[];
  notes: CustomerNote[];
  createdAt: string;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export interface CustomerListFilters {
  search?: string;
  accountStatus?: AccountStatus;
  page?: number;
  perPage?: number;
}
