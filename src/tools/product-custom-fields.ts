import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { z } from "zod";

/**
 * Product Custom Fields management tools for Tienda Nube API
 */

// Schemas
const ListProductCustomFieldsSchema = z.object({
  per_page: z.number().min(1).max(200).optional(),
  page: z.number().min(1).optional(),
});

const GetProductCustomFieldSchema = z.object({
  custom_field_id: z.string().describe("Custom field UUID"),
});

const CreateProductCustomFieldSchema = z.object({
  name: z.string().min(1).max(255).describe("Custom field name"),
  description: z.string().optional().describe("Custom field description"),
  value_type: z.enum(["text", "text_list", "numeric", "date"]).describe("Type of values this field accepts"),
  values: z.array(z.string()).optional().describe("Possible values (required for text_list type)"),
});

const UpdateProductCustomFieldSchema = z.object({
  custom_field_id: z.string().describe("Custom field UUID"),
  name: z.string().min(1).max(255).optional().describe("Custom field name"),
  description: z.string().optional().describe("Custom field description"),
  values: z.array(z.string()).optional().describe("Possible values"),
});

const DeleteProductCustomFieldSchema = z.object({
  custom_field_id: z.string().describe("Custom field UUID"),
});

const GetCustomFieldOwnersSchema = z.object({
  custom_field_id: z.string().describe("Custom field UUID"),
  per_page: z.number().min(1).max(200).optional(),
  page: z.number().min(1).optional(),
});

const UpdateProductCustomFieldValuesSchema = z.object({
  product_id: z.number().describe("Product ID"),
  custom_fields: z.array(z.object({
    id: z.string().describe("Custom field UUID"),
    values: z.array(z.string()).describe("Values to associate with this product"),
  })).describe("Custom fields and their values"),
});

export const productCustomFieldsTools: Tool[] = [
  {
    name: "tiendanube_list_product_custom_fields",
    description: "List all product custom fields with pagination support",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of items per page (1-200)",
          minimum: 1,
          maximum: 200,
        },
        page: {
          type: "number", 
          description: "Page number (starting from 1)",
          minimum: 1,
        },
      },
    },
  },
  {
    name: "tiendanube_get_product_custom_field",
    description: "Get details of a specific product custom field by ID",
    inputSchema: {
      type: "object",
      properties: {
        custom_field_id: {
          type: "string",
          description: "Custom field UUID",
        },
      },
      required: ["custom_field_id"],
    },
  },
  {
    name: "tiendanube_create_product_custom_field",
    description: "Create a new product custom field",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Custom field name",
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: "string",
          description: "Custom field description",
        },
        value_type: {
          type: "string",
          enum: ["text", "text_list", "numeric", "date"],
          description: "Type of values this field accepts",
        },
        values: {
          type: "array",
          items: { type: "string" },
          description: "Possible values (required for text_list type)",
        },
      },
      required: ["name", "value_type"],
    },
  },
  {
    name: "tiendanube_update_product_custom_field",
    description: "Update an existing product custom field",
    inputSchema: {
      type: "object",
      properties: {
        custom_field_id: {
          type: "string",
          description: "Custom field UUID",
        },
        name: {
          type: "string",
          description: "Custom field name",
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: "string",
          description: "Custom field description",
        },
        values: {
          type: "array",
          items: { type: "string" },
          description: "Possible values",
        },
      },
      required: ["custom_field_id"],
    },
  },
  {
    name: "tiendanube_delete_product_custom_field",
    description: "Delete a product custom field (only custom fields created by current app)",
    inputSchema: {
      type: "object",
      properties: {
        custom_field_id: {
          type: "string",
          description: "Custom field UUID",
        },
      },
      required: ["custom_field_id"],
    },
  },
  {
    name: "tiendanube_get_custom_field_owners",
    description: "List products associated with a specific custom field",
    inputSchema: {
      type: "object",
      properties: {
        custom_field_id: {
          type: "string",
          description: "Custom field UUID",
        },
        per_page: {
          type: "number",
          description: "Number of items per page (1-200)",
          minimum: 1,
          maximum: 200,
        },
        page: {
          type: "number",
          description: "Page number (starting from 1)",
          minimum: 1,
        },
      },
      required: ["custom_field_id"],
    },
  },
  {
    name: "tiendanube_update_product_custom_field_values",
    description: "Associate or disassociate custom field values with a specific product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "number",
          description: "Product ID",
        },
        custom_fields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Custom field UUID",
              },
              values: {
                type: "array",
                items: { type: "string" },
                description: "Values to associate with this product",
              },
            },
            required: ["id", "values"],
          },
          description: "Custom fields and their values",
        },
      },
      required: ["product_id", "custom_fields"],
    },
  },
];

/**
 * Handle product custom fields tool calls
 */
export async function handleProductCustomFieldsTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_product_custom_fields": {
        const validatedArgs = ListProductCustomFieldsSchema.parse(args ?? {});
        const response = await client.get("/products/custom-fields", validatedArgs);
        return response.data;
      }

      case "tiendanube_get_product_custom_field": {
        const { custom_field_id } = GetProductCustomFieldSchema.parse(args);
        const response = await client.get(`/products/custom-fields/${custom_field_id}`);
        return response.data;
      }

      case "tiendanube_create_product_custom_field": {
        const validatedArgs = CreateProductCustomFieldSchema.parse(args);
        const response = await client.post("/products/custom-fields", validatedArgs);
        return response.data;
      }

      case "tiendanube_update_product_custom_field": {
        const { custom_field_id, ...updateData } = UpdateProductCustomFieldSchema.parse(args);
        const response = await client.put(`/products/custom-fields/${custom_field_id}`, updateData);
        return response.data;
      }

      case "tiendanube_delete_product_custom_field": {
        const { custom_field_id } = DeleteProductCustomFieldSchema.parse(args);
        await client.delete(`/products/custom-fields/${custom_field_id}`);
        return { 
          success: true,
          message: `Custom field ${custom_field_id} deleted successfully`
        };
      }

      case "tiendanube_get_custom_field_owners": {
        const { custom_field_id, ...params } = GetCustomFieldOwnersSchema.parse(args);
        const response = await client.get(`/products/custom-fields/${custom_field_id}/owners`, params);
        return response.data;
      }

      case "tiendanube_update_product_custom_field_values": {
        const { product_id, custom_fields } = UpdateProductCustomFieldValuesSchema.parse(args);
        const response = await client.put(`/products/${product_id}/custom-fields/values`, {
          custom_fields
        });
        return response.data;
      }

      default:
        throw new Error(`Unknown product custom fields tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "ProductCustomFieldsError",
      };
    }
    throw error;
  }
}