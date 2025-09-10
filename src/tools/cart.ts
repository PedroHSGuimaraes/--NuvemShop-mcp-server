import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import {
  GetCartSchema,
  AddCartItemSchema,
  RemoveCartItemSchema,
  ApplyCartCouponSchema,
  UpdateCartItemQuantitySchema,
  ClearCartSchema,
} from "../schemas/mcp-tools.js";

/**
 * Cart tools for Tienda Nube API
 */

export const cartTools: Tool[] = [
  {
    name: "tiendanube_get_cart",
    description:
      "GET CART - Retrieve a shopping cart by numeric id or token. Returns items, totals and metadata.",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
        fields: { type: "string", description: "Optional fields filter" },
      },
    },
  },
  {
    name: "tiendanube_add_cart_item",
    description:
      "ADD CART ITEM - Add a variant to the cart (by id or token) with the desired quantity.",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
        variant_id: { type: "number", description: "Variant ID" },
        quantity: { type: "number", description: "Quantity to add" },
      },
      required: ["variant_id", "quantity"],
    },
  },
  {
    name: "tiendanube_remove_cart_item",
    description:
      "REMOVE CART ITEM - Remove an item from the cart by item_id or variant_id (we'll resolve the item id when needed).",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
        item_id: { type: "number", description: "Cart line item ID" },
        variant_id: { type: "number", description: "Variant ID (if no item_id)" },
      },
    },
  },
  {
    name: "tiendanube_update_cart_item_quantity",
    description:
      "UPDATE CART ITEM QTY - Update line item quantity by item_id or variant_id (fallback removes+adds).",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
        item_id: { type: "number", description: "Cart line item ID" },
        variant_id: { type: "number", description: "Variant ID (if no item_id)" },
        quantity: { type: "number", description: "New quantity (>=1)" },
      },
      required: ["quantity"],
    },
  },
  {
    name: "tiendanube_clear_cart",
    description: "CLEAR CART - Remove all items from the cart.",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
      },
    },
  },
  {
    name: "tiendanube_apply_cart_coupon",
    description:
      "APPLY CART COUPON - Apply a discount coupon code to the cart.",
    inputSchema: {
      type: "object",
      properties: {
        cart_id: { type: "number", description: "Cart numeric ID" },
        cart_token: { type: "string", description: "Cart token string" },
        code: { type: "string", description: "Coupon code" },
      },
      required: ["code"],
    },
  },
];

/**
 * Handle cart tool calls
 */
