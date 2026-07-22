import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { PaymentGatewayKey, PaymentInitiationResponse, PaymentMethodOption } from "@/types/payment";

/**
 * Backs the (future) checkout's payment step and the standalone
 * Payment Success/Failed/Pending pages built this phase — see
 * `PROJECT_MEMORY.md` for why "modular payment architecture" is
 * genuinely wired end-to-end on the backend while there's no live
 * checkout flow to trigger it from yet.
 */
export const paymentService = {
  async methods(): Promise<PaymentMethodOption[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<PaymentMethodOption[]>>(API_ENDPOINTS.payments.methods);
    return data.data;
  },

  async initiate(orderNumber: string, email: string, gateway: PaymentGatewayKey): Promise<PaymentInitiationResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<PaymentInitiationResponse>>(API_ENDPOINTS.payments.initiate, {
      order_number: orderNumber,
      email,
      gateway,
    });
    return data.data;
  },
};
