import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListCategoriesSchema,
  GetCategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  DeleteCategorySchema,
  ListCouponsSchema,
  GetCouponSchema,
  CreateCouponSchema,
  UpdateCouponSchema,
  DeleteCouponSchema,
} from "../schemas/mcp-tools.js";

/**
 * Category and Coupon management tools for Tienda Nube API
 */

export const categoryTools: Tool[] = [
  {
    name: "tiendanube_list_categories",
    description:
      "List all product categories in the store with optional filtering by parent category, search query, and creation/update dates.",
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
        since_id: {
          type: "number",
          description: "Only return categories with ID greater than this value",
        },
        language: {
          type: "string",
          description: "Language code (es, pt, en) for localized content",
          minLength: 2,
          maxLength: 2,
        },
        q: {
          type: "string",
          description: "Search query to filter categories",
        },
        parent_id: {
          type: "number",
          description: "Filter by parent category ID",
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
      },
    },
  },
  {
    name: "tiendanube_get_category",
    description:
      "Get detailed information about a specific category by ID, including name, description, parent category, and subcategories.",
    inputSchema: {
      type: "object",
      properties: {
        category_id: {
          type: "number",
          description: "The unique ID of the category to retrieve",
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
      required: ["category_id"],
    },
  },
  {
    name: "tiendanube_create_category",
    description:
      "Create a new product category. Supports multiple languages, parent-child relationships, and Google Shopping integration.",
    inputSchema: {
      type: "object",
      properties: {
        name_es: {
          type: "string",
          description: "Category name in Spanish (required)",
        },
        name_pt: {
          type: "string",
          description: "Category name in Portuguese",
        },
        name_en: {
          type: "string",
          description: "Category name in English",
        },
        description_es: {
          type: "string",
          description: "Category description in Spanish",
        },
        description_pt: {
          type: "string",
          description: "Category description in Portuguese",
        },
        description_en: {
          type: "string",
          description: "Category description in English",
        },
        parent_id: {
          type: "number",
          description: "Parent category ID (for subcategories)",
        },
        google_shopping_category: {
          type: "string",
          description: "Google Shopping category mapping",
        },
      },
      required: ["name_es"],
    },
  },
  {
    name: "tiendanube_update_category",
    description:
      "Update an existing category. All fields are optional except category_id. Only provided fields will be updated.",
    inputSchema: {
      type: "object",
      properties: {
        category_id: {
          type: "number",
          description: "The unique ID of the category to update",
        },
        name_es: {
          type: "string",
          description: "Category name in Spanish",
        },
        name_pt: {
          type: "string",
          description: "Category name in Portuguese",
        },
        name_en: {
          type: "string",
          description: "Category name in English",
        },
        description_es: {
          type: "string",
          description: "Category description in Spanish",
        },
        description_pt: {
          type: "string",
          description: "Category description in Portuguese",
        },
        description_en: {
          type: "string",
          description: "Category description in English",
        },
        parent_id: {
          type: "number",
          description: "Parent category ID (for subcategories)",
        },
        google_shopping_category: {
          type: "string",
          description: "Google Shopping category mapping",
        },
      },
      required: ["category_id"],
    },
  },
  {
    name: "tiendanube_delete_category",
    description:
      "Permanently delete a category. Products in this category will be moved to the parent category or become uncategorized.",
    inputSchema: {
      type: "object",
      properties: {
        category_id: {
          type: "number",
          description: "The unique ID of the category to delete",
        },
      },
      required: ["category_id"],
    },
  },
];

export const couponTools: Tool[] = [
  {
    name: "tiendanube_list_coupons",
    description:
      "List all discount coupons in the store with optional filtering by code, type, validity, and creation/update dates.",
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
        since_id: {
          type: "number",
          description: "Only return coupons with ID greater than this value",
        },
        code: {
          type: "string",
          description: "Filter by coupon code",
        },
        type: {
          type: "string",
          description: "Filter by coupon type",
          enum: ["percentage", "absolute"],
        },
        valid: {
          type: "boolean",
          description: "Filter by validity status",
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
      },
    },
  },
  {
    name: "tiendanube_get_coupon",
    description:
      "Get detailed information about a specific coupon by ID, including discount value, usage limits, and validity period.",
    inputSchema: {
      type: "object",
      properties: {
        coupon_id: {
          type: "number",
          description: "The unique ID of the coupon to retrieve",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["coupon_id"],
    },
  },
  {
    name: "tiendanube_create_coupon",
    description:
      "Create a new discount coupon. Can be percentage-based or fixed amount, with optional usage limits, validity period, and product/category restrictions.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Unique coupon code (required)",
        },
        type: {
          type: "string",
          description: "Discount type (required)",
          enum: ["percentage", "absolute"],
        },
        value: {
          type: "string",
          description: "Discount value (required)",
        },
        valid: {
          type: "boolean",
          description: "Whether the coupon is valid/active",
        },
        max_uses: {
          type: "number",
          description: "Maximum number of times the coupon can be used",
          minimum: 1,
        },
        min_price: {
          type: "string",
          description: "Minimum order value required to use the coupon",
        },
        start_date: {
          type: "string",
          description: "Start date for coupon validity (ISO 8601)",
        },
        end_date: {
          type: "string",
          description: "End date for coupon validity (ISO 8601)",
        },
        categories: {
          type: "array",
          description: "Array of category IDs the coupon applies to",
          items: {
            type: "number",
          },
        },
        products: {
          type: "array",
          description: "Array of product IDs the coupon applies to",
          items: {
            type: "number",
          },
        },
      },
      required: ["code", "type", "value"],
    },
  },
  {
    name: "tiendanube_update_coupon",
    description:
      "Update an existing coupon. All fields are optional except coupon_id. Only provided fields will be updated.",
    inputSchema: {
      type: "object",
      properties: {
        coupon_id: {
          type: "number",
          description: "The unique ID of the coupon to update",
        },
        code: {
          type: "string",
          description: "Unique coupon code",
        },
        type: {
          type: "string",
          description: "Discount type",
          enum: ["percentage", "absolute"],
        },
        value: {
          type: "string",
          description: "Discount value",
        },
        valid: {
          type: "boolean",
          description: "Whether the coupon is valid/active",
        },
        max_uses: {
          type: "number",
          description: "Maximum number of times the coupon can be used",
          minimum: 1,
        },
        min_price: {
          type: "string",
          description: "Minimum order value required to use the coupon",
        },
        start_date: {
          type: "string",
          description: "Start date for coupon validity (ISO 8601)",
        },
        end_date: {
          type: "string",
          description: "End date for coupon validity (ISO 8601)",
        },
        categories: {
          type: "array",
          description: "Array of category IDs the coupon applies to",
          items: {
            type: "number",
          },
        },
        products: {
          type: "array",
          description: "Array of product IDs the coupon applies to",
          items: {
            type: "number",
          },
        },
      },
      required: ["coupon_id"],
    },
  },
  {
    name: "tiendanube_delete_coupon",
    description:
      "Permanently delete a coupon. This action cannot be undone and will invalidate any pending uses of the coupon.",
    inputSchema: {
      type: "object",
      properties: {
        coupon_id: {
          type: "number",
          description: "The unique ID of the coupon to delete",
        },
      },
      required: ["coupon_id"],
    },
  },
];

