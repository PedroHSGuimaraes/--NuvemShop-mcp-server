import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListAbandonedCheckoutsSchema,
  GetAbandonedCheckoutSchema,
  SendAbandonedCheckoutRecoveryEmailSchema,
  AddCouponToAbandonedCheckoutSchema,
} from "../schemas/mcp-tools.js";

/**
 * Abandoned checkout tools for Tienda Nube API
 */

export const abandonedCheckoutTools: Tool[] = [
  {
    name: "tiendanube_list_abandoned_checkouts",
    description:
      "🧾 LIST ABANDONED CHECKOUTS - Retrieve paginated abandoned checkouts with filters. Use to analyze recovery opportunities, filter by dates or email, and export leads.",
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
          description: "Only return items with ID greater than this value",
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
        email: {
          type: "string",
          description: "Filter by customer email",
        },
        q: {
          type: "string",
          description: "Search query across relevant fields",
        },
      },
    },
  },
  {
    name: "tiendanube_get_abandoned_checkout",
    description:
      "🔎 GET ABANDONED CHECKOUT - Retrieve a single abandoned checkout by ID, including customer, items and totals. Omit `fields` (or set to `all`/`*`) to return everything.",
    inputSchema: {
      type: "object",
      properties: {
        checkout_id: {
          type: "number",
          description: "The unique ID of the abandoned checkout",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["checkout_id"],
    },
  },
  {
    name: "tiendanube_send_abandoned_checkout_recovery_email",
    description:
      "📧 SEND RECOVERY EMAIL - Trigger the recovery email for an abandoned checkout (if supported by API/version). Falls back gracefully if unsupported.",
    inputSchema: {
      type: "object",
      properties: {
        checkout_id: {
          type: "number",
          description: "The unique ID of the abandoned checkout",
        },
        language: {
          type: "string",
          description: "Optional 2-letter language code (e.g., 'es', 'pt', 'en')",
        },
      },
      required: ["checkout_id"],
    },
  },
  {
    name: "tiendanube_add_coupon_to_abandoned_checkout",
    description: "➕ ADD COUPON TO ABANDONED CHECKOUT - Add a discount coupon to an abandoned checkout.",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: {
          type: "number",
          description: "The unique ID of the abandoned checkout (cart).",
        },
        coupon_id: {
          type: "number",
          description: "The unique ID of the coupon to add.",
        },
      },
      required: ["cart_id", "coupon_id"],
    },
  },
];

/**
 * Handle abandoned checkout tool calls
 */
export async function handleAbandonedCheckoutTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_abandoned_checkouts": {
        const validatedArgs = ListAbandonedCheckoutsSchema.parse(args ?? {});
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
        // Try new checkouts endpoint first, fallback to abandoned_checkouts
        try {
          const response = await client.get("/checkouts", params);
          return response.data;
        } catch (e: any) {
          if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
          const res2 = await client.get("/abandoned_checkouts", params);
          return res2.data;
        }
      }

      case "tiendanube_get_abandoned_checkout": {
        const validatedArgs = GetAbandonedCheckoutSchema.parse(args);
        const { checkout_id, fields, ...rest } = validatedArgs as any;

        // If fields is omitted or explicitly 'all'/'*', request with no fields filter
        const params =
          !fields || fields === "all" || fields === "*"
            ? { ...rest }
            : { fields, ...rest };

        try {
          const response = await client.get(`/checkouts/${checkout_id}`, params);
          return response.data;
        } catch (e: any) {
          if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
          const res2 = await client.get(`/abandoned_checkouts/${checkout_id}`, params);
          return res2.data;
        }
      }

      case "tiendanube_send_abandoned_checkout_recovery_email": {
        const validatedArgs = SendAbandonedCheckoutRecoveryEmailSchema.parse(
          args
        );
        const { checkout_id, language } = validatedArgs as any;

        // Try v1-style endpoint first
        try {
          const res1 = await client.post(
            `/abandoned_checkouts/${checkout_id}/recovery_email`,
            language ? { language } : undefined
          );
          return res1.data ?? { success: true };
        } catch (e: any) {
          // If Not Found, try the newer checkouts path
          if (e && (e.status === 404 || e.message?.includes("404"))) {
            try {
              const res2 = await client.post(
                `/checkouts/${checkout_id}/recovery_email`,
                language ? { language } : undefined
              );
              return res2.data ?? { success: true };
            } catch (e2: any) {
              return {
                success: false,
                error:
                  e2?.message ||
                  "Recovery email endpoint is not available for this store/API version.",
                type: "AbandonedCheckoutError",
              };
            }
          }
          return {
            success: false,
            error:
              e?.message ||
              "Failed to send recovery email for the abandoned checkout.",
            type: "AbandonedCheckoutError",
          };
        }
      }

      case "tiendanube_add_coupon_to_abandoned_checkout": {
        const validatedArgs = AddCouponToAbandonedCheckoutSchema.parse(args);
        const { cart_id, coupon_id } = validatedArgs as any;
        const response = await client.post(`/checkouts/${cart_id}/coupon`, {
          coupon_id,
        });
        return response.data;
      }

      default:
        throw new Error(`Unknown abandoned checkout tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "AbandonedCheckoutError",
      };
    }
    throw error;
  }
}
