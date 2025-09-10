import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListMetafieldsSchema,
  GetMetafieldSchema,
  CreateMetafieldSchema,
  UpdateMetafieldSchema,
  DeleteMetafieldSchema,
} from "../schemas/mcp-tools.js";

export const metafieldTools: Tool[] = [
  {
    name: "tiendanube_list_metafields",
    description: "LIST METAFIELDS - List metafields, optionally filtered by owner_resource and owner_id.",
    inputSchema: {
      type: "object",
      properties: {
        owner_resource: { type: "string" },
        owner_id: { type: "number" },
        key: { type: "string" },
        namespace: { type: "string" },
        page: { type: "number" },
        per_page: { type: "number" },
      },
    },
  },
  {
    name: "tiendanube_get_metafield",
    description: "GET METAFIELD - Retrieve a single metafield by ID.",
    inputSchema: {
      type: "object",
      properties: {
        metafield_id: { type: "number" },
      },
      required: ["metafield_id"],
    },
  },
  {
    name: "tiendanube_create_metafield",
    description: "CREATE METAFIELD - Create a metafield for a given owner resource/id.",
    inputSchema: {
      type: "object",
      properties: {
        owner_resource: { type: "string" },
        owner_id: { type: "number" },
        key: { type: "string" },
        value: { anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }, { type: "null" }] },
        namespace: { type: "string" },
        value_type: { type: "string" },
      },
      required: ["owner_resource", "owner_id", "key", "value"],
    },
  },
  {
    name: "tiendanube_update_metafield",
    description: "UPDATE METAFIELD - Update a metafield value by ID.",
    inputSchema: {
      type: "object",
      properties: {
        metafield_id: { type: "number" },
        value: { anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }, { type: "null" }] },
      },
      required: ["metafield_id", "value"],
    },
  },
  {
    name: "tiendanube_delete_metafield",
    description: "DELETE METAFIELD - Delete a metafield by ID.",
    inputSchema: {
      type: "object",
      properties: {
        metafield_id: { type: "number" },
      },
      required: ["metafield_id"],
    },
  },
];

export async function handleMetafieldTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_metafields": {
        const validatedArgs = ListMetafieldsSchema.parse(args ?? {});
        const response = await client.get("/metafields", validatedArgs);
        return response.data;
      }
      case "tiendanube_get_metafield": {
        const { metafield_id } = GetMetafieldSchema.parse(args);
        const response = await client.get(`/metafields/${metafield_id}`);
        return response.data;
      }
      case "tiendanube_create_metafield": {
        const validatedArgs = CreateMetafieldSchema.parse(args);
        const response = await client.post("/metafields", validatedArgs);
        return response.data;
      }
      case "tiendanube_update_metafield": {
        const { metafield_id, value } = UpdateMetafieldSchema.parse(args);
        const response = await client.put(`/metafields/${metafield_id}`, { value });
        return response.data;
      }
      case "tiendanube_delete_metafield": {
        const { metafield_id } = DeleteMetafieldSchema.parse(args);
        const response = await client.delete(`/metafields/${metafield_id}`);
        return response.data ?? { success: true };
      }
      default:
        throw new Error(`Unknown metafield tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message, type: "MetafieldError" };
    }
    throw error;
  }
}

