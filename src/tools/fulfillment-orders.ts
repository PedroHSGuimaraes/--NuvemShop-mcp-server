import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { z } from "zod";

/**
 * Fulfillment Orders management tools for Tienda Nube API
 */

// Schemas
const ListFulfillmentOrdersSchema = z.object({
  order_id: z.number().describe("Order ID"),
  per_page: z.number().min(1).max(200).optional(),
  page: z.number().min(1).optional(),
  status: z.enum(["open", "pending", "in_progress", "completed", "cancelled"]).optional(),
  created_at_min: z.string().optional().describe("Filter by minimum creation date (ISO 8601)"),
  created_at_max: z.string().optional().describe("Filter by maximum creation date (ISO 8601)"),
  updated_at_min: z.string().optional().describe("Filter by minimum update date (ISO 8601)"),
  updated_at_max: z.string().optional().describe("Filter by maximum update date (ISO 8601)"),
});

const GetFulfillmentOrderSchema = z.object({
  order_id: z.number().describe("Order ID"),
  fulfillment_order_id: z.number().describe("Fulfillment order ID"),
});

const CreateFulfillmentOrderSchema = z.object({
  order_id: z.number().describe("Order ID"),
  line_items: z.array(z.object({
    order_line_item_id: z.number().describe("Order line item ID"),
    quantity: z.number().int().positive().describe("Quantity to fulfill"),
  })).describe("Line items to fulfill"),
  location_id: z.number().optional().describe("Fulfillment location ID"),
  tracking_company: z.string().optional().describe("Shipping company name"),
  tracking_number: z.string().optional().describe("Tracking number"),
  tracking_url: z.string().url().optional().describe("Tracking URL"),
  notify_customer: z.boolean().optional().describe("Send notification to customer"),
});

const UpdateFulfillmentOrderSchema = z.object({
  order_id: z.number().describe("Order ID"),
  fulfillment_order_id: z.number().describe("Fulfillment order ID"),
  status: z.enum(["open", "pending", "in_progress", "completed", "cancelled"]).optional(),
  location_id: z.number().optional().describe("Fulfillment location ID"),
  tracking_company: z.string().optional().describe("Shipping company name"),
  tracking_number: z.string().optional().describe("Tracking number"),
  tracking_url: z.string().url().optional().describe("Tracking URL"),
  notify_customer: z.boolean().optional().describe("Send notification to customer"),
});

const DeleteFulfillmentOrderSchema = z.object({
  order_id: z.number().describe("Order ID"),
  fulfillment_order_id: z.number().describe("Fulfillment order ID"),
});

const CreateFulfillmentEventSchema = z.object({
  order_id: z.number().describe("Order ID"),
  fulfillment_order_id: z.number().describe("Fulfillment order ID"),
  status: z.enum(["label_printed", "label_purchased", "attempted_delivery", "ready_for_pickup", "picked_up", "in_transit", "out_for_delivery", "delivered", "failure"]).describe("Fulfillment event status"),
  happened_at: z.string().describe("When the event happened (ISO 8601)"),
  city: z.string().optional().describe("City where event happened"),
  province: z.string().optional().describe("Province where event happened"),
  country: z.string().optional().describe("Country where event happened"),
  address: z.string().optional().describe("Address where event happened"),
  zip: z.string().optional().describe("ZIP code where event happened"),
  message: z.string().optional().describe("Additional message about the event"),
  estimated_delivery_at: z.string().optional().describe("Estimated delivery date (ISO 8601)"),
});

