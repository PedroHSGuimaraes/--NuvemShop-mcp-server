import { z } from "zod";

// Base schemas
export const ConfigSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  accessToken: z.string().min(1, "Access token is required"),
  storeId: z.string().min(1, "Store ID is required"),
  baseUrl: z.string().url().optional(),
});

// Common schemas
export const IdSchema = z.number().int().positive();
export const DateSchema = z.string().datetime();
export const LanguageObjectSchema = z.record(z.string(), z.string());

// Product schemas
export const ProductVariantSchema = z.object({
  id: IdSchema.optional(),
  promotional_price: z.string().nullable().optional(),
  depth: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  values: z.array(LanguageObjectSchema).optional(),
  price: z.string(),
  product_id: IdSchema.optional(),
  stock_management: z.boolean().optional(),
  stock: z.number().int().nonnegative().optional(),
  sku: z.string().nullable().optional(),
  weight: z.string().optional(),
  width: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
});

export const ProductImageSchema = z.object({
  id: IdSchema.optional(),
  src: z.string().url(),
  position: z.number().int().positive().optional(),
  product_id: IdSchema.optional(),
  alt: z.array(z.string()).optional(),
});

export const CreateProductSchema = z.object({
  name: LanguageObjectSchema,
  description: LanguageObjectSchema.optional(),
  handle: LanguageObjectSchema.optional(),
  variants: z.array(ProductVariantSchema).min(1),
  images: z.array(ProductImageSchema).optional(),
  categories: z.array(IdSchema).optional(),
  brand: z.string().nullable().optional(),
  published: z.boolean().optional(),
  free_shipping: z.boolean().optional(),
  video_url: z.string().url().nullable().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  attributes: z.array(LanguageObjectSchema).optional(),
  tags: z.string().optional(),
  requires_shipping: z.boolean().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: IdSchema,
});

// Category schemas
export const CreateCategorySchema = z.object({
  name: LanguageObjectSchema,
  description: LanguageObjectSchema.optional(),
  handle: LanguageObjectSchema.optional(),
  parent: IdSchema.nullable().optional(),
  google_shopping_category: z.string().nullable().optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: IdSchema,
});

// Order schemas
export const AddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  country: z.string(),
  floor: z.string().optional(),
  locality: z.string().optional(),
  name: z.string(),
  number: z.string(),
  phone: z.string().optional(),
  province: z.string(),
  zipcode: z.string(),
  customs: z.any().optional(),
});

export const CustomerOrderSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  document: z.string().optional(),
});

export const OrderProductSchema = z.object({
  variant_id: IdSchema,
  quantity: z.number().int().positive(),
  price: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  currency: z.string().length(3).optional(),
  language: z.string().length(2).optional(),
  gateway: z.string().optional(),
  payment_status: z
    .enum(["pending", "authorized", "paid", "voided", "refunded", "abandoned"])
    .optional(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
  products: z.array(OrderProductSchema).min(1),
  customer: CustomerOrderSchema,
  note: z.string().optional(),
  billing_address: AddressSchema,
  shipping_address: AddressSchema,
  shipping_pickup_type: z.enum(["pickup", "ship"]).optional(),
  shipping_cost_customer: z.string().optional(),
  shipping_cost_owner: z.string().optional(),
  send_confirmation_email: z.boolean().optional(),
  send_fulfillment_email: z.boolean().optional(),
  location_id: z.string().optional(),
});

export const UpdateOrderSchema = z.object({
  id: IdSchema,
  owner_note: z.string().optional(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
});

// Customer schemas
export const CreateCustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  identification: z.string().optional(),
  note: z.string().optional(),
  addresses: z.array(AddressSchema).optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial().extend({
  id: IdSchema,
});

// Webhook schemas
export const WebhookEventSchema = z.enum([
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
]);

export const CreateWebhookSchema = z.object({
  url: z
    .string()
    .url("Must be a valid HTTPS URL")
    .refine(
      (url: string) => url.startsWith("https://"),
      "Webhook URL must use HTTPS"
    ),
  event: WebhookEventSchema,
});

export const UpdateWebhookSchema = CreateWebhookSchema.partial().extend({
  id: IdSchema,
});

// Coupon schemas
export const CreateCouponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(["percentage", "absolute"]),
  value: z.string(),
  valid: z.boolean().optional(),
  max_uses: z.number().int().positive().nullable().optional(),
  min_price: z.string().nullable().optional(),
  start_date: DateSchema.nullable().optional(),
  end_date: DateSchema.nullable().optional(),
  categories: z.array(IdSchema).optional(),
  products: z.array(IdSchema).optional(),
});

export const UpdateCouponSchema = CreateCouponSchema.partial().extend({
  id: IdSchema,
});

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(200).optional(),
  fields: z.string().optional(),
});

export const ProductFiltersSchema = PaginationSchema.extend({
  ids: z.string().optional(),
  since_id: IdSchema.optional(),
  language: z.string().length(2).optional(),
  q: z.string().optional(),
  handle: z.string().optional(),
  category_id: IdSchema.optional(),
  published: z.boolean().optional(),
  free_shipping: z.boolean().optional(),
  max_stock: z.number().int().nonnegative().optional(),
  min_stock: z.number().int().nonnegative().optional(),
  has_promotional_price: z.boolean().optional(),
  has_weight: z.boolean().optional(),
  has_all_dimensions: z.boolean().optional(),
  has_weight_and_all_dimensions: z.boolean().optional(),
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
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

export const OrderFiltersSchema = PaginationSchema.extend({
  since_id: IdSchema.optional(),
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
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
  total_min: z.string().optional(),
  total_max: z.string().optional(),
  customer_ids: z.string().optional(),
  q: z.string().optional(),
  app_id: IdSchema.optional(),
  payment_methods: z.string().optional(),
  payment_provider: z.string().optional(),
  aggregates: z.enum(["fulfillment_orders"]).optional(),
});

export const CustomerFiltersSchema = PaginationSchema.extend({
  since_id: IdSchema.optional(),
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
  q: z.string().optional(),
});

export const CategoryFiltersSchema = PaginationSchema.extend({
  since_id: IdSchema.optional(),
  language: z.string().length(2).optional(),
  q: z.string().optional(),
  parent_id: IdSchema.optional(),
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
});

export const WebhookFiltersSchema = PaginationSchema.extend({
  since_id: IdSchema.optional(),
  url: z.string().url().optional(),
  event: WebhookEventSchema.optional(),
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
});

export const CouponFiltersSchema = PaginationSchema.extend({
  since_id: IdSchema.optional(),
  code: z.string().optional(),
  type: z.enum(["percentage", "absolute"]).optional(),
  valid: z.boolean().optional(),
  created_at_min: DateSchema.optional(),
  created_at_max: DateSchema.optional(),
  updated_at_min: DateSchema.optional(),
  updated_at_max: DateSchema.optional(),
});
