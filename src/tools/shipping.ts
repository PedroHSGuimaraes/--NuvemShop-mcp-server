import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { ListShippingCarriersSchema, GetShippingCarrierSchema } from "../schemas/mcp-tools.js";

export const shippingTools: Tool[] = [
  {
    name: "tiendanube_list_shipping_carriers",
    description: "LIST SHIPPING CARRIERS - Retrieve shipping carriers configured for the store.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        per_page: { type: "number" },
        fields: { type: "string" },
      },
    },
  },
  {
    name: "tiendanube_get_shipping_carrier",
    description: "GET SHIPPING CARRIER - Retrieve a single carrier by ID.",
    inputSchema: {
      type: "object",
      properties: {
        carrier_id: { type: "number" },
      },
      required: ["carrier_id"],
    },
  },
];

export async function handleShippingTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_shipping_carriers": {
        const validatedArgs = ListShippingCarriersSchema.parse(args ?? {});
        const response = await client.get("/shipping_carriers", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_shipping_carrier": {
        const { carrier_id } = GetShippingCarrierSchema.parse(args);
        const response = await client.get(`/shipping_carriers/${carrier_id}`);
        return response.data;
      }
      default:
        throw new Error(`Unknown shipping tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message, type: "ShippingError" };
    }
    throw error;
  }
}

