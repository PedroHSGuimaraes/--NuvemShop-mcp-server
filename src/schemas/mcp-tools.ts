import { z } from "zod";

// MCP Tool Schemas for Tienda Nube API

// Store info tool schema
export const GetStoreInfoSchema = z.object({});

// Product tool schemas
export const ListProductsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  ids: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  language: z.string().length(2).optional(),
  q: z.string().optional(),
  handle: z.string().optional(),
  category_id: z.number().int().positive().optional(),
  published: z.boolean().optional(),
  free_shipping: z.boolean().optional(),
  max_stock: z.number().int().nonnegative().optional(),
  min_stock: z.number().int().nonnegative().optional(),
  has_promotional_price: z.boolean().optional(),
  has_weight: z.boolean().optional(),
  has_all_dimensions: z.boolean().optional(),
  has_weight_and_all_dimensions: z.boolean().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
  sort_by: z
    .enum([
      "user",
      "price-ascending",
      "price-descending",
      "cost-ascending",
      "cost-descending",
      "alpha-ascending",
      "alpha-descending",
      "name-ascending",
      "name-descending",
      "created-at-ascending",
      "created-at-descending",
      "best-selling",
    ])
    .optional(),
});

export const GetProductSchema = z.object({
  product_id: z.number().int().positive(),
  fields: z.string().optional(),
  language: z.string().length(2).optional(),
});

export const CreateProductSchema = z.object({
  name_es: z.string().min(1, "Spanish name is required"),
  name_pt: z.string().optional(),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  description_pt: z.string().optional(),
  description_en: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  promotional_price: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  stock_management: z.boolean().optional(),
  weight: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  depth: z.string().optional(),
  cost: z.string().optional(),
  published: z.boolean().optional(),
  free_shipping: z.boolean().optional(),
  requires_shipping: z.boolean().optional(),
  brand: z.string().optional(),
  video_url: z.string().url().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  tags: z.string().optional(),
  categories: z.array(z.number().int().positive()).optional(),
  image_urls: z.array(z.string().url()).optional(),
});

export const UpdateProductSchema = z.object({
  product_id: z.number().int().positive(),
  name_es: z.string().optional(),
  name_pt: z.string().optional(),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  description_pt: z.string().optional(),
  description_en: z.string().optional(),
  price: z.string().optional(),
  promotional_price: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  stock_management: z.boolean().optional(),
  weight: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  depth: z.string().optional(),
  cost: z.string().optional(),
  published: z.boolean().optional(),
  free_shipping: z.boolean().optional(),
  requires_shipping: z.boolean().optional(),
  brand: z.string().optional(),
  video_url: z.string().url().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  tags: z.string().optional(),
  categories: z.array(z.number().int().positive()).optional(),
});

export const DeleteProductSchema = z.object({
  product_id: z.number().int().positive(),
});

export const SearchProductsSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  language: z.string().length(2).optional(),
  category_id: z.number().int().positive().optional(),
  published: z.boolean().optional(),
});

// Product Variant tool schemas
export const ListProductVariantsSchema = z.object({
  product_id: z.number().int().positive(),
});

export const GetProductVariantSchema = z.object({
  product_id: z.number().int().positive(),
  variant_id: z.number().int().positive(),
});

export const CreateProductVariantSchema = z.object({
  product_id: z.number().int().positive(),
  price: z.string(),
  promotional_price: z.string().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  stock_management: z.boolean().optional(),
  sku: z.string().nullable().optional(),
  weight: z.string().optional(),
  width: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  depth: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
});

export const UpdateProductVariantSchema = CreateProductVariantSchema.partial().extend({
  product_id: z.number().int().positive(),
  variant_id: z.number().int().positive(),
});

export const DeleteProductVariantSchema = z.object({
  product_id: z.number().int().positive(),
  variant_id: z.number().int().positive(),
});

// Product Image tool schemas
export const ListProductImagesSchema = z.object({
  product_id: z.number().int().positive(),
});

export const CreateProductImageSchema = z.object({
  product_id: z.number().int().positive(),
  src: z.string().url(),
  position: z.number().int().positive().optional(),
  alt: z.array(z.string()).optional(),
});

export const UpdateProductImageSchema = z.object({
  product_id: z.number().int().positive(),
  image_id: z.number().int().positive(),
  src: z.string().url().optional(),
  position: z.number().int().positive().optional(),
  alt: z.array(z.string()).optional(),
});

export const DeleteProductImageSchema = z.object({
  product_id: z.number().int().positive(),
  image_id: z.number().int().positive(),
});

// Category tool schemas
export const ListCategoriesSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  language: z.string().length(2).optional(),
  q: z.string().optional(),
  parent_id: z.number().int().positive().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
});

