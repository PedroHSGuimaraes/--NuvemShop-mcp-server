import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListWebhooksSchema,
  GetWebhookSchema,
  CreateWebhookSchema,
  UpdateWebhookSchema,
  DeleteWebhookSchema,
} from "../schemas/mcp-tools.js";

/**
 * Webhook management tools for Tienda Nube API
 */

export const webhookTools: Tool[] = [
  {
    name: "tiendanube_list_webhooks",
    description:
      "🔗 LIST ALL WEBHOOKS - Retrieve all configured webhook endpoints for real-time event notifications. Use this for integration management, webhook monitoring, debugging connectivity issues, and auditing external system integrations. Supports filtering by URL, event type, and date ranges. Essential for maintaining API integrations and event-driven architectures.",
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
          description: "Only return webhooks with ID greater than this value",
        },
        url: {
          type: "string",
          description: "Filter by webhook URL",
        },
        event: {
          type: "string",
          description: "Filter by event type",
          enum: [
            "app/uninstalled",
            "app/suspended",
            "app/resumed",
            "category/created",
            "category/updated",
            "category/deleted",
            "customer/created",
            "customer/updated",
            "customer/deleted",
            "order/created",
            "order/updated",
            "order/paid",
            "order/packed",
            "order/fulfilled",
            "order/cancelled",
            "order/custom_fields/created",
            "order/custom_fields/updated",
            "order/custom_fields/deleted",
            "order/edited",
            "order/pending",
            "order/voided",
            "order/unpacked",
            "product/created",
            "product/updated",
            "product/deleted",
            "product_variant/custom_fields/created",
            "product_variant/custom_fields/updated",
            "product_variant/custom_fields/deleted",
            "domain/updated",
            "subscription/updated",
            "fulfillment/updated",
          ],
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
    name: "tiendanube_get_webhook",
    description:
      "🔍 GET SPECIFIC WEBHOOK - Retrieve complete details for a single webhook configuration by its unique ID. Use this when you need comprehensive webhook information including endpoint URL, event type, authentication settings, delivery status, and error logs. Essential for webhook troubleshooting, configuration verification, and integration maintenance.",
    inputSchema: {
      type: "object",
      properties: {
        webhook_id: {
          type: "number",
          description: "The unique ID of the webhook to retrieve",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["webhook_id"],
    },
  },
  {
    name: "tiendanube_create_webhook",
    description:
      "➕ CREATE NEW WEBHOOK - Set up real-time event notifications for external system integrations. Use this to establish automated workflows, sync data with external platforms, trigger business processes, and maintain real-time system connectivity. Supports all major store events including orders, customers, products, and categories. Requires HTTPS endpoints for security compliance.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description:
            "HTTPS URL that will receive webhook notifications (required)",
        },
        event: {
          type: "string",
          description: "Event type that triggers the webhook (required)",
          enum: [
            "app/uninstalled",
            "app/suspended",
            "app/resumed",
            "category/created",
            "category/updated",
            "category/deleted",
            "customer/created",
            "customer/updated",
            "customer/deleted",
            "order/created",
            "order/updated",
            "order/paid",
            "order/packed",
            "order/fulfilled",
            "order/cancelled",
            "order/custom_fields/created",
            "order/custom_fields/updated",
            "order/custom_fields/deleted",
            "order/edited",
            "order/pending",
            "order/voided",
            "order/unpacked",
            "product/created",
            "product/updated",
            "product/deleted",
            "product_variant/custom_fields/created",
            "product_variant/custom_fields/updated",
            "product_variant/custom_fields/deleted",
            "domain/updated",
            "subscription/updated",
            "fulfillment/updated",
          ],
        },
      },
      required: ["url", "event"],
    },
  },
  {
    name: "tiendanube_update_webhook",
    description:
      "✏️ UPDATE WEBHOOK - Modify existing webhook configuration including endpoint URL and event type. Use this for changing integration endpoints, updating event subscriptions, fixing broken webhook URLs, and adapting to system changes. Essential for maintaining active integrations and ensuring continuous data flow between systems.",
    inputSchema: {
      type: "object",
      properties: {
        webhook_id: {
          type: "number",
          description: "The unique ID of the webhook to update",
        },
        url: {
          type: "string",
          description: "HTTPS URL that will receive webhook notifications",
        },
        event: {
          type: "string",
          description: "Event type that triggers the webhook",
          enum: [
            "app/uninstalled",
            "app/suspended",
            "app/resumed",
            "category/created",
            "category/updated",
            "category/deleted",
            "customer/created",
            "customer/updated",
            "customer/deleted",
            "order/created",
            "order/updated",
            "order/paid",
            "order/packed",
            "order/fulfilled",
            "order/cancelled",
            "order/custom_fields/created",
            "order/custom_fields/updated",
            "order/custom_fields/deleted",
            "order/edited",
            "order/pending",
            "order/voided",
            "order/unpacked",
            "product/created",
            "product/updated",
            "product/deleted",
            "product_variant/custom_fields/created",
            "product_variant/custom_fields/updated",
            "product_variant/custom_fields/deleted",
            "domain/updated",
            "subscription/updated",
            "fulfillment/updated",
          ],
        },
      },
      required: ["webhook_id"],
    },
  },
  // Delete webhook tool disabled by policy
];

/**
 * Handle webhook tool calls
 */
export async function handleWebhookTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_webhooks": {
        const validatedArgs = ListWebhooksSchema.parse(args ?? {});
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
        const response = await client.get("/webhooks", params);
        return response.data;
      }

      case "tiendanube_get_webhook": {
        const validatedArgs = GetWebhookSchema.parse(args);
        const { webhook_id, ...params } = validatedArgs;
        const response = await client.get(`/webhooks/${webhook_id}`, params);
        return response.data;
      }

      case "tiendanube_create_webhook": {
        const validatedArgs = CreateWebhookSchema.parse(args);

        const webhookData = {
          url: validatedArgs.url,
          event: validatedArgs.event,
        };

        const response = await client.post("/webhooks", webhookData);
        return response.data;
      }

      case "tiendanube_update_webhook": {
        const validatedArgs = UpdateWebhookSchema.parse(args);
        const { webhook_id, ...updateData } = validatedArgs;

        const response = await client.put(
          `/webhooks/${webhook_id}`,
          updateData
        );
        return response.data;
      }

      case "tiendanube_delete_webhook": {
        return {
          success: false,
          error: "Delete operations are disabled by policy",
          type: "WebhookError",
        };
      }

      default:
        throw new Error(`Unknown webhook tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "WebhookError",
      };
    }
    throw error;
  }
}