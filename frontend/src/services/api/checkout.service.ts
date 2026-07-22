import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AccountOrder, CheckoutPayload } from "@/types/account/order";

/** Backs the real checkout flow (Phase 10) — `POST /api/v1/orders`. */
export const checkoutService = {
  async placeOrder(payload: CheckoutPayload): Promise<AccountOrder> {
    const { data } = await apiClient.post<ApiSuccessResponse<AccountOrder>>(API_ENDPOINTS.checkout, {
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      payment_method: payload.paymentMethod,
      shipping_fee: payload.shippingFee,
      currency: payload.currency ?? "PKR",
      shipping_address: {
        fullName: payload.shippingAddress.fullName,
        phone: payload.shippingAddress.phone,
        line1: payload.shippingAddress.line1,
        line2: payload.shippingAddress.line2,
        city: payload.shippingAddress.city,
        postalCode: payload.shippingAddress.postalCode,
        country: payload.shippingAddress.country,
      },
      items: payload.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        image_url: item.imageUrl ?? undefined,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      })),
    });
    return data.data;
  },
};
