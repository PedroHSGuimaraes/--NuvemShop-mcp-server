import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListOrdersSchema,
  GetOrderSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  CancelOrderSchema,
  GetOrderFulfillmentSchema,
} from "../schemas/mcp-tools.js";

/**
 * Order management tools for Tienda Nube API
 */

export const orderTools: Tool[] = [
  {
    name: "tiendanube_list_orders",
    description:
      "List all orders in the store with comprehensive filtering options including status, payment status, shipping status, dates, totals, and customer information.",
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
          description: "Only return orders with ID greater than this value",
        },
        status: {
          type: "string",
          description: "Filter by order status",
          enum: ["any", "open", "closed", "cancelled"],
        },
        channels: {
          type: "string",
          description: "Filter by sales channel",
          enum: ["form", "store", "api", "meli", "pos"],
        },
        payment_status: {
          type: "string",
          description: "Filter by payment status",
          enum: [
            "any",
            "pending",
            "authorized",
            "paid",
            "abandoned",
            "refunded",
            "voided",
          ],
        },
        shipping_status: {
          type: "string",
          description: "Filter by shipping status",
          enum: ["any", "unpacked", "unfulfilled", "fulfilled"],
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
        total_min: {
          type: "string",
          description: "Filter by minimum order total",
        },
        total_max: {
          type: "string",
          description: "Filter by maximum order total",
        },
        customer_ids: {
          type: "string",
          description: "Comma-separated list of customer IDs to filter by",
        },
        q: {
          type: "string",
          description: "Search query to filter orders",
        },
        app_id: {
          type: "number",
          description: "Filter by app ID",
        },
        payment_methods: {
          type: "string",
          description: "Filter by payment methods",
        },
        payment_provider: {
          type: "string",
          description: "Filter by payment provider",
        },
        aggregates: {
          type: "string",
          description: "Include aggregated data",
          enum: ["fulfillment_orders"],
        },
      },
    },
  },
  {
    name: "tiendanube_get_order",
    description:
      "Get detailed information about a specific order by ID, including customer data, products, shipping, payment information, and fulfillment status.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "The unique ID of the order to retrieve",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_create_order",
    description:
      "Create a new order in the store. Requires customer information, products, and billing address. Supports multiple products, custom pricing, shipping options, and payment settings.",
    inputSchema: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Customer full name (required)",
        },
        customer_email: {
          type: "string",
          description: "Customer email address (required)",
        },
        customer_phone: {
          type: "string",
          description: "Customer phone number",
        },
        customer_document: {
          type: "string",
          description: "Customer document/ID number",
        },
        products: {
          type: "array",
          description: "Array of products in the order (required)",
          items: {
            type: "object",
            properties: {
              variant_id: {
                type: "number",
                description: "Product variant ID",
              },
              quantity: {
                type: "number",
                description: "Quantity of this product",
                minimum: 1,
              },
              price: {
                type: "string",
                description: "Custom price for this product (optional)",
              },
            },
            required: ["variant_id", "quantity"],
          },
          minItems: 1,
        },
        billing_address: {
          type: "string",
          description: "Billing address street (required)",
        },
        billing_city: {
          type: "string",
          description: "Billing address city (required)",
        },
        billing_province: {
          type: "string",
          description: "Billing address province/state (required)",
        },
        billing_country: {
          type: "string",
          description: "Billing address country (required)",
        },
        billing_zipcode: {
          type: "string",
          description: "Billing address ZIP/postal code (required)",
        },
        billing_number: {
          type: "string",
          description: "Billing address number (required)",
        },
        billing_floor: {
          type: "string",
          description: "Billing address floor/apartment",
        },
        billing_phone: {
          type: "string",
          description: "Billing address phone number",
        },
        shipping_address: {
          type: "string",
          description: "Shipping address street (if different from billing)",
        },
        shipping_city: {
          type: "string",
          description: "Shipping address city",
        },
        shipping_province: {
          type: "string",
          description: "Shipping address province/state",
        },
        shipping_country: {
          type: "string",
          description: "Shipping address country",
        },
        shipping_zipcode: {
          type: "string",
          description: "Shipping address ZIP/postal code",
        },
        shipping_number: {
          type: "string",
          description: "Shipping address number",
        },
        shipping_floor: {
          type: "string",
          description: "Shipping address floor/apartment",
        },
        shipping_phone: {
          type: "string",
          description: "Shipping address phone number",
        },
        currency: {
          type: "string",
          description: "Order currency (3-letter code)",
          minLength: 3,
          maxLength: 3,
        },
        language: {
          type: "string",
          description: "Order language (2-letter code)",
          minLength: 2,
          maxLength: 2,
        },
        gateway: {
          type: "string",
          description: "Payment gateway to use",
        },
        payment_status: {
          type: "string",
          description: "Initial payment status",
          enum: [
            "pending",
            "authorized",
            "paid",
            "voided",
            "refunded",
            "abandoned",
          ],
        },
        status: {
          type: "string",
          description: "Initial order status",
          enum: ["open", "closed", "cancelled"],
        },
        note: {
          type: "string",
          description: "Order notes/comments",
        },
        shipping_pickup_type: {
          type: "string",
          description: "Shipping method",
          enum: ["pickup", "ship"],
        },
        shipping_cost_customer: {
          type: "string",
          description: "Shipping cost charged to customer",
        },
        shipping_cost_owner: {
          type: "string",
          description: "Actual shipping cost for store owner",
        },
        send_confirmation_email: {
          type: "boolean",
          description: "Whether to send order confirmation email",
        },
        send_fulfillment_email: {
          type: "boolean",
          description: "Whether to send fulfillment notification email",
        },
        location_id: {
          type: "string",
          description: "Store location ID for pickup orders",
        },
      },
      required: [
        "customer_name",
        "customer_email",
        "products",
        "billing_address",
        "billing_city",
        "billing_province",
        "billing_country",
        "billing_zipcode",
        "billing_number",
      ],
    },
  },
  {
    name: "tiendanube_update_order",
    description:
      "Update an existing order. Allows updating owner notes and order status. Limited fields can be modified after order creation.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "The unique ID of the order to update",
        },
        owner_note: {
          type: "string",
          description: "Internal notes for store owner",
        },
        status: {
          type: "string",
          description: "Order status",
          enum: ["open", "closed", "cancelled"],
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_cancel_order",
    description:
      "Cancel an existing order. This will set the order status to cancelled and may trigger refund processes.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "The unique ID of the order to cancel",
        },
        reason: {
          type: "string",
          description: "Reason for cancellation",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_order_fulfillment",
    description:
      "Get fulfillment information for an order, including shipping details, tracking information, and fulfillment status.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "The unique ID of the order",
        },
      },
      required: ["order_id"],
    },
  },
];

