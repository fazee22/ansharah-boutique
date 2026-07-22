import type { AdminCategory } from "./category";

export type AdminProductStatus = "draft" | "published" | "hidden";

export interface AdminProductImage {
  id: number;
  url: string;
  position: number;
  isFeatured: boolean;
}

export interface AdminProduct {
  id: number;
  categoryId: number;
  category?: AdminCategory;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  description: string | null;
  shortDescription: string | null;
  stockQuantity: number;
  status: AdminProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  newArrivalPosition: number | null;
  salePosition: number | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  images: AdminProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  categoryId: number | null;
  name: string;
  slug?: string;
  sku: string;
  price: string;
  salePrice?: string;
  description?: string;
  shortDescription?: string;
  stockQuantity: string;
  status: AdminProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductListFilters {
  search?: string;
  categoryId?: number;
  status?: AdminProductStatus;
  featured?: boolean;
  sale?: boolean;
  sort?: "newest" | "oldest" | "name" | "price_asc" | "price_desc" | "stock";
  page?: number;
  perPage?: number;
}

export type BulkProductAction = "delete" | "publish" | "draft" | "hide" | "change_category";