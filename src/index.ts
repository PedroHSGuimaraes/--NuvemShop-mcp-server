#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { TiendaNubeClient } from "./utils/client.js";
import {
  authenticationTools,
  handleAuthenticationTool,
} from "./tools/authentication.js";
import { productTools, handleProductTool } from "./tools/products.js";
import { orderTools, handleOrderTool } from "./tools/orders.js";
import { customerTools, handleCustomerTool } from "./tools/customers.js";
import { webhookTools, handleWebhookTool } from "./tools/webhooks.js";
import { scriptTools, handleScriptTool } from "./tools/scripts.js";
import { locationTools, handleLocationTool } from "./tools/locations.js";
import { paymentTools, handlePaymentTool } from "./tools/payments.js";
import { metafieldTools, handleMetafieldTool } from "./tools/metafields.js";
import { shippingTools, handleShippingTool } from "./tools/shipping.js";
import { miscTools, handleMiscTool } from "./tools/discounts-disputes-rules.js";
import {
  abandonedCheckoutTools,
  handleAbandonedCheckoutTool,
} from "./tools/abandoned-checkouts.js";
import { cartTools, handleCartTool } from "./tools/cart.js";
import { checkoutTools, handleCheckoutTool } from "./tools/checkouts.js";
import { checkoutSdkTools, handleCheckoutSdkTool } from "./tools/checkout-sdk.js";
import {
  categoryTools,
  couponTools,
  handleCategoryTool,
  handleCouponTool,
} from "./tools/categories-coupons.js";
  import { 
    productCustomFieldsTools, 
    handleProductCustomFieldsTool 
  } from "./tools/product-custom-fields.js";
  import {
    productVariantCustomFieldsTools,
    handleProductVariantCustomFieldsTool,
  } from "./tools/product-variant-custom-fields.js";
import { 
  transactionTools, 
  handleTransactionTool 
} from "./tools/transactions.js";
import { 
  fulfillmentOrderTools, 
  handleFulfillmentOrderTool 
} from "./tools/fulfillment-orders.js";
import { 
  businessRulesTools, 
  handleBusinessRulesTool 
} from "./tools/business-rules.js";

/**
 * Tienda Nube MCP Server
 *
 * This server provides Model Context Protocol (MCP) tools for interacting with the Tienda Nube API.
 * It supports comprehensive e-commerce operations including:
 * - Store information retrieval
 * - Product management (create, read, update, delete, search)
 * - Order management (create, read, update, cancel, fulfillment)
 * - Customer management (create, read, update, delete, search)
 * - Category management (create, read, update, delete)
 * - Coupon management (create, read, update, delete)
 * - Webhook management (create, read, update, delete)
 *
 * Features:
 * - Full CRUD operations for all major entities
 * - Advanced filtering and pagination
 * - Multi-language support (Spanish, Portuguese, English)
 * - Comprehensive error handling and validation
 * - Rate limiting and retry logic
 * - Automatic authentication via environment variables
 *
 * Setup:
 * 1. Set TIENDANUBE_ACCESS_TOKEN and TIENDANUBE_STORE_ID environment variables
 * 2. Start using any of the 35+ available tools
 */

class TiendaNubeMCPServer {
  private server: Server;
  private client: TiendaNubeClient;

