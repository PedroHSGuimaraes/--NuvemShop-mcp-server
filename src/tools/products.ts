import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListProductsSchema,
  GetProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  DeleteProductSchema,
  SearchProductsSchema,
  ListProductVariantsSchema,
  GetProductVariantSchema,
  CreateProductVariantSchema,
  UpdateProductVariantSchema,
  DeleteProductVariantSchema,
  ListProductImagesSchema,
  CreateProductImageSchema,
  UpdateProductImageSchema,
  DeleteProductImageSchema,
  GetProductCustomFieldsSchema,
  UpdateProductCustomFieldsSchema,
  GetProductVariantCustomFieldsSchema,
  UpdateProductVariantCustomFieldsSchema,
  GetProductBySkuSchema,
  UpdateStockAndPriceSchema,
} from "../schemas/mcp-tools.js";

/**
 * Product management tools for Tienda Nube API
 */

export const productTools: Tool[] = [
  {
    name: "tiendanube_list_products",
    description:
      "List all products in the store with optional filtering, pagination, and sorting. Supports filtering by category, stock levels, dates, and various other criteria.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number (starting from 1)",
          minimum: 1,
        },
        per_page: {
          type: "number",
          description: "Number of items per page (max 200)",
          minimum: 1,
          maximum: 200,
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
        ids: {
          type: "string",
          description: "Comma-separated list of product IDs to filter by",
        },
        since_id: {
          type: "number",
          description: "Only return products with ID greater than this value",
        },
        language: {
          type: "string",
          description: "Language code (es, pt, en) for localized content",
          minLength: 2,
          maxLength: 2,
        },
        q: {
          type: "string",
          description: "Search query to filter products",
        },
        handle: {
          type: "string",
          description: "Filter by product handle (URL slug)",
        },
        category_id: {
          type: "number",
          description: "Filter by category ID",
        },
        published: {
          type: "boolean",
          description: "Filter by publication status",
        },
        free_shipping: {
          type: "boolean",
          description: "Filter by free shipping availability",
        },
        max_stock: {
          type: "number",
          description: "Maximum stock level filter",
        },
        min_stock: {
          type: "number",
          description: "Minimum stock level filter",
        },
        has_promotional_price: {
          type: "boolean",
          description: "Filter products with promotional prices",
        },
        has_weight: {
          type: "boolean",
          description: "Filter products that have weight defined",
        },
        has_all_dimensions: {
          type: "boolean",
          description:
            "Filter products with all dimensions (width, height, depth)",
        },
        has_weight_and_all_dimensions: {
          type: "boolean",
          description: "Filter products with weight and all dimensions",
        },
        created_at_min: {
          type: "string",
          description: "Filter by minimum creation date (ISO 8601)",
        },
        created_at_max: {
          type: "string",
          description: "Filter by maximum creation date (ISO 8601)",
        },
        updated_at_min: {
          type: "string",
          description: "Filter by minimum update date (ISO 8601)",
        },
        updated_at_max: {
          type: "string",
          description: "Filter by maximum update date (ISO 8601)",
        },
        sort_by: {
          type: "string",
          description: "Sort order for results",
          enum: [
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
          ],
        },
      },
    },
  },
  {
    name: "tiendanube_get_product_custom_fields",
    description:
      "GET PRODUCT CUSTOM FIELDS - Retrieve all custom fields for a specific product by ID.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "tiendanube_update_product_custom_fields",
    description:
      "UPDATE PRODUCT CUSTOM FIELDS - Replace or set custom fields for a product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        custom_fields: {
          type: "object",
          description: "Key-value pairs of custom fields",
          additionalProperties: {
            anyOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
              { type: "null" },
            ],
          },
        },
      },
      required: ["product_id", "custom_fields"],
    },
  },
  {
    name: "tiendanube_get_product_variant_custom_fields",
    description:
      "GET VARIANT CUSTOM FIELDS - Retrieve all custom fields for a specific product variant.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        variant_id: { type: "number", description: "Variant ID" },
      },
      required: ["product_id", "variant_id"],
    },
  },
  {
    name: "tiendanube_update_product_variant_custom_fields",
    description:
      "UPDATE VARIANT CUSTOM FIELDS - Replace or set custom fields for a product variant.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        variant_id: { type: "number", description: "Variant ID" },
        custom_fields: {
          type: "object",
          description: "Key-value pairs of custom fields",
          additionalProperties: {
            anyOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
              { type: "null" },
            ],
          },
        },
      },
      required: ["product_id", "variant_id", "custom_fields"],
    },
  },
  {
    name: "tiendanube_list_product_variants",
    description:
      "List all variants for a given product, including price, stock and SKU.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "tiendanube_get_product_variant",
    description: "Get a specific variant of a product by ID.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        variant_id: { type: "number", description: "Variant ID" },
      },
      required: ["product_id", "variant_id"],
    },
  },
  {
    name: "tiendanube_create_product_variant",
    description: "Create a new variant for a product (price, stock, sku, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        price: { type: "string", description: "Variant price" },
        promotional_price: { type: "string", description: "Promo price" },
        stock: { type: "number", description: "Stock quantity" },
        stock_management: { type: "boolean", description: "Manage stock" },
        sku: { type: "string", description: "SKU" },
        weight: { type: "string", description: "Weight" },
        width: { type: "string", description: "Width" },
        height: { type: "string", description: "Height" },
        depth: { type: "string", description: "Depth" },
        cost: { type: "string", description: "Cost" },
      },
      required: ["product_id", "price"],
    },
  },
  {
    name: "tiendanube_update_product_variant",
    description: "Update an existing variant for a product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        variant_id: { type: "number", description: "Variant ID" },
        price: { type: "string", description: "Variant price" },
        promotional_price: { type: "string", description: "Promo price" },
        stock: { type: "number", description: "Stock quantity" },
        stock_management: { type: "boolean", description: "Manage stock" },
        sku: { type: "string", description: "SKU" },
        weight: { type: "string", description: "Weight" },
        width: { type: "string", description: "Width" },
        height: { type: "string", description: "Height" },
        depth: { type: "string", description: "Depth" },
        cost: { type: "string", description: "Cost" },
      },
      required: ["product_id", "variant_id"],
    },
  },
  
  {
    name: "tiendanube_list_product_images",
    description: "List all images for a product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "tiendanube_create_product_image",
    description: "Create/add a new image to a product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        src: { type: "string", description: "Image URL" },
        position: { type: "number", description: "Image position" },
        alt: {
          type: "array",
          description: "Alt text array (localized)",
          items: { type: "string" },
        },
      },
      required: ["product_id", "src"],
    },
  },
  {
    name: "tiendanube_update_product_image",
    description: "Update product image properties (src, position, alt).",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "number", description: "Product ID" },
        image_id: { type: "number", description: "Image ID" },
        src: { type: "string", description: "Image URL" },
        position: { type: "number", description: "Image position" },
        alt: {
          type: "array",
          description: "Alt text array (localized)",
          items: { type: "string" },
        },
      },
      required: ["product_id", "image_id"],
    },
  },
  
  {
    name: "tiendanube_get_product",
    description:
      "Get detailed information about a specific product by ID, including variants, images, categories, and all metadata.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "number",
          description: "The unique ID of the product to retrieve",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
        language: {
          type: "string",
          description: "Language code (es, pt, en) for localized content",
          minLength: 2,
          maxLength: 2,
        },
      },
      required: ["product_id"],
    },
  },
  {
    name: "tiendanube_get_product_by_sku",
    description: "Get a product by its SKU.",
    inputSchema: {
      type: "object",
      properties: {
        sku: { type: "string", description: "Product SKU" },
      },
      required: ["sku"],
    },
  },
  {
    name: "tiendanube_update_stock_and_price",
    description: "Update the stock or price of multiple products and variants.",
    inputSchema: {
      type: "object",
      properties: {
        products: {
          type: "array",
          description: "List of products to update",
          items: {
            type: "object",
            properties: {
              id: { type: "number", description: "Product or Variant ID" },
              price: { type: "string", description: "New price" },
              stock: { type: "number", description: "New stock" },
            },
            required: ["id"],
          },
        },
      },
      required: ["products"],
    },
  },
  {
    name: "tiendanube_create_product",
    description:
      "Create a new product in the store. At minimum requires name and price. Supports multiple languages, variants, images, categories, and extensive metadata.",
    inputSchema: {
      type: "object",
      properties: {
        name_es: {
          type: "string",
          description: "Product name in Spanish (required)",
        },
        name_pt: {
          type: "string",
          description: "Product name in Portuguese",
        },
        name_en: {
          type: "string",
          description: "Product name in English",
        },
        description_es: {
          type: "string",
          description: "Product description in Spanish",
        },
        description_pt: {
          type: "string",
          description: "Product description in Portuguese",
        },
        description_en: {
          type: "string",
          description: "Product description in English",
        },
        price: {
          type: "string",
          description: "Product price (required)",
        },
        promotional_price: {
          type: "string",
          description: "Promotional/sale price",
        },
        sku: {
          type: "string",
          description: "Stock Keeping Unit code",
        },
        stock: {
          type: "number",
          description: "Stock quantity",
          minimum: 0,
        },
        stock_management: {
          type: "boolean",
          description: "Enable stock management for this product",
        },
        weight: {
          type: "string",
          description: "Product weight",
        },
        width: {
          type: "string",
          description: "Product width",
        },
        height: {
          type: "string",
          description: "Product height",
        },
        depth: {
          type: "string",
          description: "Product depth",
        },
        cost: {
          type: "string",
          description: "Product cost price",
        },
        published: {
          type: "boolean",
          description: "Whether the product is published",
        },
        free_shipping: {
          type: "boolean",
          description: "Whether the product has free shipping",
        },
        requires_shipping: {
          type: "boolean",
          description: "Whether the product requires shipping",
        },
        brand: {
          type: "string",
          description: "Product brand",
        },
        video_url: {
          type: "string",
          description: "Product video URL",
        },
        seo_title: {
          type: "string",
          description: "SEO title for the product",
        },
        seo_description: {
          type: "string",
          description: "SEO description for the product",
        },
        tags: {
          type: "string",
          description: "Comma-separated tags for the product",
        },
        categories: {
          type: "array",
          description: "Array of category IDs this product belongs to",
          items: {
            type: "number",
          },
        },
        image_urls: {
          type: "array",
          description: "Array of image URLs for the product",
          items: {
            type: "string",
          },
        },
      },
      required: ["name_es", "price"],
    },
  },
  {
    name: "tiendanube_update_product",
    description:
      "Update an existing product. All fields are optional except product_id. Only provided fields will be updated.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "number",
          description: "The unique ID of the product to update",
        },
        name_es: {
          type: "string",
          description: "Product name in Spanish",
        },
        name_pt: {
          type: "string",
          description: "Product name in Portuguese",
        },
        name_en: {
          type: "string",
          description: "Product name in English",
        },
        description_es: {
          type: "string",
          description: "Product description in Spanish",
        },
        description_pt: {
          type: "string",
          description: "Product description in Portuguese",
        },
        description_en: {
          type: "string",
          description: "Product description in English",
        },
        price: {
          type: "string",
          description: "Product price",
        },
        promotional_price: {
          type: "string",
          description: "Promotional/sale price",
        },
        sku: {
          type: "string",
          description: "Stock Keeping Unit code",
        },
        stock: {
          type: "number",
          description: "Stock quantity",
          minimum: 0,
        },
        stock_management: {
          type: "boolean",
          description: "Enable stock management for this product",
        },
        weight: {
          type: "string",
          description: "Product weight",
        },
        width: {
          type: "string",
          description: "Product width",
        },
        height: {
          type: "string",
          description: "Product height",
        },
        depth: {
          type: "string",
          description: "Product depth",
        },
        cost: {
          type: "string",
          description: "Product cost price",
        },
        published: {
          type: "boolean",
          description: "Whether the product is published",
        },
        free_shipping: {
          type: "boolean",
          description: "Whether the product has free shipping",
        },
        requires_shipping: {
          type: "boolean",
          description: "Whether the product requires shipping",
        },
        brand: {
          type: "string",
          description: "Product brand",
        },
        video_url: {
          type: "string",
          description: "Product video URL",
        },
        seo_title: {
          type: "string",
          description: "SEO title for the product",
        },
        seo_description: {
          type: "string",
          description: "SEO description for the product",
        },
        tags: {
          type: "string",
          description: "Comma-separated tags for the product",
        },
        categories: {
          type: "array",
          description: "Array of category IDs this product belongs to",
          items: {
            type: "number",
          },
        },
      },
      required: ["product_id"],
    },
  },
  
  {
    name: "tiendanube_search_products",
    description:
      "Search for products using a text query. Supports pagination and filtering by category and publication status.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to find products",
        },
        page: {
          type: "number",
          description: "Page number (starting from 1)",
          minimum: 1,
        },
        per_page: {
          type: "number",
          description: "Number of items per page (max 200)",
          minimum: 1,
          maximum: 200,
        },
        language: {
          type: "string",
          description: "Language code (es, pt, en) for localized content",
          minLength: 2,
          maxLength: 2,
        },
        category_id: {
          type: "number",
          description: "Filter by category ID",
        },
        published: {
          type: "boolean",
          description: "Filter by publication status",
        },
      },
      required: ["query"],
    },
  },
];

