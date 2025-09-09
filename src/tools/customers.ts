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
      "👥 LIST ALL CUSTOMERS - Retrieve a paginated list of store customers with filtering and search capabilities. Use this for customer management, analytics, segmentation, and finding specific customers. Supports filtering by creation/update dates, text search by name/email/identification, and pagination for large customer bases. Returns customer profiles with contact info, spending totals, and order history.",
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
      "🔍 GET SPECIFIC CUSTOMER - Retrieve complete details for a single customer by their unique ID. Use this when you need comprehensive customer information including personal details, contact info, billing/shipping addresses, total spent, last order, account status, and custom extra fields. Essential for customer service, account management, and personalized marketing.",
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
      "➕ CREATE NEW CUSTOMER - Create a new customer account with complete profile information. Use this for customer registration, manual account creation, bulk imports, or integrating with external systems. Requires name and email as minimum fields. Supports phone, identification documents, addresses, notes, passwords, and email invitation sending. Ideal for onboarding and customer management.",
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
      "✏️ UPDATE CUSTOMER - Modify existing customer information including personal details, contact information, and internal notes. Use this for customer profile updates, data corrections, preference changes, and maintaining accurate customer records. All fields are optional except customer_id - only provided fields will be updated, preserving existing data.",
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
  // Delete customer tool disabled by policy
  {
    name: "tiendanube_search_customers",
    description:
      "🔎 SEARCH CUSTOMERS - Find customers using text search across names, emails, and identification numbers. Use this for quick customer lookup, support queries, order assignment, and customer service scenarios. Supports pagination for large result sets. More flexible than listing with specific filters when you need fuzzy matching or don't know exact customer details.",
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
        return {
          success: false,
          error: "Delete operations are disabled by policy",
          type: "CustomerError",
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
