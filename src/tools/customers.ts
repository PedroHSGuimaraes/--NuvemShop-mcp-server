import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListCustomersSchema,
  GetCustomerSchema,
  CreateCustomerSchema,
  UpdateCustomerSchema,
  DeleteCustomerSchema,
  SearchCustomersSchema,
} from "../schemas/mcp-tools.js";

/**
 * Customer management tools for Tienda Nube API
 */

export const customerTools: Tool[] = [
  {
    name: "tiendanube_list_customers",
    description:
      "List all customers in the store with optional pagination and filtering by creation/update dates and search queries.",
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
          description: "Only return customers with ID greater than this value",
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
        q: {
          type: "string",
          description: "Search query to filter customers by name or email",
        },
      },
    },
  },
  {
    name: "tiendanube_get_customer",
    description:
      "Get detailed information about a specific customer by ID, including contact information, addresses, and order history.",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "number",
          description: "The unique ID of the customer to retrieve",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "tiendanube_create_customer",
    description:
      "Create a new customer in the store. Requires name and email at minimum. Can include phone, identification, notes, and address information.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Customer full name (required)",
        },
        email: {
          type: "string",
          description: "Customer email address (required)",
        },
        phone: {
          type: "string",
          description: "Customer phone number",
        },
        identification: {
          type: "string",
          description: "Customer identification/document number",
        },
        note: {
          type: "string",
          description: "Internal notes about the customer",
        },
        address: {
          type: "string",
          description: "Customer address street",
        },
        city: {
          type: "string",
          description: "Customer city",
        },
        province: {
          type: "string",
          description: "Customer province/state",
        },
        country: {
          type: "string",
          description: "Customer country",
        },
        zipcode: {
          type: "string",
          description: "Customer ZIP/postal code",
        },
        number: {
          type: "string",
          description: "Address number",
        },
        floor: {
          type: "string",
          description: "Address floor/apartment",
        },
      },
      required: ["name", "email"],
    },
  },
  {
    name: "tiendanube_update_customer",
    description:
      "Update an existing customer. All fields are optional except customer_id. Only provided fields will be updated.",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "number",
          description: "The unique ID of the customer to update",
        },
        name: {
          type: "string",
          description: "Customer full name",
        },
        email: {
          type: "string",
          description: "Customer email address",
        },
        phone: {
          type: "string",
          description: "Customer phone number",
        },
        identification: {
          type: "string",
          description: "Customer identification/document number",
        },
        note: {
          type: "string",
          description: "Internal notes about the customer",
        },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "tiendanube_delete_customer",
    description:
      "Permanently delete a customer from the store. This action cannot be undone and will remove all customer data.",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "number",
          description: "The unique ID of the customer to delete",
        },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "tiendanube_search_customers",
    description:
      "Search for customers using a text query. Searches in customer names and email addresses with pagination support.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to find customers",
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
      },
      required: ["query"],
    },
  },
];

/**
 * Handle customer tool calls
 */
export async function handleCustomerTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_customers": {
        const validatedArgs = ListCustomersSchema.parse(args);
        const response = await client.get("/customers", {
          params: validatedArgs,
        });
        return response.data;
      }

      case "tiendanube_get_customer": {
        const validatedArgs = GetCustomerSchema.parse(args);
        const { customer_id, ...params } = validatedArgs;
        const response = await client.get(`/customers/${customer_id}`, {
          params,
        });
        return response.data;
      }

      case "tiendanube_create_customer": {
        const validatedArgs = CreateCustomerSchema.parse(args);

        // Transform the flat structure to Tienda Nube API format
        const customerData: any = {
          name: validatedArgs.name,
          email: validatedArgs.email,
          phone: validatedArgs.phone,
          identification: validatedArgs.identification,
          note: validatedArgs.note,
        };

        // Add address if provided
        const addressFields = [
          "address",
          "city",
          "province",
          "country",
          "zipcode",
          "number",
          "floor",
        ];
        if (addressFields.some((field) => (validatedArgs as any)[field])) {
          customerData.addresses = [
            {
              address: validatedArgs.address || "",
              city: validatedArgs.city || "",
              province: validatedArgs.province || "",
              country: validatedArgs.country || "",
              zipcode: validatedArgs.zipcode || "",
              number: validatedArgs.number || "",
              floor: validatedArgs.floor || "",
              name: validatedArgs.name,
              phone: validatedArgs.phone || "",
            },
          ];
        }

        const response = await client.post("/customers", customerData);
        return response.data;
      }

      case "tiendanube_update_customer": {
        const validatedArgs = UpdateCustomerSchema.parse(args);
        const { customer_id, ...updateData } = validatedArgs;

        const response = await client.put(
          `/customers/${customer_id}`,
          updateData
        );
        return response.data;
      }

      case "tiendanube_delete_customer": {
        const validatedArgs = DeleteCustomerSchema.parse(args);
        await client.delete(`/customers/${validatedArgs.customer_id}`);
        return {
          success: true,
          message: `Customer ${validatedArgs.customer_id} deleted successfully`,
        };
      }

      case "tiendanube_search_customers": {
        const validatedArgs = SearchCustomersSchema.parse(args);
        const response = await client.get("/customers", {
          params: validatedArgs,
        });
        return response.data;
      }

      default:
        throw new Error(`Unknown customer tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "CustomerError",
      };
    }
    throw error;
  }
}
