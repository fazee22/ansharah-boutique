import { ProductForm } from "@/components/admin/products/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Add Product</h1>
        <p className="text-body-sm text-muted-foreground">
          Fill in the basics and save — images and further edits can follow immediately after.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
