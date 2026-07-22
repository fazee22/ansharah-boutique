"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/admin/use-admin-products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Client Component page, so `params` (a Promise as of Next.js 15) is
 * unwrapped with React's `use()` rather than `await` — a plain
 * `async function` page component isn't valid for a Client Component.
 */
export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const productId = Number(id);
  const { data: product, isLoading, isError } = useProduct(Number.isFinite(productId) ? productId : null);

  if (!Number.isFinite(productId)) notFound();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64 rounded" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Edit Product</h1>
        <p className="text-body-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
