import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListProductsSchema,
  GetProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  DeleteProductSchema,
  SearchProductsSchema,
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
    name: "tiendanube_delete_product",
    description:
      "Permanently delete a product from the store. This action cannot be undone.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "number",
          description: "The unique ID of the product to delete",
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
      case "tiendanube_list_products": {
        const validatedArgs = ListProductsSchema.parse(args);
        const response = await client.get("/products", {
          params: validatedArgs,
        });
        return response.data;
      }

      case "tiendanube_get_product": {
        const validatedArgs = GetProductSchema.parse(args);
        const { product_id, ...params } = validatedArgs;
        const response = await client.get(`/products/${product_id}`, {
          params,
        });
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
          published: validatedArgs.published || true,
          free_shipping: validatedArgs.free_shipping || false,
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
        const validatedArgs = DeleteProductSchema.parse(args);
        await client.delete(`/products/${validatedArgs.product_id}`);
        return {
          success: true,
          message: `Product ${validatedArgs.product_id} deleted successfully`,
        };
      }

      case "tiendanube_search_products": {
        const validatedArgs = SearchProductsSchema.parse(args);
        const response = await client.get("/products", {
          params: validatedArgs,
        });
        return response.data;
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
