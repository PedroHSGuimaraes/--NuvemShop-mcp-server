import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  GetStoreInfoSchema,
  EmptyArgsSchema,
} from "../schemas/mcp-tools.js";

/**
 * Authentication tools for Tienda Nube API
 */

export const authenticationTools: Tool[] = [
  {
    name: "tiendanube_get_store_info",
    description:
      "Get basic information about the authenticated store including name, plan, configuration, and available features.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "tiendanube_list_payment_providers",
    description:
      "List available payment providers configured in the store (extracted from /store).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "tiendanube_list_shipping_providers",
    description:
      "List available shipping providers configured in the store (extracted from /store).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "tiendanube_get_store_settings",
    description:
      "Get extended store settings including languages, design, features and domains (from /store).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

/**
 * Handle authentication tool calls
 */
export async function handleAuthenticationTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_get_store_info": {
        GetStoreInfoSchema.parse(args);

        const response = await client.get("/store");
        const store = response.data as any;

        return {
          id: store.id,
          name: store.name,
          description: store.description,
          logo: store.logo,
          main_domain: store.main_domain,
          original_domain: store.original_domain,
          plan_name: store.plan_name,
          currency: store.currency,
          country: store.country,
          language: store.language,
          languages: store.languages,
          business_id: store.business_id,
          business_name: store.business_name,
          business_address: store.business_address,
          contact_email: store.contact_email,
          customer_accounts: store.customer_accounts,
          created_at: store.created_at,
          updated_at: store.updated_at,
          design: store.design,
          features: store.features,
          payment_providers: store.payment_providers,
          shipping_providers: store.shipping_providers,
        };
      }

      case "tiendanube_list_payment_providers": {
        EmptyArgsSchema.parse(args);
        const response = await client.get("/store");
        const store = response.data as any;
        return store.payment_providers || [];
      }

      case "tiendanube_list_shipping_providers": {
        EmptyArgsSchema.parse(args);
        const response = await client.get("/store");
        const store = response.data as any;
        return store.shipping_providers || [];
      }

      case "tiendanube_get_store_settings": {
        EmptyArgsSchema.parse(args);
        const response = await client.get("/store");
        const store = response.data as any;
        return {
          languages: store.languages,
          language: store.language,
          currency: store.currency,
          country: store.country,
          design: store.design,
          features: store.features,
          main_domain: store.main_domain,
          original_domain: store.original_domain,
        };
      }

      default:
        throw new Error(`Unknown authentication tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "AuthenticationError",
      };
    }
    throw error;
  }
}
