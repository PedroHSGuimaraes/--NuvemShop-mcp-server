export interface TiendaNubeConfig {
  clientId?: string;
  clientSecret?: string;
  accessToken: string;
  storeId: string;
  baseUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number | undefined;
  page?: number | undefined;
  per_page?: number | undefined;
  has_next?: boolean | undefined;
  has_prev?: boolean | undefined;
}

export interface Product {
  id: number;
  name: Record<string, string>;
  description: Record<string, string>;
  handle: Record<string, string>;
  variants: ProductVariant[];
  images: ProductImage[];
  categories: Category[];
  brand: string | null;
  published: boolean;
  free_shipping: boolean;
  video_url: string | null;
  seo_title: string;
  seo_description: string;
  attributes: Array<Record<string, string>>;
  tags: string;
  created_at: string;
  updated_at: string;
  requires_shipping: boolean;
}

export interface ProductVariant {
  id: number;
  promotional_price: string | null;
  created_at: string;
  depth: string | null;
  height: string | null;
  values: Array<Record<string, string>>;
  price: string;
  product_id: number;
  stock_management: boolean;
  stock: number;
  sku: string | null;
  updated_at: string;
  weight: string;
  width: string | null;
  cost: string | null;
}

export interface ProductImage {
  id: number;
  src: string;
  position: number;
  product_id: number;
  alt?: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: Record<string, string>;
  description: Record<string, string>;
  handle: Record<string, string>;
  parent: number | null;
  subcategories: Category[];
  google_shopping_category: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  token: string;
  store_id: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  contact_identification: string;
  number: number;
  completed_at: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  attributes: any[];
  customer: Customer;
  products: OrderProduct[];
  note: string;
  owner_note: string;
  coupon: any[];
  discount: string;
  subtotal: string;
  total: string;
  total_usd: string;
  currency: string;
  language: string;
  gateway: string;
  gateway_id: string | null;
  gateway_name: string;
  gateway_link: string | null;
  shipping_address: Address;
  billing_name: string;
  billing_phone: string;
  billing_address: string;
  billing_number: string;
  billing_floor: string;
  billing_locality: string;
  billing_zipcode: string;
  billing_city: string;
  billing_province: string;
  billing_country: string;
  extra: Record<string, any>;
  storefront: string;
  weight: string;
  cancelled_at: string | null;
  closed_at: string | null;
  read_at: string | null;
  status: "open" | "closed" | "cancelled";
  payment_status:
    | "authorized"
    | "pending"
    | "paid"
    | "partially_paid"
    | "abandoned"
    | "refunded"
    | "partially_refunded"
    | "voided";
  shipping_status:
    | "unpacked"
    | "shipped"
    | "unshipped"
    | "delivered"
    | "partially_packed"
    | "partially_fulfilled";
  payment_details: {
    method: string;
    credit_card_company: string | null;
    installments: number;
  };
  paid_at: string | null;
  cancel_reason: "customer" | "fraud" | "inventory" | "other" | null;
  created_at: string;
  updated_at: string;
  client_details: {
    browser_ip: string;
    user_agent: string;
  };
  app_id: number | null;
}

export interface OrderProduct {
  id: number;
  product_id: number;
  variant_id: number;
  name: string;
  price: string;
  quantity: string;
  weight: string;
  width: string;
  height: string;
  depth: string;
  free_shipping: boolean;
  sku: string | null;
  barcode: string | null;
  image: ProductImage;
  variant_values: any[];
  properties: any[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  identification: string;
  phone: string;
  note: string | null;
  default_address: Address;
  addresses: Address[];
  billing_name: string;
  billing_phone: string;
  billing_address: string;
  billing_number: string;
  billing_floor: string;
  billing_locality: string;
  billing_zipcode: string;
  billing_city: string;
  billing_province: string;
  billing_country: string;
  extra: Record<string, any>;
  total_spent: string;
  total_spent_currency: string;
  last_order_id: number;
  active: boolean;
  first_interaction: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  address: string;
  city: string;
  country: string;
  created_at: string;
  default: boolean;
  floor: string;
  locality: string;
  name: string;
  number: string;
  phone: string;
  province: string;
  updated_at: string;
  zipcode: string;
  customs?: any;
}

export interface Webhook {
  id: number;
  url: string;
  event: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "absolute";
  value: string;
  valid: boolean;
  used: number;
  max_uses: number | null;
  min_price: string | null;
  start_date: string | null;
  end_date: string | null;
  categories: number[];
  products: number[];
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  url: string;
  domain: string;
  country: string;
  currency: string;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  token: string;
  store_id: number;
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  products: CartProduct[];
  total: string;
  created_at: string;
  updated_at: string;
}

export interface CartProduct {
  id: number;
  variant_id: number;
  product_id: number;
  quantity: number;
  price: string;
  name: string;
  image: ProductImage;
}

export interface Metafield {
  id: number;
  namespace: string;
  key: string;
  value: string;
  description: string;
  owner_resource: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
