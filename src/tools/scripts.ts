import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  ListScriptTagsSchema,
  GetScriptTagSchema,
  CreateScriptTagSchema,
  UpdateScriptTagSchema,
  DeleteScriptTagSchema,
} from "../schemas/mcp-tools.js";

export const scriptTools: Tool[] = [
  {
    name: "tiendanube_list_script_tags",
    description:
      "LIST SCRIPT TAGS - Retrieve all script tags registered by the app.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number (starting from 1)" },
        per_page: {
          type: "number",
          description: "Items per page (max 200)",
          minimum: 1,
          maximum: 200,
        },
        fields: { type: "string", description: "Fields filter" },
        since_id: { type: "number", description: "Only IDs greater than this" },
        src: { type: "string", description: "Filter by script URL" },
        created_at_min: { type: "string", description: "Created after (ISO)" },
        created_at_max: { type: "string", description: "Created before (ISO)" },
        updated_at_min: { type: "string", description: "Updated after (ISO)" },
        updated_at_max: { type: "string", description: "Updated before (ISO)" },
      },
    },
  },
  {
    name: "tiendanube_get_script_tag",
    description: "GET SCRIPT TAG - Retrieve a single script tag by ID.",
    inputSchema: {
      type: "object",
      properties: {
        script_tag_id: { type: "number", description: "Script tag ID" },
        fields: { type: "string", description: "Fields filter" },
      },
      required: ["script_tag_id"],
    },
  },
  {
    name: "tiendanube_create_script_tag",
    description:
      "CREATE SCRIPT TAG - Register a new script tag (HTTPS URL only).",
    inputSchema: {
      type: "object",
      properties: {
        src: { type: "string", description: "HTTPS script URL" },
        event: { type: "string", description: "Load event", enum: ["onload", "onfocus"] },
      },
      required: ["src"],
    },
  },
  {
    name: "tiendanube_update_script_tag",
    description: "UPDATE SCRIPT TAG - Update the URL or event of a script tag.",
    inputSchema: {
      type: "object",
      properties: {
        script_tag_id: { type: "number", description: "Script tag ID" },
        src: { type: "string", description: "HTTPS script URL" },
        event: { type: "string", description: "Load event", enum: ["onload", "onfocus"] },
      },
      required: ["script_tag_id"],
    },
  },
  {
    name: "tiendanube_delete_script_tag",
    description: "DELETE SCRIPT TAG - Remove a script tag.",
    inputSchema: {
      type: "object",
      properties: {
        script_tag_id: { type: "number", description: "Script tag ID" },
      },
      required: ["script_tag_id"],
    },
  },
];

export async function handleScriptTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_script_tags": {
        const validatedArgs = ListScriptTagsSchema.parse(args ?? {});
        const normalize = (v: any) => {
          if (typeof v !== "string") return v;
          const d = new Date(v);
          return isNaN(d.getTime()) ? v : d.toISOString();
        };
        const params: any = { ...validatedArgs };
        [
          "created_at_min",
          "created_at_max",
          "updated_at_min",
          "updated_at_max",
        ].forEach((k) => {
          if (params[k]) params[k] = normalize(params[k]);
        });
        const response = await client.get("/scripts", params);
        return response.data;
      }

      case "tiendanube_get_script_tag": {
        const { script_tag_id, ...params } = GetScriptTagSchema.parse(args);
        const response = await client.get(`/scripts/${script_tag_id}`, params);
        return response.data;
      }

      case "tiendanube_create_script_tag": {
        const validatedArgs = CreateScriptTagSchema.parse(args);
        const response = await client.post("/scripts", validatedArgs);
        return response.data;
      }

      case "tiendanube_update_script_tag": {
        const { script_tag_id, ...update } = UpdateScriptTagSchema.parse(args);
        const response = await client.put(`/scripts/${script_tag_id}`, update);
        return response.data;
      }

      case "tiendanube_delete_script_tag": {
        const { script_tag_id } = DeleteScriptTagSchema.parse(args);
        const response = await client.delete(`/scripts/${script_tag_id}`);
        return response.data ?? { success: true };
      }

      default:
        throw new Error(`Unknown script tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "ScriptError",
      };
    }
    throw error;
  }
}

