import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";

export interface UploadedImage {
  url: string;
  public_id: string;
}

export const imageUploadService = {
  async upload(file: File, folder?: string): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) formData.append("folder", folder);

    const { data } = await apiClient.post<ApiSuccessResponse<UploadedImage>>(API_ENDPOINTS.admin.uploadImage, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },
};