import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { z } from "zod";

/**
 * Business Rules management tools for Tienda Nube API
 */

// Schemas
const ListBusinessRulesSchema = z.object({
  per_page: z.number().min(1).max(200).optional(),
  page: z.number().min(1).optional(),
  type: z.enum(["product_filter", "customer_filter", "order_filter"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

const GetBusinessRuleSchema = z.object({
  business_rule_id: z.number().describe("Business rule ID"),
});

const CreateBusinessRuleSchema = z.object({
  name: z.string().min(1).max(255).describe("Business rule name"),
  description: z.string().optional().describe("Business rule description"),
  type: z.enum(["product_filter", "customer_filter", "order_filter"]).describe("Type of business rule"),
  status: z.enum(["active", "inactive"]).default("active").describe("Rule status"),
  conditions: z.array(z.object({
    field: z.string().describe("Field to filter on"),
    operator: z.enum(["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "in", "not_in"]).describe("Comparison operator"),
    value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]).describe("Value to compare against"),
  })).describe("Filter conditions"),
  actions: z.array(z.object({
    type: z.enum(["hide", "show", "apply_discount", "set_price", "block_purchase"]).describe("Action type"),
    value: z.union([z.string(), z.number()]).optional().describe("Action value if applicable"),
  })).describe("Actions to take when conditions are met"),
});

const UpdateBusinessRuleSchema = z.object({
  business_rule_id: z.number().describe("Business rule ID"),
  name: z.string().min(1).max(255).optional().describe("Business rule name"),
  description: z.string().optional().describe("Business rule description"),
  status: z.enum(["active", "inactive"]).optional().describe("Rule status"),
  conditions: z.array(z.object({
    field: z.string().describe("Field to filter on"),
    operator: z.enum(["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "in", "not_in"]).describe("Comparison operator"),
    value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]).describe("Value to compare against"),
  })).optional().describe("Filter conditions"),
  actions: z.array(z.object({
    type: z.enum(["hide", "show", "apply_discount", "set_price", "block_purchase"]).describe("Action type"),
    value: z.union([z.string(), z.number()]).optional().describe("Action value if applicable"),
  })).optional().describe("Actions to take when conditions are met"),
});

const DeleteBusinessRuleSchema = z.object({
  business_rule_id: z.number().describe("Business rule ID"),
});

// Disputes Schemas
const ListDisputesSchema = z.object({
  per_page: z.number().min(1).max(200).optional(),
  page: z.number().min(1).optional(),
  status: z.enum(["open", "under_review", "accepted", "declined", "needs_response", "warning_closed"]).optional(),
  reason: z.enum(["chargeback", "inquiry", "refund_request", "quality_issue", "shipping_issue", "other"]).optional(),
  created_at_min: z.string().optional().describe("Filter by minimum creation date (ISO 8601)"),
  created_at_max: z.string().optional().describe("Filter by maximum creation date (ISO 8601)"),
});

const GetDisputeSchema = z.object({
  dispute_id: z.number().describe("Dispute ID"),
});

const UpdateDisputeSchema = z.object({
  dispute_id: z.number().describe("Dispute ID"),
  status: z.enum(["under_review", "accepted", "declined"]).describe("New dispute status"),
  response: z.string().optional().describe("Response to the dispute"),
  evidence: z.array(z.object({
    type: z.enum(["receipt", "communication", "shipping_documentation", "other"]).describe("Evidence type"),
    url: z.string().url().optional().describe("URL to evidence file"),
    description: z.string().optional().describe("Evidence description"),
  })).optional().describe("Supporting evidence"),
});

export const businessRulesTools: Tool[] = [
  {
    name: "tiendanube_list_business_rules",
    description: "List all business rules with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of items per page (1-200)",
          minimum: 1,
          maximum: 200,
        },
        page: {
          type: "number",
          description: "Page number (starting from 1)",
          minimum: 1,
        },
        type: {
          type: "string",
          enum: ["product_filter", "customer_filter", "order_filter"],
          description: "Filter by rule type",
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
          description: "Filter by rule status",
        },
      },
    },
  },
  {
    name: "tiendanube_get_business_rule",
    description: "Get details of a specific business rule",
    inputSchema: {
      type: "object",
      properties: {
        business_rule_id: {
          type: "number",
          description: "Business rule ID",
        },
      },
      required: ["business_rule_id"],
    },
  },
  {
    name: "tiendanube_create_business_rule",
    description: "Create a new business rule for filtering products, customers, or orders",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Business rule name",
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: "string",
          description: "Business rule description",
        },
        type: {
          type: "string",
          enum: ["product_filter", "customer_filter", "order_filter"],
          description: "Type of business rule",
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
          description: "Rule status",
        },
        conditions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                description: "Field to filter on",
              },
              operator: {
                type: "string",
                enum: ["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "in", "not_in"],
                description: "Comparison operator",
              },
              value: {
                description: "Value to compare against",
                oneOf: [
                  { type: "string" },
                  { type: "number" },
                  { type: "array", items: { oneOf: [{ type: "string" }, { type: "number" }] } }
                ],
              },
            },
            required: ["field", "operator", "value"],
          },
          description: "Filter conditions",
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["hide", "show", "apply_discount", "set_price", "block_purchase"],
                description: "Action type",
              },
              value: {
                description: "Action value if applicable",
                oneOf: [
                  { type: "string" },
                  { type: "number" }
                ],
              },
            },
            required: ["type"],
          },
          description: "Actions to take when conditions are met",
        },
      },
      required: ["name", "type", "conditions", "actions"],
    },
  },
  {
    name: "tiendanube_update_business_rule",
    description: "Update an existing business rule",
    inputSchema: {
      type: "object",
      properties: {
        business_rule_id: {
          type: "number",
          description: "Business rule ID",
        },
        name: {
          type: "string",
          description: "Business rule name",
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: "string",
          description: "Business rule description",
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
          description: "Rule status",
        },
        conditions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                description: "Field to filter on",
              },
              operator: {
                type: "string",
                enum: ["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "in", "not_in"],
                description: "Comparison operator",
              },
              value: {
                description: "Value to compare against",
                oneOf: [
                  { type: "string" },
                  { type: "number" },
                  { type: "array", items: { oneOf: [{ type: "string" }, { type: "number" }] } }
                ],
              },
            },
            required: ["field", "operator", "value"],
          },
          description: "Filter conditions",
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["hide", "show", "apply_discount", "set_price", "block_purchase"],
                description: "Action type",
              },
              value: {
                description: "Action value if applicable",
                oneOf: [
                  { type: "string" },
                  { type: "number" }
                ],
              },
            },
            required: ["type"],
          },
          description: "Actions to take when conditions are met",
        },
      },
      required: ["business_rule_id"],
    },
  },
  {
    name: "tiendanube_delete_business_rule",
    description: "Delete a business rule",
    inputSchema: {
      type: "object",
      properties: {
        business_rule_id: {
          type: "number",
          description: "Business rule ID",
        },
      },
      required: ["business_rule_id"],
    },
  },
  {
    name: "tiendanube_list_disputes",
    description: "List all disputes with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of items per page (1-200)",
          minimum: 1,
          maximum: 200,
        },
        page: {
          type: "number",
          description: "Page number (starting from 1)",
          minimum: 1,
        },
        status: {
          type: "string",
          enum: ["open", "under_review", "accepted", "declined", "needs_response", "warning_closed"],
          description: "Filter by dispute status",
        },
        reason: {
          type: "string",
          enum: ["chargeback", "inquiry", "refund_request", "quality_issue", "shipping_issue", "other"],
          description: "Filter by dispute reason",
        },
        created_at_min: {
          type: "string",
          description: "Filter by minimum creation date (ISO 8601)",
        },
        created_at_max: {
          type: "string",
          description: "Filter by maximum creation date (ISO 8601)",
        },
      },
    },
  },
  {
    name: "tiendanube_get_dispute",
    description: "Get details of a specific dispute",
    inputSchema: {
      type: "object",
      properties: {
        dispute_id: {
          type: "number",
          description: "Dispute ID",
        },
      },
      required: ["dispute_id"],
    },
  },
  {
    name: "tiendanube_update_dispute",
    description: "Update a dispute status and provide response with evidence",
    inputSchema: {
      type: "object",
      properties: {
        dispute_id: {
          type: "number",
          description: "Dispute ID",
        },
        status: {
          type: "string",
          enum: ["under_review", "accepted", "declined"],
          description: "New dispute status",
        },
        response: {
          type: "string",
          description: "Response to the dispute",
        },
        evidence: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["receipt", "communication", "shipping_documentation", "other"],
                description: "Evidence type",
              },
              url: {
                type: "string",
                description: "URL to evidence file",
              },
              description: {
                type: "string",
                description: "Evidence description",
              },
            },
            required: ["type"],
          },
          description: "Supporting evidence",
        },
      },
      required: ["dispute_id", "status"],
    },
  },
];

