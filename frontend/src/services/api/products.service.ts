import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { Product, SortOption } from "@/types/product";

export interface ProductListParams {
  category?: string;
  categoryPath?: string[];
ids?: string[];
search?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  newArrivals?: boolean;
  sale?: boolean;
  perPage?: number;
}

export const productsService = {
  async list(params: ProductListParams = {}): Promise<Product[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<Product[]>>(API_ENDPOINTS.products, {
      params: {
        category: params.category,
        category_path: params.categoryPath?.join("/"),
ids: params.ids?.join(","),
search: params.search,
        sort: params.sort,
        min_price: params.minPrice,
        max_price: params.maxPrice,
        in_stock: params.inStock ? 1 : undefined,
        featured: params.featured ? 1 : undefined,
        new_arrivals: params.newArrivals ? 1 : undefined,
        sale: params.sale ? 1 : undefined,
        per_page: params.perPage ?? 100,
      },
    });
    return data.data;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const { data } = await apiClient.get<ApiSuccessResponse<Product>>(API_ENDPOINTS.product(slug));
      return data.data;
    } catch {
      return null;
    }
  },
};