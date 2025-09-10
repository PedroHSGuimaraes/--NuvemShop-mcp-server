import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListDiscountsSchema,
  GetDiscountSchema,
  ListDisputesSchema,
  GetDisputeSchema,
  GetBusinessRulesSchema,
} from "../schemas/mcp-tools.js";

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
  {
    name: "tiendanube_list_disputes",
    description: "LIST DISPUTES - Retrieve disputes (read-only).",
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
    name: "tiendanube_get_dispute",
    description: "GET DISPUTE - Retrieve a dispute by ID.",
    inputSchema: {
      type: "object",
      properties: {
        dispute_id: { type: "number" },
      },
      required: ["dispute_id"],
    },
  },
  {
    name: "tiendanube_get_business_rules",
    description: "GET BUSINESS RULES - Retrieve store business rules.",
    inputSchema: {
      type: "object",
      properties: {},
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
      case "tiendanube_list_disputes": {
        const validatedArgs = ListDisputesSchema.parse(args ?? {});
        const response = await client.get("/disputes", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_dispute": {
        const { dispute_id } = GetDisputeSchema.parse(args);
        const response = await client.get(`/disputes/${dispute_id}`);
        return response.data;
      }
      case "tiendanube_get_business_rules": {
        GetBusinessRulesSchema.parse(args ?? {});
        const response = await client.get("/business_rules");
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