/**
 * Handle business rules tool calls
 */
export async function handleBusinessRulesTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_business_rules": {
        const validatedArgs = ListBusinessRulesSchema.parse(args ?? {});
        const response = await client.get("/business-rules", validatedArgs);
        return response.data;
      }

      case "tiendanube_get_business_rule": {
        const { business_rule_id } = GetBusinessRuleSchema.parse(args);
        const response = await client.get(`/business-rules/${business_rule_id}`);
        return response.data;
      }

      case "tiendanube_create_business_rule": {
        const validatedArgs = CreateBusinessRuleSchema.parse(args);
        const response = await client.post("/business-rules", validatedArgs);
        return response.data;
      }

      case "tiendanube_update_business_rule": {
        const { business_rule_id, ...updateData } = UpdateBusinessRuleSchema.parse(args);
        const response = await client.put(`/business-rules/${business_rule_id}`, updateData);
        return response.data;
      }

      case "tiendanube_delete_business_rule": {
        const { business_rule_id } = DeleteBusinessRuleSchema.parse(args);
        await client.delete(`/business-rules/${business_rule_id}`);
        return { 
          success: true,
          message: `Business rule ${business_rule_id} deleted successfully`
        };
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

      case "tiendanube_update_dispute": {
        const { dispute_id, ...updateData } = UpdateDisputeSchema.parse(args);
        const response = await client.put(`/disputes/${dispute_id}`, updateData);
        return response.data;
      }

      default:
        throw new Error(`Unknown business rules tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "BusinessRulesError",
      };
    }
    throw error;
  }
}