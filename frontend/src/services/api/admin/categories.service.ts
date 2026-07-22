import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { AdminCategory, CategoryFormValues } from "@/types/admin/category";

function toPayload(values: Partial<CategoryFormValues>) {
  return {
    parent_id: values.parentId ?? null,
    name: values.name,
    slug: values.slug || undefined,
    description: values.description || undefined,
    image_url: values.imageUrl || undefined,
    is_visible: values.isVisible,
  };
}

export const adminCategoriesService = {
  async list(params: { search?: string; parentId?: number; page?: number } = {}): Promise<PaginatedResult<AdminCategory>> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminCategory[]>>(API_ENDPOINTS.admin.categories, {
      params: { search: params.search, parent_id: params.parentId, page: params.page },
    });
    return { items: data.data, meta: data.meta! };
  },

  async tree(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminCategory[]>>(API_ENDPOINTS.admin.categories, {
      params: { tree: 1 },
    });
    return data.data;
  },

  async create(values: CategoryFormValues): Promise<AdminCategory> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminCategory>>(
      API_ENDPOINTS.admin.categories,
      toPayload(values),
    );
    return data.data;
  },

  async update(id: number, values: Partial<CategoryFormValues>): Promise<AdminCategory> {
    const { data } = await apiClient.put<ApiSuccessResponse<AdminCategory>>(
      API_ENDPOINTS.admin.category(id),
      toPayload(values),
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.category(id));
  },

  async toggleVisibility(id: number): Promise<AdminCategory> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminCategory>>(
      API_ENDPOINTS.admin.categoryToggleVisibility(id),
    );
    return data.data;
  },
  async uploadImage(id: number, file: File): Promise<AdminCategory> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<ApiSuccessResponse<AdminCategory>>(
    API_ENDPOINTS.admin.categoryUploadImage(id),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
},

  async reorder(items: { id: number; position: number }[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.admin.categoriesReorder, { items });
  },
};
