"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CategorySelect } from "./category-select";
import { TagInput } from "./tag-input";
import { ImageManager } from "./image-manager";
import { useCreateProduct, useUpdateProduct } from "@/hooks/admin/use-admin-products";
import { ROUTES } from "@/constants/routes";
import type { AdminProduct, AdminProductStatus, ProductFormValues } from "@/types/admin/product";

export interface ProductFormProps {
  /** Present when editing an existing product; `undefined` for the "new product" flow. */
  product?: AdminProduct;
}

function toFormValues(product?: AdminProduct): ProductFormValues {
  return {
    categoryId: product?.categoryId ?? null,
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    price: product?.price !== undefined ? String(product.price) : "",
    salePrice: product?.salePrice !== null && product?.salePrice !== undefined ? String(product.salePrice) : "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    stockQuantity: product?.stockQuantity !== undefined ? String(product.stockQuantity) : "0",
    status: product?.status ?? "draft",
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isSale: product?.isSale ?? false,
    tags: product?.tags ?? [],
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
  };
}

const STATUS_OPTIONS: { value: AdminProductStatus; label: string; description: string }[] = [
  { value: "draft", label: "Draft", description: "Hidden everywhere — only visible in this dashboard." },
  { value: "published", label: "Published", description: "Live on the storefront once it's wired to this catalog." },
  { value: "hidden", label: "Hidden", description: "Was published, now temporarily pulled from view." },
];

/**
 * Shared by both `products/new` and `products/[id]/edit` — the two
 * pages differ only in which mutation they call and whether
 * `ImageManager` renders (it needs a real product id, so it's absent
 * until the product has been saved at least once).
 */
function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isSaving = createProduct.isPending || updateProduct.isPending;

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!values.categoryId) nextErrors.categoryId = "Choose a category.";
    if (!values.name.trim()) nextErrors.name = "Product name is required.";
    if (!values.sku.trim()) nextErrors.sku = "SKU is required.";
    if (!values.price || Number(values.price) <= 0) nextErrors.price = "Enter a valid price.";
    if (values.salePrice && Number(values.salePrice) >= Number(values.price)) {
      nextErrors.salePrice = "Sale price must be lower than the regular price.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    if (product) {
      updateProduct.mutate({ id: product.id, values });
    } else {
      createProduct.mutate(values, {
        onSuccess: (created) => router.replace(ROUTES.admin.productEdit(created.id)),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <Section title="Basics">
            <Field label="Product Name" htmlFor="name" error={errors.name}>
              <input
                id="name"
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the name">
                <input
                  id="slug"
                  value={values.slug}
                  onChange={(event) => set("slug", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="SKU" htmlFor="sku" error={errors.sku}>
                <input
                  id="sku"
                  value={values.sku}
                  onChange={(event) => set("sku", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Short Description" htmlFor="shortDescription">
              <textarea
                id="shortDescription"
                rows={2}
                value={values.shortDescription}
                onChange={(event) => set("shortDescription", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Full Description" htmlFor="description">
              <textarea
                id="description"
                rows={6}
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
                className={inputClass}
              />
            </Field>
          </Section>

          <Section title="Pricing & Inventory">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Price (PKR)" htmlFor="price" error={errors.price}>
                <input
                  id="price"
                  type="number"
                  min={0}
                  value={values.price}
                  onChange={(event) => set("price", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Sale Price (PKR)" htmlFor="salePrice" error={errors.salePrice}>
                <input
                  id="salePrice"
                  type="number"
                  min={0}
                  value={values.salePrice}
                  onChange={(event) => set("salePrice", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Stock Quantity" htmlFor="stockQuantity">
                <input
                  id="stockQuantity"
                  type="number"
                  min={0}
                  value={values.stockQuantity}
                  onChange={(event) => set("stockQuantity", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          <Section title="Images">
            {product ? (
              <ImageManager productId={product.id} images={product.images} />
            ) : (
              <p className="rounded-md border border-dashed border-hairline p-6 text-center text-body-sm text-muted-foreground">
                Save the product first — images attach to a real product record.
              </p>
            )}
          </Section>

          <Section title="Search Engine Optimization">
            <Field label="SEO Title" htmlFor="seoTitle" hint={`${values.seoTitle?.length ?? 0}/70`}>
              <input
                id="seoTitle"
                maxLength={70}
                value={values.seoTitle}
                onChange={(event) => set("seoTitle", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="SEO Description" htmlFor="seoDescription" hint={`${values.seoDescription?.length ?? 0}/160`}>
              <textarea
                id="seoDescription"
                rows={3}
                maxLength={160}
                value={values.seoDescription}
                onChange={(event) => set("seoDescription", event.target.value)}
                className={inputClass}
              />
            </Field>
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section title="Organization">
            <Field label="Category" htmlFor="category" error={errors.categoryId}>
              <CategorySelect
                id="category"
                value={values.categoryId}
                onChange={(categoryId) => set("categoryId", categoryId ?? null)}
                className={inputClass}
              />
            </Field>
            <Field label="Tags" htmlFor="tags">
              <TagInput value={values.tags} onChange={(tags) => set("tags", tags)} />
            </Field>
          </Section>

          <Section title="Status">
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-hairline p-3 has-[:checked]:border-brass has-[:checked]:bg-brass/5"
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={values.status === option.value}
                    onChange={() => set("status", option.value)}
                    className="mt-1 accent-brass"
                  />
                  <span className="flex flex-col">
                    <span className="text-body-sm text-ink">{option.label}</span>
                    <span className="text-caption text-muted-foreground">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Flags">
            <ToggleRow label="Featured Product" checked={values.isFeatured} onChange={(v) => set("isFeatured", v)} />
            <ToggleRow label="New Arrival" checked={values.isNewArrival} onChange={(v) => set("isNewArrival", v)} />
            <ToggleRow label="Sale Product" checked={values.isSale} onChange={(v) => set("isSale", v)} />
          </Section>

          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-hairline bg-canvas px-3 py-2.5 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
      <h2 className="font-display text-heading-sm text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        {hint ? <span className="text-caption text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? <span className="text-caption text-destructive">{error}</span> : null}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-body-sm text-ink">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

export { ProductForm };
