/** Mirrors `backend/app/Http/Resources/Admin/CategoryResource.php`. */
export interface AdminCategory {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
  isVisible: boolean;
  productCount?: number;
  /** Present only on tree-shaped responses (`?tree=1`), absent on the flat paginated list. */
  children?: AdminCategory[];
  createdAt: string;
}

export interface CategoryFormValues {
  parentId: number | null;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isVisible: boolean;
}
