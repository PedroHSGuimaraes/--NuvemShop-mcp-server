import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListPaymentProvidersSchema,
  GetPaymentProviderSchema,
  ListPaymentOptionsSchema,
  GetPaymentOptionSchema,
} from "../schemas/mcp-tools.js";

export const paymentTools: Tool[] = [
  {
    name: "tiendanube_list_payment_providers_dedicated",
    description: "LIST PAYMENT PROVIDERS - Dedicated endpoint for payment providers.",
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
    name: "tiendanube_get_payment_provider",
    description: "GET PAYMENT PROVIDER - Retrieve a provider by ID.",
    inputSchema: {
      type: "object",
      properties: {
        provider_id: { type: "number" },
        fields: { type: "string" },
      },
      required: ["provider_id"],
    },
  },
  {
    name: "tiendanube_list_payment_options",
    description: "LIST PAYMENT OPTIONS - Dedicated endpoint for payment options.",
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
    name: "tiendanube_get_payment_option",
    description: "GET PAYMENT OPTION - Retrieve a payment option by ID.",
    inputSchema: {
      type: "object",
      properties: {
        option_id: { type: "number" },
        fields: { type: "string" },
      },
      required: ["option_id"],
    },
  },
];

export async function handlePaymentTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_payment_providers_dedicated": {
        const validatedArgs = ListPaymentProvidersSchema.parse(args ?? {});
        const response = await client.get("/payment_providers", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_payment_provider": {
        const { provider_id, ...params } = GetPaymentProviderSchema.parse(args);
        const response = await client.get(`/payment_providers/${provider_id}`, params);
        return response.data;
      }
      case "tiendanube_list_payment_options": {
        const validatedArgs = ListPaymentOptionsSchema.parse(args ?? {});
        const response = await client.get("/payment_options", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_payment_option": {
        const { option_id, ...params } = GetPaymentOptionSchema.parse(args);
        const response = await client.get(`/payment_options/${option_id}`, params);
        return response.data;
      }
      default:
        throw new Error(`Unknown payment tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message, type: "PaymentError" };
    }
    throw error;
  }
}

