import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

export interface WhatsAppOrderContext {
  quantity: number;
  /** Reserved for when real product variants (size/color) exist — included in the message once selectable. */
  variantLabel?: string;
  productUrl: string;
  /** The admin's real WhatsApp number (Phase 7 Settings, wired in Phase 10 via `useSiteSettings`) — falls back to `siteConfig.whatsAppNumber` if settings haven't loaded. */
  phoneNumber?: string;
}

/**
 * Builds a `wa.me` deep link that opens WhatsApp with a pre-filled
 * order message — product name, price, link, quantity, and (once
 * variants exist) the selected variant. Uses `context.phoneNumber`
 * (the real, admin-editable number) when the caller has it, otherwise
 * `siteConfig.whatsAppNumber` as a resilient fallback.
 */
export function buildWhatsAppOrderLink(product: Product, context: WhatsAppOrderContext): string {
  const price = formatCurrency(product.salePrice ?? product.price);

  const lines = [
    `Hi! I'd like to order:`,
    ``,
    `*${product.name}*`,
    `SKU: ${product.sku}`,
    context.variantLabel ? `Variant: ${context.variantLabel}` : null,
    `Quantity: ${context.quantity}`,
    `Price: ${price}`,
    ``,
    context.productUrl,
  ].filter((line): line is string => line !== null);

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${context.phoneNumber || siteConfig.whatsAppNumber}?text=${message}`;
}

/**
 * General-purpose `wa.me` link — used by the Contact page's WhatsApp
 * button and any other "chat with us" entry point that isn't tied to
 * a specific product order (see `buildWhatsAppOrderLink` for that
 * case).
 */
export function buildWhatsAppGeneralLink(message: string = "Hi! I have a question about your collections."): string {
  return `https://wa.me/${siteConfig.whatsAppNumber}?text=${encodeURIComponent(message)}`;
}
