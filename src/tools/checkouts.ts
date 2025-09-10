import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { GetCheckoutSchema } from "../schemas/mcp-tools.js";

/**
 * Checkout tools for Tienda Nube API
 */

export const checkoutTools: Tool[] = [
  {
    name: "tiendanube_get_checkout",
    description:
      "GET CHECKOUT - Retrieve checkout by ID, including items, customer, totals and status.",
    inputSchema: {
      type: "object",
      properties: {
        checkout_id: { type: "number", description: "Checkout ID" },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include in response",
        },
      },
      required: ["checkout_id"],
    },
  },
];

/**
 * Handle checkout tool calls
 */
export async function handleCheckoutTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_get_checkout": {
        const { checkout_id, ...params } = GetCheckoutSchema.parse(args);
        const response = await client.get(`/checkouts/${checkout_id}`, params);
        return response.data;
      }

      default:
        throw new Error(`Unknown checkout tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "CheckoutError",
      };
    }
    throw error;
  }
}

