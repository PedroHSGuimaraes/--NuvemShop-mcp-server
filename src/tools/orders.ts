import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListOrdersSchema,
  GetOrderSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  CancelOrderSchema,
  GetOrderFulfillmentSchema,
  GetOrderCustomFieldsSchema,
  UpdateOrderCustomFieldsSchema,
  MarkOrderAsPaidSchema,
  CloseOrderSchema,
  ReopenOrderSchema,
  CreateInvoiceSchema,
  GetInvoiceSchema,
  GetOrderValueHistorySchema,
  GetOrderEditHistorySchema,
  ListDraftOrdersSchema,
  GetDraftOrderSchema,
  GetFulfillmentOrderSchema,
  ListOrderTransactionsSchema,
  GetOrderTransactionSchema,
} from "../schemas/mcp-tools.js";

/**
 * Order management tools for Tienda Nube API
 */

export const orderTools: Tool[] = [
  {
    name: "tiendanube_list_orders",
    description:
      "📋 LIST ALL ORDERS - Retrieve a paginated list of store orders with comprehensive filtering capabilities. Use this for order management, analytics, and finding specific orders. Supports filtering by status, payment state, shipping status, date ranges, total values, customer IDs, and text search. Returns order details including customer info, products, totals, and fulfillment data.",
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
    name: "tiendanube_get_order_custom_fields",
    description:
      "GET ORDER CUSTOM FIELDS - Retrieve all custom fields for a specific order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_update_order_custom_fields",
    description:
      "UPDATE ORDER CUSTOM FIELDS - Replace or set custom fields for an order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
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
      required: ["order_id", "custom_fields"],
    },
  },
  {
    name: "tiendanube_get_order",
    description:
      "🔍 GET SPECIFIC ORDER - Retrieve complete details for a single order by its unique ID. Use this when you need comprehensive information about a specific order including customer data, product line items, pricing, shipping address, payment details, fulfillment status, tracking info, and order history. Essential for order processing, customer service, and detailed analysis.",
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
      "➕ CREATE NEW ORDER - Create a new order programmatically with complete customer and product information. Use this for manual order creation, bulk imports, external integrations, or processing orders from other channels. Requires customer details (name, email), product variants with quantities, and billing address. Supports custom pricing, shipping options, payment gateway selection, and inventory management.",
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
      "✏️ UPDATE ORDER - Modify specific fields of an existing order. Use this to update order status (open/closed/cancelled) or add internal owner notes for order management. Limited to certain fields after order creation to maintain data integrity. Commonly used for order state management and adding administrative comments.",
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
      "❌ CANCEL ORDER - Cancel an existing order and optionally specify the cancellation reason. Use this for order cancellations due to customer requests, fraud detection, inventory issues, or other business reasons. Sets order status to 'cancelled' and may trigger automatic refund processes depending on payment status. Important for order management and customer service.",
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
      "📦 GET ORDER FULFILLMENT - Retrieve detailed fulfillment and shipping information for a specific order. Use this to track order fulfillment status, shipping details, carrier information, tracking numbers, delivery dates, and fulfillment order line items. Essential for logistics management, customer support, and shipping status updates.",
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
  {
    name: "tiendanube_mark_order_as_paid",
    description: "MARK ORDER AS PAID - Mark an order as paid.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_list_draft_orders",
    description:
      "LIST DRAFT ORDERS - Retrieve paginated draft orders (quotes) with optional date filters.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Items per page" },
        fields: { type: "string", description: "Fields filter" },
        since_id: { type: "number", description: "Since ID" },
        created_at_min: { type: "string", description: "Created after (ISO)" },
        created_at_max: { type: "string", description: "Created before (ISO)" },
        updated_at_min: { type: "string", description: "Updated after (ISO)" },
        updated_at_max: { type: "string", description: "Updated before (ISO)" },
      },
    },
  },
  {
    name: "tiendanube_get_draft_order",
    description:
      "GET DRAFT ORDER - Retrieve a single draft order by ID.",
    inputSchema: {
      type: "object",
      properties: {
        draft_order_id: { type: "number", description: "Draft order ID" },
        fields: { type: "string", description: "Fields filter" },
      },
      required: ["draft_order_id"],
    },
  },
  {
    name: "tiendanube_get_fulfillment_order",
    description:
      "GET FULFILLMENT ORDER - Retrieve a fulfillment order by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        fulfillment_order_id: { type: "number", description: "Fulfillment order ID" },
      },
      required: ["fulfillment_order_id"],
    },
  },
  {
    name: "tiendanube_list_order_transactions",
    description:
      "LIST ORDER TRANSACTIONS - Retrieve transactions for a given order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Items per page" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_order_transaction",
    description:
      "GET ORDER TRANSACTION - Retrieve a single transaction by order and transaction IDs.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
        transaction_id: { type: "number", description: "Transaction ID" },
      },
      required: ["order_id", "transaction_id"],
    },
  },
  {
    name: "tiendanube_close_order",
    description: "CLOSE ORDER - Close (archive) an order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_reopen_order",
    description: "REOPEN ORDER - Reopen a previously closed order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_create_invoice",
    description: "CREATE INVOICE - Create an invoice for an order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_invoice",
    description: "GET INVOICE - Retrieve an invoice for an order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_order_value_history",
    description: "GET ORDER VALUE HISTORY - Get a history of an order's total value changes.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_order_edit_history",
    description: "GET ORDER EDIT HISTORY - Retrieve a log of all changes made to an order.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "number", description: "Order ID" },
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
        const validatedArgs = ListOrdersSchema.parse(args ?? {});
        // Normalize date filters to RFC3339 UTC to avoid API format issues
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
        const response = await client.get("/orders", params);
        return response.data;
      }

      case "tiendanube_get_order_custom_fields": {
        const { order_id } = GetOrderCustomFieldsSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/custom_fields`);
        return response.data;
      }

      case "tiendanube_update_order_custom_fields": {
        const { order_id, custom_fields } =
          UpdateOrderCustomFieldsSchema.parse(args);
        const response = await client.put(
          `/orders/${order_id}/custom_fields`,
          custom_fields
        );
        return response.data;
      }

      case "tiendanube_get_order": {
        const validatedArgs = GetOrderSchema.parse(args);
        const { order_id, ...params } = validatedArgs;
        const response = await client.get(`/orders/${order_id}`, params);
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
        const { order_id, reason } = validatedArgs;
        const response = await client.post(`/orders/${order_id}/cancel`, { reason });
        return {
          success: true,
          message: `Order ${order_id} cancelled successfully`,
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

      case "tiendanube_mark_order_as_paid": {
        const { order_id } = MarkOrderAsPaidSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/pay`);
        return response.data;
      }

      // Draft orders
      case "tiendanube_list_draft_orders": {
        const validatedArgs = ListDraftOrdersSchema.parse(args ?? {});
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
        const response = await client.get("/draft_orders", params);
        return response.data;
      }

      case "tiendanube_get_draft_order": {
        const { draft_order_id, ...params } = GetDraftOrderSchema.parse(args);
        const response = await client.get(`/draft_orders/${draft_order_id}`, params);
        return response.data;
      }

      // Fulfillment order by ID
      case "tiendanube_get_fulfillment_order": {
        const { fulfillment_order_id } = GetFulfillmentOrderSchema.parse(args);
        const response = await client.get(`/fulfillment_orders/${fulfillment_order_id}`);
        return response.data;
      }

      // Order transactions
      case "tiendanube_list_order_transactions": {
        const { order_id, ...params } = ListOrderTransactionsSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/transactions`, params as any);
        return response.data;
      }

      case "tiendanube_get_order_transaction": {
        const { order_id, transaction_id } = GetOrderTransactionSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/transactions/${transaction_id}`);
        return response.data;
      }

      case "tiendanube_close_order": {
        const { order_id } = CloseOrderSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/close`);
        return response.data;
      }

      case "tiendanube_reopen_order": {
        const { order_id } = ReopenOrderSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/reopen`);
        return response.data;
      }

      case "tiendanube_create_invoice": {
        const { order_id } = CreateInvoiceSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/invoice`);
        return response.data;
      }

      case "tiendanube_get_invoice": {
        const { order_id } = GetInvoiceSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/invoice`);
        return response.data;
      }

      case "tiendanube_get_order_value_history": {
        const { order_id } = GetOrderValueHistorySchema.parse(args);
        const response = await client.get(`/orders/${order_id}/history/values`);
        return response.data;
      }

      case "tiendanube_get_order_edit_history": {
        const { order_id } = GetOrderEditHistorySchema.parse(args);
        const response = await client.get(`/orders/${order_id}/history/editions`);
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