export const GetCategorySchema = z.object({
  category_id: z.number().int().positive(),
  fields: z.string().optional(),
  language: z.string().length(2).optional(),
});

export const CreateCategorySchema = z.object({
  name_es: z.string().min(1, "Spanish name is required"),
  name_pt: z.string().optional(),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  description_pt: z.string().optional(),
  description_en: z.string().optional(),
  parent_id: z.number().int().positive().optional(),
  google_shopping_category: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  category_id: z.number().int().positive(),
  name_es: z.string().optional(),
  name_pt: z.string().optional(),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  description_pt: z.string().optional(),
  description_en: z.string().optional(),
  parent_id: z.number().int().positive().optional(),
  google_shopping_category: z.string().optional(),
});

export const DeleteCategorySchema = z.object({
  category_id: z.number().int().positive(),
});

// Order tool schemas
export const ListOrdersSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  status: z.enum(["any", "open", "closed", "cancelled"]).optional(),
  channels: z.enum(["form", "store", "api", "meli", "pos"]).optional(),
  payment_status: z
    .enum([
      "any",
      "pending",
      "authorized",
      "paid",
      "abandoned",
      "refunded",
      "voided",
    ])
    .optional(),
  shipping_status: z
    .enum(["any", "unpacked", "unfulfilled", "fulfilled"])
    .optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
  total_min: z.string().optional(),
  total_max: z.string().optional(),
  customer_ids: z.string().optional(),
  q: z.string().optional(),
  app_id: z.number().int().positive().optional(),
  payment_methods: z.string().optional(),
  payment_provider: z.string().optional(),
  aggregates: z.enum(["fulfillment_orders"]).optional(),
});

export const GetOrderSchema = z.object({
  order_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Valid email is required"),
  customer_phone: z.string().optional(),
  customer_document: z.string().optional(),
  products: z
    .array(
      z.object({
        variant_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.string().optional(),
      })
    )
    .min(1, "At least one product is required"),
  billing_address: z.string().min(1, "Billing address is required"),
  billing_city: z.string().min(1, "Billing city is required"),
  billing_province: z.string().min(1, "Billing province is required"),
  billing_country: z.string().min(1, "Billing country is required"),
  billing_zipcode: z.string().min(1, "Billing zipcode is required"),
  billing_number: z.string().min(1, "Billing number is required"),
  billing_floor: z.string().optional(),
  billing_phone: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_province: z.string().optional(),
  shipping_country: z.string().optional(),
  shipping_zipcode: z.string().optional(),
  shipping_number: z.string().optional(),
  shipping_floor: z.string().optional(),
  shipping_phone: z.string().optional(),
  currency: z.string().length(3).optional(),
  language: z.string().length(2).optional(),
  gateway: z.string().optional(),
  payment_status: z
    .enum(["pending", "authorized", "paid", "voided", "refunded", "abandoned"])
    .optional(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
  note: z.string().optional(),
  shipping_pickup_type: z.enum(["pickup", "ship"]).optional(),
  shipping_cost_customer: z.string().optional(),
  shipping_cost_owner: z.string().optional(),
  send_confirmation_email: z.boolean().optional(),
  send_fulfillment_email: z.boolean().optional(),
  location_id: z.string().optional(),
});

export const UpdateOrderSchema = z.object({
  order_id: z.number().int().positive(),
  owner_note: z.string().optional(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
});

export const CancelOrderSchema = z.object({
  order_id: z.number().int().positive(),
  reason: z.string().optional(),
});

export const GetOrderFulfillmentSchema = z.object({
  order_id: z.number().int().positive(),
});

// Customer tool schemas
export const ListCustomersSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
  q: z.string().optional(),
});

export const GetCustomerSchema = z.object({
  customer_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  identification: z.string().optional(),
  note: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
  number: z.string().optional(),
  floor: z.string().optional(),
});

export const UpdateCustomerSchema = z.object({
  customer_id: z.number().int().positive(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  identification: z.string().optional(),
  note: z.string().optional(),
});

export const DeleteCustomerSchema = z.object({
  customer_id: z.number().int().positive(),
});

// Store auxiliary tool schemas
export const EmptyArgsSchema = z.object({});

export const SearchCustomersSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
});

// Webhook tool schemas
export const ListWebhooksSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  url: z.string().url().optional(),
  event: z
    .enum([
      "app/uninstalled",
      "category/created",
      "category/updated",
      "category/deleted",
      "customer/created",
      "customer/updated",
      "customer/deleted",
      "order/created",
      "order/updated",
      "order/paid",
      "order/packed",
      "order/fulfilled",
      "order/cancelled",
      "order/custom_fields_updated",
      "order/edited",
      "order/pending",
      "order/voided",
      "product/created",
      "product/updated",
      "product/deleted",
      "product_variant/custom_fields_updated",
      "domain/updated",
    ])
    .optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
});

