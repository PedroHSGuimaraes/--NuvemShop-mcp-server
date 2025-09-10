import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { ListDiscountsSchema, GetDiscountSchema } from "../schemas/mcp-tools.js";

export const miscTools: Tool[] = [
  {
    name: "tiendanube_list_discounts",
    description: "LIST DISCOUNTS - Retrieve store discounts (read-only).",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        per_page: { type: "number" },
        fields: { type: "string" },
        since_id: { type: "number" },
      },
    },
  },
  {
    name: "tiendanube_get_discount",
    description: "GET DISCOUNT - Retrieve a discount by ID.",
    inputSchema: {
      type: "object",
      properties: {
        discount_id: { type: "number" },
      },
      required: ["discount_id"],
    },
  },
];

export async function handleMiscTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_discounts": {
        const validatedArgs = ListDiscountsSchema.parse(args ?? {});
        const response = await client.get("/discounts", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_discount": {
        const { discount_id } = GetDiscountSchema.parse(args);
        const response = await client.get(`/discounts/${discount_id}`);
        return response.data;
      }
      default:
        throw new Error(`Unknown misc tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message, type: "MiscError" };
    }
    throw error;
  }
}