/**
 * Handle product tool calls
 */
export async function handleProductTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_get_product_custom_fields": {
        const { product_id } = GetProductCustomFieldsSchema.parse(args);
        const response = await client.get(`/products/${product_id}/custom_fields`);
        return response.data;
      }

      case "tiendanube_update_product_custom_fields": {
        const { product_id, custom_fields } =
          UpdateProductCustomFieldsSchema.parse(args);
        const response = await client.put(
          `/products/${product_id}/custom_fields`,
          custom_fields
        );
        return response.data;
      }

      case "tiendanube_get_product_variant_custom_fields": {
        const { product_id, variant_id } =
          GetProductVariantCustomFieldsSchema.parse(args);
        const response = await client.get(
          `/products/${product_id}/variants/${variant_id}/custom_fields`
        );
        return response.data;
      }

      case "tiendanube_update_product_variant_custom_fields": {
        const { product_id, variant_id, custom_fields } =
          UpdateProductVariantCustomFieldsSchema.parse(args);
        const response = await client.put(
          `/products/${product_id}/variants/${variant_id}/custom_fields`,
          custom_fields
        );
        return response.data;
      }
      case "tiendanube_list_products": {
        const validatedArgs = ListProductsSchema.parse(args ?? {});
        // Normalize date filters to RFC3339
        const normalize = (v: any) => {
          if (typeof v !== "string") return v;
          const d = new Date(v);
          return isNaN(d.getTime()) ? v : d.toISOString();
        };
        const params: any = { ...validatedArgs };
        [
          "created_at_min",
          "created_at_max",
          "updated_at_min",
          "updated_at_max",
        ].forEach((k) => {
          if (params[k]) params[k] = normalize(params[k]);
        });
        const response = await client.get("/products", params);
        return response.data;
      }

      case "tiendanube_get_product": {
        const validatedArgs = GetProductSchema.parse(args);
        const { product_id, ...params } = validatedArgs;
        const response = await client.get(`/products/${product_id}`, params);
        return response.data;
      }

      case "tiendanube_get_product_by_sku": {
        const { sku } = GetProductBySkuSchema.parse(args);
        const response = await client.get(`/products/sku/${sku}`);
        return response.data;
      }

      case "tiendanube_update_stock_and_price": {
        const { products } = UpdateStockAndPriceSchema.parse(args);
        const response = await client.patch("/products/stock-price", { products });
        return response.data;
      }

      case "tiendanube_create_product": {
        const validatedArgs = CreateProductSchema.parse(args);

        // Transform the flat structure to Tienda Nube API format
        const productData: any = {
          name: {},
          description: {},
          variants: [
            {
              price: validatedArgs.price,
              promotional_price: validatedArgs.promotional_price || null,
              stock: validatedArgs.stock || 0,
              stock_management: validatedArgs.stock_management || false,
              sku: validatedArgs.sku || null,
              weight: validatedArgs.weight || null,
              width: validatedArgs.width || null,
              height: validatedArgs.height || null,
              depth: validatedArgs.depth || null,
              cost: validatedArgs.cost || null,
            },
          ],
          published: validatedArgs.published ?? true,
          free_shipping: validatedArgs.free_shipping ?? false,
          requires_shipping: validatedArgs.requires_shipping !== false,
          brand: validatedArgs.brand || null,
          video_url: validatedArgs.video_url || null,
          seo_title: validatedArgs.seo_title || null,
          seo_description: validatedArgs.seo_description || null,
          tags: validatedArgs.tags || null,
          categories: validatedArgs.categories || [],
        };

        // Add multilingual names
        if (validatedArgs.name_es) productData.name.es = validatedArgs.name_es;
        if (validatedArgs.name_pt) productData.name.pt = validatedArgs.name_pt;
        if (validatedArgs.name_en) productData.name.en = validatedArgs.name_en;

        // Add multilingual descriptions
        if (validatedArgs.description_es)
          productData.description.es = validatedArgs.description_es;
        if (validatedArgs.description_pt)
          productData.description.pt = validatedArgs.description_pt;
        if (validatedArgs.description_en)
          productData.description.en = validatedArgs.description_en;

        // Add images if provided
        if (validatedArgs.image_urls && validatedArgs.image_urls.length > 0) {
          productData.images = validatedArgs.image_urls.map(
            (url: string, index: number) => ({
              src: url,
              position: index + 1,
            })
          );
        }

        const response = await client.post("/products", productData);
        return response.data;
      }

      case "tiendanube_update_product": {
        const validatedArgs = UpdateProductSchema.parse(args);
        const { product_id, ...updateData } = validatedArgs;

        // Transform the flat structure to Tienda Nube API format
        const productData: any = {};

        // Handle multilingual fields
        const nameFields = ["name_es", "name_pt", "name_en"];
        const descFields = [
          "description_es",
          "description_pt",
          "description_en",
        ];

        if (nameFields.some((field) => field in updateData)) {
          productData.name = {};
          if (updateData.name_es) productData.name.es = updateData.name_es;
          if (updateData.name_pt) productData.name.pt = updateData.name_pt;
          if (updateData.name_en) productData.name.en = updateData.name_en;
        }

        if (descFields.some((field) => field in updateData)) {
          productData.description = {};
          if (updateData.description_es)
            productData.description.es = updateData.description_es;
          if (updateData.description_pt)
            productData.description.pt = updateData.description_pt;
          if (updateData.description_en)
            productData.description.en = updateData.description_en;
        }

        // Handle variant fields (price, stock, etc.)
        const variantFields = [
          "price",
          "promotional_price",
          "stock",
          "stock_management",
          "sku",
          "weight",
          "width",
          "height",
          "depth",
          "cost",
        ];
        if (variantFields.some((field) => field in updateData)) {
          productData.variants = [{}];
          variantFields.forEach((field) => {
            if (field in updateData) {
              (productData.variants[0] as any)[field] = (updateData as any)[
                field
              ];
            }
          });
        }

        // Handle product-level fields
        const productFields = [
          "published",
          "free_shipping",
          "requires_shipping",
          "brand",
          "video_url",
          "seo_title",
          "seo_description",
          "tags",
          "categories",
        ];
        productFields.forEach((field) => {
          if (field in updateData) {
            (productData as any)[field] = (updateData as any)[field];
          }
        });

        const response = await client.put(
          `/products/${product_id}`,
          productData
        );
        return response.data;
      }

      case "tiendanube_delete_product": {
        return {
          success: false,
          error: "Delete operations are disabled by policy",
          type: "ProductError",
        };
      }

      case "tiendanube_search_products": {
        const validatedArgs = SearchProductsSchema.parse(args);
        const response = await client.get("/products", validatedArgs);
        return response.data;
      }

      // Variants
      case "tiendanube_list_product_variants": {
        const { product_id } = ListProductVariantsSchema.parse(args);
        const response = await client.get(
          `/products/${product_id}/variants`
        );
        return response.data;
      }

      case "tiendanube_get_product_variant": {
        const { product_id, variant_id } = GetProductVariantSchema.parse(args);
        const response = await client.get(
          `/products/${product_id}/variants/${variant_id}`
        );
        return response.data;
      }

      case "tiendanube_create_product_variant": {
        const { product_id, ...variant } = CreateProductVariantSchema.parse(args);
        const response = await client.post(
          `/products/${product_id}/variants`,
          variant
        );
        return response.data;
      }

      case "tiendanube_update_product_variant": {
        const { product_id, variant_id, ...update } =
          UpdateProductVariantSchema.parse(args);
        const response = await client.put(
          `/products/${product_id}/variants/${variant_id}`,
          update
        );
        return response.data;
      }

      case "tiendanube_delete_product_variant": {
        return {
          success: false,
          error: "Delete operations are disabled by policy",
          type: "ProductError",
        };
      }

      // Images
      case "tiendanube_list_product_images": {
        const { product_id } = ListProductImagesSchema.parse(args);
        const response = await client.get(`/products/${product_id}/images`);
        return response.data;
      }

      case "tiendanube_create_product_image": {
        const { product_id, ...image } = CreateProductImageSchema.parse(args);
        const response = await client.post(
          `/products/${product_id}/images`,
          image
        );
        return response.data;
      }

      case "tiendanube_update_product_image": {
        const { product_id, image_id, ...update } =
          UpdateProductImageSchema.parse(args);
        const response = await client.put(
          `/products/${product_id}/images/${image_id}`,
          update
        );
        return response.data;
      }

      case "tiendanube_delete_product_image": {
        return {
          success: false,
          error: "Delete operations are disabled by policy",
          type: "ProductError",
        };
      }

      default:
        throw new Error(`Unknown product tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "ProductError",
      };
    }
    throw error;
  }
}