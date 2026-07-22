import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminProductImage } from "@/types/admin/product";

export const adminProductImagesService = {
  async upload(
    productId: number,
    file: File,
    isFeatured: boolean,
    onProgress?: (percent: number) => void,
  ): Promise<AdminProductImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (isFeatured) formData.append("is_featured", "1");

    const { data } = await apiClient.post<ApiSuccessResponse<AdminProductImage>>(
      API_ENDPOINTS.admin.productImages(productId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
        },
      },
    );
    return data.data;
  },

  async remove(productId: number, imageId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.productImage(productId, imageId));
  },

  async setFeatured(productId: number, imageId: number): Promise<AdminProductImage> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminProductImage>>(
      API_ENDPOINTS.admin.productImageFeatured(productId, imageId),
    );
    return data.data;
  },

  async reorder(productId: number, items: { id: number; position: number }[]): Promise<AdminProductImage[]> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminProductImage[]>>(
      API_ENDPOINTS.admin.productImagesReorder(productId),
      { items },
    );
    return data.data;
  },
};