export async function handleCartTool(
  name: string,
  args: any,
  client: TiendaNubeClient
): Promise<any> {
  try {
    switch (name) {
      case "tiendanube_get_cart": {
        const { cart_id, cart_token, ...params } = GetCartSchema.parse(args ?? {});

        const tryPaths = cart_id
          ? [`/carts/${cart_id}`, `/cart/${cart_id}`]
          : cart_token
          ? [`/cart/${cart_token}`, `/carts/${cart_token}`]
          : [];

        for (const p of tryPaths) {
          try {
            const res = await client.get(p, params);
            return res.data;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) {
              throw e;
            }
          }
        }
        throw new Error("Cart not found using provided identifier");
      }

      case "tiendanube_add_cart_item": {
        const { cart_id, cart_token, variant_id, quantity } =
          AddCartItemSchema.parse(args);

        const body = { variant_id, quantity } as any;
        const tryPaths = cart_id
          ? [`/carts/${cart_id}/items`, `/cart/${cart_id}/items`]
          : cart_token
          ? [`/cart/${cart_token}/items`, `/carts/${cart_token}/items`]
          : [];

        for (const p of tryPaths) {
          try {
            const res = await client.post(p, body);
            return res.data;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) {
              throw e;
            }
          }
        }
        throw new Error("Failed to add item: cart not found");
      }

      case "tiendanube_remove_cart_item": {
        const { cart_id, cart_token, item_id, variant_id } =
          RemoveCartItemSchema.parse(args);

        const resolveItemId = async (): Promise<number> => {
          if (item_id) return item_id;
          // Need to fetch cart and find item by variant_id
          const cart = await (async () => {
            const params = {} as any;
            const tryPaths = cart_id
              ? [`/carts/${cart_id}`, `/cart/${cart_id}`]
              : cart_token
              ? [`/cart/${cart_token}`, `/carts/${cart_token}`]
              : [];
            for (const p of tryPaths) {
              try {
                const res = await client.get(p, params);
                return res.data as any;
              } catch (e: any) {
                if (!(e && (e.status === 404 || e.message?.includes("404")))) {
                  throw e;
                }
              }
            }
            throw new Error("Cart not found when resolving item");
          })();

          const items = (cart?.items || cart?.products || []) as any[];
          const line = items.find((x) => x?.variant_id === variant_id || x?.variant?.id === variant_id);
          if (!line || !line.id) {
            throw new Error("Could not resolve item_id from variant_id; provide item_id explicitly");
          }
          return line.id as number;
        };

        const lineId = await resolveItemId();

        const tryPaths = cart_id
          ? [`/carts/${cart_id}/items/${lineId}`, `/cart/${cart_id}/items/${lineId}`]
          : cart_token
          ? [`/cart/${cart_token}/items/${lineId}`, `/carts/${cart_token}/items/${lineId}`]
          : [];

        for (const p of tryPaths) {
          try {
            const res = await client.delete(p);
            return res.data ?? { success: true };
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) {
              throw e;
            }
          }
        }
        throw new Error("Failed to remove item: cart not found");
      }

      case "tiendanube_apply_cart_coupon": {
        const { cart_id, cart_token, code } = ApplyCartCouponSchema.parse(args);
        const body = { code } as any;
        const tryPaths = cart_id
          ? [`/carts/${cart_id}/coupon`, `/cart/${cart_id}/coupon`]
          : cart_token
          ? [`/cart/${cart_token}/coupon`, `/carts/${cart_token}/coupon`]
          : [];

        for (const p of tryPaths) {
          try {
            const res = await client.post(p, body);
            return res.data;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) {
              throw e;
            }
          }
        }
        throw new Error("Failed to apply coupon: cart not found");
      }

      case "tiendanube_update_cart_item_quantity": {
        const { cart_id, cart_token, item_id, variant_id, quantity } =
          UpdateCartItemQuantitySchema.parse(args);

        // Resolve item id if not provided
        const ensureItemId = async (): Promise<number> => {
          if (item_id) return item_id;
          // Fetch cart and find by variant
          const params = {} as any;
          const tryPaths = cart_id
            ? [`/carts/${cart_id}`, `/cart/${cart_id}`]
            : cart_token
            ? [`/cart/${cart_token}`, `/carts/${cart_token}`]
            : [];
          for (const p of tryPaths) {
            try {
              const res = await client.get(p, params);
              const cart = res.data as any;
              const items = (cart?.items || cart?.products || []) as any[];
              const line = items.find(
                (x) => x?.variant_id === variant_id || x?.variant?.id === variant_id
              );
              if (line?.id) return line.id as number;
            } catch (e: any) {
              if (!(e && (e.status === 404 || e.message?.includes("404")))) {
                throw e;
              }
            }
          }
          throw new Error("Could not resolve item_id from variant_id");
        };

        const lineId = await ensureItemId();

        // Try PUT update first
        const tryUpdatePaths = cart_id
          ? [`/carts/${cart_id}/items/${lineId}`, `/cart/${cart_id}/items/${lineId}`]
          : cart_token
          ? [`/cart/${cart_token}/items/${lineId}`, `/carts/${cart_token}/items/${lineId}`]
          : [];
        for (const p of tryUpdatePaths) {
          try {
            const res = await client.put(p, { quantity });
            return res.data;
          } catch (e: any) {
            if (e && (e.status === 404 || e.status === 405 || e.message?.includes("404"))) {
              // fallback later
            } else {
              throw e;
            }
          }
        }

        // Fallback: remove then add with new quantity
        const removeArgs = { cart_id, cart_token, item_id: lineId } as any;
        const removeSchemaOk = RemoveCartItemSchema.parse(removeArgs);
        const removePaths = cart_id
          ? [`/carts/${cart_id}/items/${lineId}`, `/cart/${cart_id}/items/${lineId}`]
          : cart_token
          ? [`/cart/${cart_token}/items/${lineId}`, `/carts/${cart_token}/items/${lineId}`]
          : [];
        for (const p of removePaths) {
          try {
            await client.delete(p);
            break;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
          }
        }

        const addArgs = { cart_id, cart_token, variant_id, quantity } as any;
        AddCartItemSchema.parse(addArgs);
        const addPaths = cart_id
          ? [`/carts/${cart_id}/items`, `/cart/${cart_id}/items`]
          : cart_token
          ? [`/cart/${cart_token}/items`, `/carts/${cart_token}/items`]
          : [];
        for (const p of addPaths) {
          try {
            const res = await client.post(p, { variant_id, quantity });
            return res.data;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
          }
        }

        throw new Error("Failed to update item quantity: cart not found");
      }

      case "tiendanube_clear_cart": {
        const { cart_id, cart_token } = ClearCartSchema.parse(args);
        // Fetch cart items
        const tryGetPaths = cart_id
          ? [`/carts/${cart_id}`, `/cart/${cart_id}`]
          : cart_token
          ? [`/cart/${cart_token}`, `/carts/${cart_token}`]
          : [];
        let cart: any | null = null;
        for (const p of tryGetPaths) {
          try {
            const res = await client.get(p);
            cart = res.data;
            break;
          } catch (e: any) {
            if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
          }
        }
        if (!cart) throw new Error("Cart not found");

        const items = (cart?.items || cart?.products || []) as any[];
        for (const it of items) {
          const lineId = it?.id;
          if (!lineId) continue;
          const tryDeletePaths = cart_id
            ? [`/carts/${cart_id}/items/${lineId}`, `/cart/${cart_id}/items/${lineId}`]
            : cart_token
            ? [`/cart/${cart_token}/items/${lineId}`, `/carts/${cart_token}/items/${lineId}`]
            : [];
          for (const p of tryDeletePaths) {
            try {
              await client.delete(p);
              break;
            } catch (e: any) {
              if (!(e && (e.status === 404 || e.message?.includes("404")))) throw e;
            }
          }
        }
        return { success: true };
      }

      default:
        throw new Error(`Unknown cart tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        type: "CartError",
      };
    }
    throw error;
  }
}
