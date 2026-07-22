import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AccountAddress, AddressFormValues } from "@/types/account/address";

function toPayload(values: Partial<AddressFormValues>) {
  return {
    type: values.type,
    label: values.label || undefined,
    full_name: values.fullName,
    phone: values.phone,
    line1: values.line1,
    line2: values.line2 || undefined,
    city: values.city,
    state: values.state || undefined,
    postal_code: values.postalCode || undefined,
    country: values.country,
    is_default: values.isDefault,
  };
}

export const accountAddressesService = {
  async list(): Promise<AccountAddress[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AccountAddress[]>>(API_ENDPOINTS.account.addresses);
    return data.data;
  },

  async create(values: AddressFormValues): Promise<AccountAddress> {
    const { data } = await apiClient.post<ApiSuccessResponse<AccountAddress>>(
      API_ENDPOINTS.account.addresses,
      toPayload(values),
    );
    return data.data;
  },

  async update(id: number, values: Partial<AddressFormValues>): Promise<AccountAddress> {
    const { data } = await apiClient.put<ApiSuccessResponse<AccountAddress>>(
      API_ENDPOINTS.account.address(id),
      toPayload(values),
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.account.address(id));
  },

  async setDefault(id: number): Promise<AccountAddress> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AccountAddress>>(API_ENDPOINTS.account.addressDefault(id));
    return data.data;
  },
};
