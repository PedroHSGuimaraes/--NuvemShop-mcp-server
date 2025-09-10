import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { ListLocationsSchema, GetLocationSchema } from "../schemas/mcp-tools.js";

export const locationTools: Tool[] = [
  {
    name: "tiendanube_list_locations",
    description: "LIST LOCATIONS - Retrieve store locations with pagination and date filters.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        per_page: { type: "number" },
        fields: { type: "string" },
        since_id: { type: "number" },
        created_at_min: { type: "string" },
        created_at_max: { type: "string" },
        updated_at_min: { type: "string" },
        updated_at_max: { type: "string" },
      },
    },
  },
  {
    name: "tiendanube_get_location",
    description: "GET LOCATION - Retrieve a single location by ID.",
    inputSchema: {
      type: "object",
      properties: {
        location_id: { type: "number" },
        fields: { type: "string" },
      },
      required: ["location_id"],
    },
  },
];

export async function handleLocationTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_list_locations": {
        const validatedArgs = ListLocationsSchema.parse(args ?? {});
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
        const response = await client.get("/locations", params);
        return response.data;
      }

      case "tiendanube_get_location": {
        const { location_id, ...params } = GetLocationSchema.parse(args);
        const response = await client.get(`/locations/${location_id}`, params);
        return response.data;
      }

      default:
        throw new Error(`Unknown location tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message, type: "LocationError" };
    }
    throw error;
  }
}

