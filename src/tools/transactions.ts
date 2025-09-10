import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { z } from "zod";

/**
 * Transaction management tools for Tienda Nube API
 */

// Schemas
const CreateTransactionSchema = z.object({
  order_id: z.number().describe("Order ID"),
  payment_provider_id: z.string().describe("Payment provider ID"),
  payment_method: z.enum([
    "credit_card", "debit_card", "boleto", "pix", "wallet", 
    "bank_transfer", "cash", "check", "other"
  ]).describe("Payment method"),
  first_event: z.object({
    type: z.enum([
      "sale", "authorization", "capture", "refund", "void", 
      "expiration", "in_fraud_analysis"
    ]).describe("Transaction event type"),
    status: z.enum([
      "authorized", "paid", "pending", "failed", "refunded", "voided"
    ]).describe("Transaction status"),
    happened_at: z.string().describe("When the event happened (ISO 8601)"),
  }).describe("First transaction event"),
  info: z.object({
    installments: z.number().min(1).optional().describe("Number of installments"),
    card_last_four_digits: z.string().length(4).optional().describe("Last 4 digits of card"),
    card_brand: z.string().optional().describe("Card brand (visa, mastercard, etc.)"),
    gateway_reference: z.string().optional().describe("Payment gateway reference"),
    external_reference: z.string().optional().describe("External reference ID"),
    amount: z.number().positive().optional().describe("Transaction amount"),
    currency: z.string().length(3).optional().describe("Currency code (BRL, USD, etc.)"),
  }).optional().describe("Additional transaction information"),
});

const CreateTransactionEventSchema = z.object({
  order_id: z.number().describe("Order ID"),
  transaction_id: z.string().describe("Transaction ID"),
  type: z.enum([
    "sale", "authorization", "capture", "refund", "void", 
    "expiration", "in_fraud_analysis"
  ]).describe("Transaction event type"),
  status: z.enum([
    "authorized", "paid", "pending", "failed", "refunded", "voided"
  ]).describe("Transaction status"),
  happened_at: z.string().describe("When the event happened (ISO 8601)"),
  amount: z.number().positive().optional().describe("Event amount"),
  info: z.record(z.any()).optional().describe("Additional event information"),
});

export const transactionTools: Tool[] = [
  {
    name: "tiendanube_create_transaction",
    description: "Create a new transaction for an order. Used by payment providers to register payment attempts.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        payment_provider_id: {
          type: "string",
          description: "Payment provider ID",
        },
        payment_method: {
          type: "string",
          enum: ["credit_card", "debit_card", "boleto", "pix", "wallet", "bank_transfer", "cash", "check", "other"],
          description: "Payment method used",
        },
        first_event: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["sale", "authorization", "capture", "refund", "void", "expiration", "in_fraud_analysis"],
              description: "Transaction event type",
            },
            status: {
              type: "string", 
              enum: ["authorized", "paid", "pending", "failed", "refunded", "voided"],
              description: "Transaction status",
            },
            happened_at: {
              type: "string",
              description: "When the event happened (ISO 8601 format)",
            },
          },
          required: ["type", "status", "happened_at"],
          description: "First transaction event",
        },
        info: {
          type: "object",
          properties: {
            installments: {
              type: "number",
              minimum: 1,
              description: "Number of installments",
            },
            card_last_four_digits: {
              type: "string",
              minLength: 4,
              maxLength: 4,
              description: "Last 4 digits of card",
            },
            card_brand: {
              type: "string",
              description: "Card brand (visa, mastercard, etc.)",
            },
            gateway_reference: {
              type: "string",
              description: "Payment gateway reference",
            },
            external_reference: {
              type: "string",
              description: "External reference ID",
            },
            amount: {
              type: "number",
              minimum: 0,
              description: "Transaction amount",
            },
            currency: {
              type: "string",
              minLength: 3,
              maxLength: 3,
              description: "Currency code (BRL, USD, etc.)",
            },
          },
          description: "Additional transaction information",
        },
      },
      required: ["order_id", "payment_provider_id", "payment_method", "first_event"],
    },
  },
  {
    name: "tiendanube_create_transaction_event",
    description: "Create a new event for an existing transaction (capture, refund, void, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "number",
          description: "Order ID",
        },
        transaction_id: {
          type: "string", 
          description: "Transaction ID",
        },
        type: {
          type: "string",
          enum: ["sale", "authorization", "capture", "refund", "void", "expiration", "in_fraud_analysis"],
          description: "Transaction event type",
        },
        status: {
          type: "string",
          enum: ["authorized", "paid", "pending", "failed", "refunded", "voided"],
          description: "Transaction status",
        },
        happened_at: {
          type: "string",
          description: "When the event happened (ISO 8601 format)",
        },
        amount: {
          type: "number",
          minimum: 0,
          description: "Event amount (for partial refunds/captures)",
        },
        info: {
          type: "object",
          description: "Additional event information",
        },
      },
      required: ["order_id", "transaction_id", "type", "status", "happened_at"],
    },
  },
];

/**
 * Handle transaction tool calls
 */
export async function handleTransactionTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_create_transaction": {
        const { order_id, ...transactionData } = CreateTransactionSchema.parse(args);
        const response = await client.post(`/orders/${order_id}/transactions`, transactionData);
        return response.data;
      }

      case "tiendanube_create_transaction_event": {
        const { order_id, transaction_id, ...eventData } = CreateTransactionEventSchema.parse(args);
        const response = await client.post(
          `/orders/${order_id}/transactions/${transaction_id}/events`,
          eventData
        );
        return response.data;
      }

      default:
        throw new Error(`Unknown transaction tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "TransactionError",
      };
    }
    throw error;
  }
}