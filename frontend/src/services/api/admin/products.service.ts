import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { AdminProduct, BulkProductAction, ProductFormValues, ProductListFilters } from "@/types/admin/product";

function toPayload(values: Partial<ProductFormValues>) {
  return {
    category_id: values.categoryId ?? undefined,
    name: values.name,
    slug: values.slug || undefined,
    sku: values.sku,
    price: values.price !== undefined ? Number(values.price) : undefined,
    sale_price: values.salePrice ? Number(values.salePrice) : null,
    description: values.description || undefined,
    short_description: values.shortDescription || undefined,
    stock_quantity: values.stockQuantity !== undefined ? Number(values.stockQuantity) : undefined,
    status: values.status,
    is_featured: values.isFeatured,
    is_new_arrival: values.isNewArrival,
    is_sale: values.isSale,
    tags: values.tags,
    seo_title: values.seoTitle || undefined,
    seo_description: values.seoDescription || undefined,
  };
}

export const adminProductsService = {
  async list(filters: ProductListFilters = {}): Promise<PaginatedResult<AdminProduct>> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminProduct[]>>(API_ENDPOINTS.admin.products, {
      params: {
        search: filters.search || undefined,
        category_id: filters.categoryId,
        status: filters.status,
        featured: filters.featured ? 1 : undefined,
        sale: filters.sale ? 1 : undefined,
        sort: filters.sort,
        page: filters.page,
        per_page: filters.perPage,
      },
    });
    return { items: data.data, meta: data.meta! };
  },

  async get(id: number): Promise<AdminProduct> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminProduct>>(API_ENDPOINTS.admin.product(id));
    return data.data;
  },

  async create(values: ProductFormValues): Promise<AdminProduct> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminProduct>>(
      API_ENDPOINTS.admin.products,
      toPayload(values),
    );
    return data.data;
  },

  async update(id: number, values: Partial<ProductFormValues>): Promise<AdminProduct> {
    const { data } = await apiClient.put<ApiSuccessResponse<AdminProduct>>(
      API_ENDPOINTS.admin.product(id),
      toPayload(values),
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.product(id));
  },

  async duplicate(id: number): Promise<AdminProduct> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminProduct>>(API_ENDPOINTS.admin.productDuplicate(id));
    return data.data;
  },

  async bulkAction(productIds: number[], action: BulkProductAction, categoryId?: number): Promise<number> {
    const { data } = await apiClient.post<ApiSuccessResponse<{ affected: number }>>(
      API_ENDPOINTS.admin.productsBulkAction,
      { product_ids: productIds, action, category_id: categoryId },
    );
    return data.data.affected;
  },
};
