import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  AuthenticateSchema,
  GetStoreInfoSchema,
} from "../schemas/mcp-tools.js";

/**
 * Authentication tools for Tienda Nube API
 */

export const authenticationTools: Tool[] = [
  {
    name: "tiendanube_authenticate",
    description:
      "Authenticate with Tienda Nube API using access token and store ID. This sets up the connection for all subsequent API calls.",
    inputSchema: {
      type: "object",
      properties: {
        access_token: {
          type: "string",
          description: "OAuth 2.0 access token for the Tienda Nube API",
        },
        store_id: {
          type: "string",
          description: "Store ID for the Tienda Nube store",
        },
      },
      required: ["access_token", "store_id"],
    },
  },
  {
    name: "tiendanube_get_store_info",
    description:
      "Get basic information about the authenticated store including name, plan, configuration, and available features.",
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
      case "tiendanube_authenticate": {
        const validatedArgs = AuthenticateSchema.parse(args);

        // Update client configuration
        client.updateConfig({
          accessToken: validatedArgs.access_token,
          storeId: validatedArgs.store_id,
        });

        // Test the connection by getting store info
        const response = await client.get("/store");
        const store = response.data as any;

        return {
          success: true,
          message: "Successfully authenticated with Tienda Nube API",
          store: {
            id: store.id,
            name:
              store.name?.es || store.name?.pt || store.name?.en || "Unknown",
            domain: store.main_domain,
            plan: store.plan_name,
            currency: store.currency,
            country: store.country,
            language: store.language,
          },
        };
      }

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