/**
 * Handle order tool calls
 */
export async function handleOrderTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_orders": {
        const validatedArgs = ListOrdersSchema.parse(args);
        const response = await client.get("/orders", { params: validatedArgs });
        return response.data;
      }

      case "tiendanube_get_order": {
        const validatedArgs = GetOrderSchema.parse(args);
        const { order_id, ...params } = validatedArgs;
        const response = await client.get(`/orders/${order_id}`, { params });
        return response.data;
      }

      case "tiendanube_create_order": {
        const validatedArgs = CreateOrderSchema.parse(args);

        // Transform the flat structure to Tienda Nube API format
        const orderData: any = {
          currency: validatedArgs.currency || "USD",
          language: validatedArgs.language || "es",
          gateway: validatedArgs.gateway,
          payment_status: validatedArgs.payment_status || "pending",
          status: validatedArgs.status || "open",
          products: validatedArgs.products,
          customer: {
            name: validatedArgs.customer_name,
            email: validatedArgs.customer_email,
            phone: validatedArgs.customer_phone,
            document: validatedArgs.customer_document,
          },
          note: validatedArgs.note,
          billing_address: {
            address: validatedArgs.billing_address,
            city: validatedArgs.billing_city,
            province: validatedArgs.billing_province,
            country: validatedArgs.billing_country,
            zipcode: validatedArgs.billing_zipcode,
            number: validatedArgs.billing_number,
            floor: validatedArgs.billing_floor,
            phone: validatedArgs.billing_phone,
            name: validatedArgs.customer_name,
          },
          shipping_address: {
            address:
              validatedArgs.shipping_address || validatedArgs.billing_address,
            city: validatedArgs.shipping_city || validatedArgs.billing_city,
            province:
              validatedArgs.shipping_province || validatedArgs.billing_province,
            country:
              validatedArgs.shipping_country || validatedArgs.billing_country,
            zipcode:
              validatedArgs.shipping_zipcode || validatedArgs.billing_zipcode,
            number:
              validatedArgs.shipping_number || validatedArgs.billing_number,
            floor: validatedArgs.shipping_floor || validatedArgs.billing_floor,
            phone: validatedArgs.shipping_phone || validatedArgs.billing_phone,
            name: validatedArgs.customer_name,
          },
          shipping_pickup_type: validatedArgs.shipping_pickup_type || "ship",
          shipping_cost_customer: validatedArgs.shipping_cost_customer,
          shipping_cost_owner: validatedArgs.shipping_cost_owner,
          send_confirmation_email:
            validatedArgs.send_confirmation_email !== false,
          send_fulfillment_email:
            validatedArgs.send_fulfillment_email !== false,
          location_id: validatedArgs.location_id,
        };

        const response = await client.post("/orders", orderData);
        return response.data;
      }

      case "tiendanube_update_order": {
        const validatedArgs = UpdateOrderSchema.parse(args);
        const { order_id, ...updateData } = validatedArgs;

        const response = await client.put(`/orders/${order_id}`, updateData);
        return response.data;
      }

      case "tiendanube_cancel_order": {
        const validatedArgs = CancelOrderSchema.parse(args);

        // Cancel order by setting status to cancelled
        const updateData: any = {
          status: "cancelled",
        };

        if (validatedArgs.reason) {
          updateData.owner_note = validatedArgs.reason;
        }

        const response = await client.put(
          `/orders/${validatedArgs.order_id}`,
          updateData
        );
        return {
          success: true,
          message: `Order ${validatedArgs.order_id} cancelled successfully`,
          order: response.data,
        };
      }

      case "tiendanube_get_order_fulfillment": {
        const validatedArgs = GetOrderFulfillmentSchema.parse(args);

        // Get fulfillment information
        const response = await client.get(
          `/orders/${validatedArgs.order_id}/fulfillment_orders`
        );
        return response.data;
      }

      default:
        throw new Error(`Unknown order tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "OrderError",
      };
    }
    throw error;
  }
}