export const GetWebhookSchema = z.object({
  webhook_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const CreateWebhookSchema = z.object({
  url: z
    .string()
    .url("Must be a valid HTTPS URL")
    .refine(
      (url: string) => url.startsWith("https://"),
      "Webhook URL must use HTTPS"
    ),
  event: z.enum([
    "app/uninstalled",
    "category/created",
    "category/updated",
    "category/deleted",
    "customer/created",
    "customer/updated",
    "customer/deleted",
    "order/created",
    "order/updated",
    "order/paid",
    "order/packed",
    "order/fulfilled",
    "order/cancelled",
    "order/custom_fields_updated",
    "order/edited",
    "order/pending",
    "order/voided",
    "product/created",
    "product/updated",
    "product/deleted",
    "product_variant/custom_fields_updated",
    "domain/updated",
  ]),
});

export const UpdateWebhookSchema = z.object({
  webhook_id: z.number().int().positive(),
  url: z
    .string()
    .url("Must be a valid HTTPS URL")
    .refine(
      (url: string) => url.startsWith("https://"),
      "Webhook URL must use HTTPS"
    )
    .optional(),
  event: z
    .enum([
      "app/uninstalled",
      "category/created",
      "category/updated",
      "category/deleted",
      "customer/created",
      "customer/updated",
      "customer/deleted",
      "order/created",
      "order/updated",
      "order/paid",
      "order/packed",
      "order/fulfilled",
      "order/cancelled",
      "order/custom_fields_updated",
      "order/edited",
      "order/pending",
      "order/voided",
      "product/created",
      "product/updated",
      "product/deleted",
      "product_variant/custom_fields_updated",
      "domain/updated",
    ])
    .optional(),
});

export const DeleteWebhookSchema = z.object({
  webhook_id: z.number().int().positive(),
});

// Coupon tool schemas
export const ListCouponsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  code: z.string().optional(),
  type: z.enum(["percentage", "absolute"]).optional(),
  valid: z.boolean().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
});

export const GetCouponSchema = z.object({
  coupon_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  type: z.enum(["percentage", "absolute"]),
  value: z.string().min(1, "Coupon value is required"),
  valid: z.boolean().optional(),
  max_uses: z.number().int().positive().optional(),
  min_price: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  categories: z.array(z.number().int().positive()).optional(),
  products: z.array(z.number().int().positive()).optional(),
});

export const UpdateCouponSchema = z.object({
  coupon_id: z.number().int().positive(),
  code: z.string().optional(),
  type: z.enum(["percentage", "absolute"]).optional(),
  value: z.string().optional(),
  valid: z.boolean().optional(),
  max_uses: z.number().int().positive().optional(),
  min_price: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  categories: z.array(z.number().int().positive()).optional(),
  products: z.array(z.number().int().positive()).optional(),
});

export const DeleteCouponSchema = z.object({
  coupon_id: z.number().int().positive(),
});

// Abandoned checkout tool schemas
export const ListAbandonedCheckoutsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
  email: z.string().email().optional(),
  q: z.string().optional(),
});

export const GetAbandonedCheckoutSchema = z.object({
  abandoned_checkout_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const SendAbandonedCheckoutRecoveryEmailSchema = z.object({
  abandoned_checkout_id: z.number().int().positive(),
  language: z.string().length(2).optional(),
});

// Script tag tool schemas
export const ListScriptTagsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
  since_id: z.number().int().positive().optional(),
  src: z.string().url().optional(),
  created_at_min: z.string().datetime().optional(),
  created_at_max: z.string().datetime().optional(),
  updated_at_min: z.string().datetime().optional(),
  updated_at_max: z.string().datetime().optional(),
});

export const GetScriptTagSchema = z.object({
  script_tag_id: z.number().int().positive(),
  fields: z.string().optional(),
});

export const CreateScriptTagSchema = z.object({
  src: z
    .string()
    .url("Must be a valid HTTPS URL")
    .refine(
      (url: string) => url.startsWith("https://"),
      "Script tag URL must use HTTPS"
    ),
  event: z.enum(["onload", "onfocus"]).optional(),
});

export const UpdateScriptTagSchema = z.object({
  script_tag_id: z.number().int().positive(),
  src: z
    .string()
    .url("Must be a valid HTTPS URL")
    .refine(
      (url: string) => url.startsWith("https://"),
      "Script tag URL must use HTTPS"
    )
    .optional(),
  event: z.enum(["onload", "onfocus"]).optional(),
});

export const DeleteScriptTagSchema = z.object({
  script_tag_id: z.number().int().positive(),
});