/**
 * Handle category and coupon tool calls
 */
export async function handleCategoryTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_categories": {
        const validatedArgs = ListCategoriesSchema.parse(args);
        const response = await client.get("/categories", {
          params: validatedArgs,
        });
        return response.data;
      }

      case "tiendanube_get_category": {
        const validatedArgs = GetCategorySchema.parse(args);
        const { category_id, ...params } = validatedArgs;
        const response = await client.get(`/categories/${category_id}`, {
          params,
        });
        return response.data;
      }

      case "tiendanube_create_category": {
        const validatedArgs = CreateCategorySchema.parse(args);

        // Transform the flat structure to Tienda Nube API format
        const categoryData: any = {
          name: {},
          description: {},
          parent: validatedArgs.parent_id || null,
          google_shopping_category:
            validatedArgs.google_shopping_category || null,
        };

        // Add multilingual names
        if (validatedArgs.name_es) categoryData.name.es = validatedArgs.name_es;
        if (validatedArgs.name_pt) categoryData.name.pt = validatedArgs.name_pt;
        if (validatedArgs.name_en) categoryData.name.en = validatedArgs.name_en;

        // Add multilingual descriptions
        if (validatedArgs.description_es)
          categoryData.description.es = validatedArgs.description_es;
        if (validatedArgs.description_pt)
          categoryData.description.pt = validatedArgs.description_pt;
        if (validatedArgs.description_en)
          categoryData.description.en = validatedArgs.description_en;

        const response = await client.post("/categories", categoryData);
        return response.data;
      }

      case "tiendanube_update_category": {
        const validatedArgs = UpdateCategorySchema.parse(args);
        const { category_id, ...updateData } = validatedArgs;

        // Transform the flat structure to Tienda Nube API format
        const categoryData: any = {};

        // Handle multilingual fields
        const nameFields = ["name_es", "name_pt", "name_en"];
        const descFields = [
          "description_es",
          "description_pt",
          "description_en",
        ];

        if (nameFields.some((field) => field in updateData)) {
          categoryData.name = {};
          if (updateData.name_es) categoryData.name.es = updateData.name_es;
          if (updateData.name_pt) categoryData.name.pt = updateData.name_pt;
          if (updateData.name_en) categoryData.name.en = updateData.name_en;
        }

        if (descFields.some((field) => field in updateData)) {
          categoryData.description = {};
          if (updateData.description_es)
            categoryData.description.es = updateData.description_es;
          if (updateData.description_pt)
            categoryData.description.pt = updateData.description_pt;
          if (updateData.description_en)
            categoryData.description.en = updateData.description_en;
        }

        // Handle other fields
        if ("parent_id" in updateData)
          categoryData.parent = updateData.parent_id;
        if ("google_shopping_category" in updateData)
          categoryData.google_shopping_category =
            updateData.google_shopping_category;

        const response = await client.put(
          `/categories/${category_id}`,
          categoryData
        );
        return response.data;
      }

      case "tiendanube_delete_category": {
        const validatedArgs = DeleteCategorySchema.parse(args);
        await client.delete(`/categories/${validatedArgs.category_id}`);
        return {
          success: true,
          message: `Category ${validatedArgs.category_id} deleted successfully`,
        };
      }

      default:
        throw new Error(`Unknown category tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "CategoryError",
      };
    }
    throw error;
  }
}

export async function handleCouponTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_coupons": {
        const validatedArgs = ListCouponsSchema.parse(args);
        const response = await client.get("/coupons", {
          params: validatedArgs,
        });
        return response.data;
      }

      case "tiendanube_get_coupon": {
        const validatedArgs = GetCouponSchema.parse(args);
        const { coupon_id, ...params } = validatedArgs;
        const response = await client.get(`/coupons/${coupon_id}`, { params });
        return response.data;
      }

      case "tiendanube_create_coupon": {
        const validatedArgs = CreateCouponSchema.parse(args);
        const response = await client.post("/coupons", validatedArgs);
        return response.data;
      }

      case "tiendanube_update_coupon": {
        const validatedArgs = UpdateCouponSchema.parse(args);
        const { coupon_id, ...updateData } = validatedArgs;
        const response = await client.put(`/coupons/${coupon_id}`, updateData);
        return response.data;
      }

      case "tiendanube_delete_coupon": {
        const validatedArgs = DeleteCouponSchema.parse(args);
        await client.delete(`/coupons/${validatedArgs.coupon_id}`);
        return {
          success: true,
          message: `Coupon ${validatedArgs.coupon_id} deleted successfully`,
        };
      }

      default:
        throw new Error(`Unknown coupon tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "CouponError",
      };
    }
    throw error;
  }
}