export const fulfillmentOrderTools: Tool[] = [
  {
    name: "tiendanube_list_fulfillment_orders",
    description: "List all fulfillment orders for a specific order with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
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
        status: {
          type: "string",
          enum: ["open", "pending", "in_progress", "completed", "cancelled"],
          description: "Filter by fulfillment status",
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
      required: ["order_id"],
    },
  },
  {
    name: "tiendanube_get_fulfillment_order",
    description: "Get details of a specific fulfillment order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        fulfillment_order_id: {
          type: "number",
          description: "Fulfillment order ID",
        },
      },
      required: ["order_id", "fulfillment_order_id"],
    },
  },
  {
    name: "tiendanube_create_fulfillment_order",
    description: "Create a new fulfillment order for specific line items",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        line_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              order_line_item_id: {
                type: "number",
                description: "Order line item ID",
              },
              quantity: {
                type: "number",
                description: "Quantity to fulfill",
                minimum: 1,
              },
            },
            required: ["order_line_item_id", "quantity"],
          },
          description: "Line items to fulfill",
        },
        location_id: {
          type: "number",
          description: "Fulfillment location ID",
        },
        tracking_company: {
          type: "string",
          description: "Shipping company name",
        },
        tracking_number: {
          type: "string",
          description: "Tracking number",
        },
        tracking_url: {
          type: "string",
          description: "Tracking URL",
        },
        notify_customer: {
          type: "boolean",
          description: "Send notification to customer",
        },
      },
      required: ["order_id", "line_items"],
    },
  },
  {
    name: "tiendanube_update_fulfillment_order",
    description: "Update an existing fulfillment order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        fulfillment_order_id: {
          type: "number",
          description: "Fulfillment order ID",
        },
        status: {
          type: "string",
          enum: ["open", "pending", "in_progress", "completed", "cancelled"],
          description: "Fulfillment status",
        },
        location_id: {
          type: "number",
          description: "Fulfillment location ID",
        },
        tracking_company: {
          type: "string",
          description: "Shipping company name",
        },
        tracking_number: {
          type: "string",
          description: "Tracking number",
        },
        tracking_url: {
          type: "string",
          description: "Tracking URL",
        },
        notify_customer: {
          type: "boolean",
          description: "Send notification to customer",
        },
      },
      required: ["order_id", "fulfillment_order_id"],
    },
  },
  {
    name: "tiendanube_delete_fulfillment_order",
    description: "Delete a fulfillment order (cancels the fulfillment)",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        fulfillment_order_id: {
          type: "number",
          description: "Fulfillment order ID",
        },
      },
      required: ["order_id", "fulfillment_order_id"],
    },
  },
  {
    name: "tiendanube_create_fulfillment_event",
    description: "Create a tracking event for a fulfillment order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        fulfillment_order_id: {
          type: "number",
          description: "Fulfillment order ID",
        },
        status: {
          type: "string",
          enum: [
            "label_printed", "label_purchased", "attempted_delivery", 
            "ready_for_pickup", "picked_up", "in_transit", 
            "out_for_delivery", "delivered", "failure"
          ],
          description: "Fulfillment event status",
        },
        happened_at: {
          type: "string",
          description: "When the event happened (ISO 8601 format)",
        },
        city: {
          type: "string",
          description: "City where event happened",
        },
        province: {
          type: "string",
          description: "Province where event happened",
        },
        country: {
          type: "string",
          description: "Country where event happened",
        },
        address: {
          type: "string",
          description: "Address where event happened",
        },
        zip: {
          type: "string",
          description: "ZIP code where event happened",
        },
        message: {
          type: "string",
          description: "Additional message about the event",
        },
        estimated_delivery_at: {
          type: "string",
          description: "Estimated delivery date (ISO 8601 format)",
        },
      },
      required: ["order_id", "fulfillment_order_id", "status", "happened_at"],
    },
  },
];

/**
 * Handle fulfillment order tool calls
 */
export async function handleFulfillmentOrderTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_fulfillment_orders": {
        const { order_id, ...params } = ListFulfillmentOrdersSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/fulfillment_orders`, params);
        return response.data;
      }

      case "tiendanube_get_fulfillment_order": {
        const { order_id, fulfillment_order_id } = GetFulfillmentOrderSchema.parse(args);
        const response = await client.get(`/orders/${order_id}/fulfillment_orders/${fulfillment_order_id}`);
        return response.data;
      }

      case "tiendanube_create_fulfillment_order": {
        const { order_id, ...fulfillmentData } = CreateFulfillmentOrderSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/fulfillment_orders`, fulfillmentData);
        return response.data;
      }

      case "tiendanube_update_fulfillment_order": {
        const { order_id, fulfillment_order_id, ...updateData } = UpdateFulfillmentOrderSchema.parse(args);
        const response = await client.put(`/orders/${order_id}/fulfillment_orders/${fulfillment_order_id}`, updateData);
        return response.data;
      }

      case "tiendanube_delete_fulfillment_order": {
        const { order_id, fulfillment_order_id } = DeleteFulfillmentOrderSchema.parse(args);
        await client.delete(`/orders/${order_id}/fulfillment_orders/${fulfillment_order_id}`);
        return { 
          success: true,
          message: `Fulfillment order ${fulfillment_order_id} deleted successfully`
        };
      }

      case "tiendanube_create_fulfillment_event": {
        const { order_id, fulfillment_order_id, ...eventData } = CreateFulfillmentEventSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/fulfillment_orders/${fulfillment_order_id}/events`, eventData);
        return response.data;
      }

      default:
        throw new Error(`Unknown fulfillment order tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "FulfillmentOrderError",
      };
    }
    throw error;
  }
}