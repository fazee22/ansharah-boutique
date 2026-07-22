/**
 * Central REST endpoint registry, mirrored against
 * `backend/routes/api.php`. Prefixes are relative to
 * `env.api.baseUrl` (which already includes `/api/v1`).
 *
 * Only foundation/auth endpoints are wired in Phase 1 — commerce
 * endpoints are added as their respective phases are built, but are
 * listed here (commented) so the eventual API surface is visible.
 */
export const API_ENDPOINTS = {
  health: "/health",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  admin: {
    dashboard: "/admin/dashboard",
    categories: "/admin/categories",
    category: (id: number | string) => `/admin/categories/${id}`,
    categoryToggleVisibility: (id: number | string) => `/admin/categories/${id}/toggle-visibility`,
    categoryUploadImage: (id: number | string) => `/admin/categories/${id}/image`,
    uploadImage: "/admin/upload-image",
    categoriesReorder: "/admin/categories/reorder",
    products: "/admin/products",
    product: (id: number | string) => `/admin/products/${id}`,
    productDuplicate: (id: number | string) => `/admin/products/${id}/duplicate`,
    productsBulkAction: "/admin/products/bulk-action",
    productImages: (productId: number | string) => `/admin/products/${productId}/images`,
    productImage: (productId: number | string, imageId: number | string) =>
      `/admin/products/${productId}/images/${imageId}`,
    productImageFeatured: (productId: number | string, imageId: number | string) =>
      `/admin/products/${productId}/images/${imageId}/featured`,
    productImagesReorder: (productId: number | string) => `/admin/products/${productId}/images/reorder`,

    orders: "/admin/orders",
    order: (id: number | string) => `/admin/orders/${id}`,
    orderStatus: (id: number | string) => `/admin/orders/${id}/status`,
    orderNotes: (id: number | string) => `/admin/orders/${id}/notes`,

    customers: "/admin/customers",
    customer: (id: number | string) => `/admin/customers/${id}`,
    customerStatus: (id: number | string) => `/admin/customers/${id}/status`,
    customerNotes: (id: number | string) => `/admin/customers/${id}/notes`,

    slides: "/admin/slides",
    slide: (id: number | string) => `/admin/slides/${id}`,
    slideToggleActive: (id: number | string) => `/admin/slides/${id}/toggle-active`,
    slidesReorder: "/admin/slides/reorder",

    curation: "/admin/curation",
    curationAdd: (productId: number | string) => `/admin/curation/${productId}/add`,
    curationRemove: (productId: number | string) => `/admin/curation/${productId}/remove`,
    curationReorder: "/admin/curation/reorder",

    settings: "/admin/settings",

    newsletterSubscribers: "/admin/newsletter-subscribers",
    newsletterSubscriber: (id: number | string) => `/admin/newsletter-subscribers/${id}`,
    newsletterExport: "/admin/newsletter-subscribers/export",
  },

  newsletter: {
    subscribe: "/newsletter/subscribe",
  },

  contact: "/contact",

  payments: {
    methods: "/payments/methods",
    initiate: "/payments/initiate",
  },

  orderLookup: "/orders/lookup",
  checkout: "/orders",

  settings: "/settings",
  slides: "/slides",
  categories: "/categories",
  products: "/products",
product: (slug: string) => `/products/${slug}`,

  account: {
    profile: "/account/profile",
    password: "/account/password",
    addresses: "/account/addresses",
    address: (id: number | string) => `/account/addresses/${id}`,
    addressDefault: (id: number | string) => `/account/addresses/${id}/default`,
    orders: "/account/orders",
    order: (id: number | string) => `/account/orders/${id}`,
    wishlist: "/account/wishlist",
    wishlistItem: (productId: number | string) => `/account/wishlist/${productId}`,
  },

  // --- Reserved for future phases -----------------------------
  // products: "/products",
  // product: (slug: string) => `/products/${slug}`,
  // collections: "/collections",
  // cart: "/cart",
  // checkout: "/checkout",
  // orders: "/orders",
} as const;