  constructor() {
    this.server = new Server({
      name: "tiendanube-mcp-server",
      version: "1.17.0",
    });

    // Read credentials from environment variables
    const accessToken = process.env["TIENDANUBE_ACCESS_TOKEN"] || "";
    const storeId = process.env["TIENDANUBE_STORE_ID"] || "";

    this.client = new TiendaNubeClient({
      accessToken,
      storeId,
    });

    // Log configuration status (without exposing sensitive data)
    if (accessToken && storeId) {
      console.log(
        "✅ TiendaNube credentials loaded from environment variables"
      );
    } else {
      console.log(
        "❌ TiendaNube credentials not found in environment. Please set TIENDANUBE_ACCESS_TOKEN and TIENDANUBE_STORE_ID environment variables."
      );
    }

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private sanitizeForJson(obj: any): any {
    try {
      // Use JSON.parse(JSON.stringify()) to remove circular references and non-serializable values
      return JSON.parse(
        JSON.stringify(obj, (key, value) => {
          // Handle special cases
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack,
            };
          }

          // Handle Date objects
          if (value instanceof Date) {
            return value.toISOString();
          }

          // Handle undefined values
          if (value === undefined) {
            return null;
          }

          return value;
        })
      );
    } catch (error) {
      // Fallback to a safe representation
      return {
        success: false,
        error: "Failed to serialize response",
        original_error:
          error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private setupToolHandlers(): void {
    // Combine all tools
    const allTools = [
      ...authenticationTools,
      ...productTools,
      ...orderTools,
      ...customerTools,
      ...categoryTools,
      ...couponTools,
      ...webhookTools,
      ...scriptTools,
      ...locationTools,
      ...paymentTools,
      ...metafieldTools,
      ...shippingTools,
      ...miscTools,
      ...cartTools,
      ...checkoutTools,
      ...checkoutSdkTools,
      ...abandonedCheckoutTools,
      ...productCustomFieldsTools,
      ...productVariantCustomFieldsTools,
      ...transactionTools,
      ...fulfillmentOrderTools,
      ...businessRulesTools,
    ];

    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools,
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        // Route to appropriate handler based on tool name prefix
        if (
          name === "tiendanube_get_store_info" ||
          name === "tiendanube_list_payment_providers" ||
          name === "tiendanube_list_shipping_providers" ||
          name === "tiendanube_get_store_settings"
        ) {
          result = await handleAuthenticationTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("product") &&
          !name.includes("custom_field")
        ) {
          result = await handleProductTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("order")) {
          result = await handleOrderTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("customer")
        ) {
          result = await handleCustomerTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("category")
        ) {
          result = await handleCategoryTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("coupon")) {
          result = await handleCouponTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("webhook")) {
          result = await handleWebhookTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("script_tag")) {
          result = await handleScriptTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("location")) {
          result = await handleLocationTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          (name.includes("payment_provider") || name.includes("payment_option"))
        ) {
          result = await handlePaymentTool(name, args, this.client);
        } else if (name.startsWith("tiendanube_") && name.includes("metafield")) {
          result = await handleMetafieldTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          (name.includes("shipping_carrier") || name.includes("shipping"))
        ) {
          result = await handleShippingTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("discount")
        ) {
          result = await handleMiscTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("checkout_sdk")
        ) {
          result = await handleCheckoutSdkTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("checkout") &&
          !name.includes("abandoned_checkout") &&
          !name.includes("checkout_sdk")
        ) {
          result = await handleCheckoutTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("cart")
        ) {
          result = await handleCartTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("abandoned_checkout")
        ) {
          result = await handleAbandonedCheckoutTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          (
            name.includes("variant_custom_field") ||
            name.includes("product_variant_custom_field") ||
            name.includes("variant") && name.includes("custom_field")
          )
        ) {
          // Route variant custom field tools first to avoid collision with generic custom_field rules
          result = await handleProductVariantCustomFieldsTool(
            name,
            args,
            this.client
          );
        } else if (
          name.startsWith("tiendanube_") &&
          (
            name.includes("product_custom_field") ||
            (name.includes("custom_field") && !name.includes("variant"))
          )
        ) {
          result = await handleProductCustomFieldsTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          (name.includes("transaction") && !name.includes("order_transaction"))
        ) {
          result = await handleTransactionTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          name.includes("fulfillment_order")
        ) {
          result = await handleFulfillmentOrderTool(name, args, this.client);
        } else if (
          name.startsWith("tiendanube_") &&
          (name.includes("business_rule") || (name.includes("dispute") && !name.includes("discounts")))
        ) {
          result = await handleBusinessRulesTool(name, args, this.client);
        } else {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        // Ensure result is properly serializable
        const safeResult = this.sanitizeForJson(result);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(safeResult, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`Error in tool ${name}:`, error);

        if (error instanceof McpError) {
          throw error;
        }

        // Create a safe error response
        const errorResponse = {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          tool: name,
          timestamp: new Date().toISOString(),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(errorResponse, null, 2),
            },
          ],
        };
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Keep server running
    console.error("Tienda Nube MCP Server running on stdio");
    console.error(
      "Available tools: Store Info, Products, Orders, Customers, Categories, Coupons, Webhooks"
    );
    console.error(
      "Ensure TIENDANUBE_ACCESS_TOKEN and TIENDANUBE_STORE_ID are set, then explore 35+ available tools"
    );
  }
}

// Run the server
const server = new TiendaNubeMCPServer();
server.run().catch((error) => {
  console.error("Failed to run server:", error);
  process.exit(1);
});

