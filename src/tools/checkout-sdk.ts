import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TiendaNubeClient } from "../utils/client.js";
import { z } from "zod";

/**
 * Checkout SDK helper tools (template/snippet generator)
 * Note: Checkout SDK is a frontend JS library. This tool returns
 * a safe template and guidance for integration based on docs.
 */

const GenerateCheckoutSdkTemplateSchema = z.object({
  version: z.enum(["2025-03", "v1", "next"]).default("2025-03"),
  language: z.enum(["en", "es", "pt"]).default("en"),
  features: z
    .array(
      z.enum([
        "init_skeleton",
        "listen_ready",
        "preselect_payment_option",
        "apply_coupon_ui",
        "track_checkout_events",
      ])
    )
    .default(["init_skeleton", "listen_ready"]),
  payment_provider_hint: z
    .string()
    .optional()
    .describe("Human hint to identify provider/option in your code"),
  notes: z.string().optional(),
});

export const checkoutSdkTools: Tool[] = [
  {
    name: "tiendanube_generate_checkout_sdk_template",
    description:
      "Generate a Checkout SDK integration template (script tag + skeleton code and guidance).",
    inputSchema: {
      type: "object",
      properties: {
        version: {
          type: "string",
          enum: ["2025-03", "v1", "next"],
          description: "Docs version to link in comments",
        },
        language: {
          type: "string",
          enum: ["en", "es", "pt"],
          description: "Language for inline tips",
        },
        features: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "init_skeleton",
              "listen_ready",
              "preselect_payment_option",
              "apply_coupon_ui",
              "track_checkout_events",
            ],
          },
          description: "Which template sections to include",
        },
        payment_provider_hint: {
          type: "string",
          description: "Optional hint about provider/option to preselect",
        },
        notes: {
          type: "string",
          description: "Optional notes to embed in the template header",
        },
      },
    },
  },
];

export async function handleCheckoutSdkTool(
  name: string,
  args: any,
  _client: TiendaNubeClient
): Promise<any> {
  switch (name) {
    case "tiendanube_generate_checkout_sdk_template": {
      const {
        version,
        language,
        features,
        payment_provider_hint,
        notes,
      } = GenerateCheckoutSdkTemplateSchema.parse(args ?? {});

      const docBase = "https://tiendanube.github.io/api-documentation";
      const docUrl =
        version === "v1"
          ? `${docBase}/v1/resources/checkout_sdk`
          : version === "next"
          ? `${docBase}/next/resources/checkout_sdk`
          : `${docBase}/resources/checkout_sdk`;

      const i18n = (en: string, es: string, pt: string) =>
        language === "es" ? es : language === "pt" ? pt : en;

      const header = [
        `/*`,
        `  Tienda Nube / Nuvemshop Checkout SDK Template`,
        `  Docs: ${docUrl}`,
        notes ? `  Notes: ${notes}` : undefined,
        `  This is a safe template/skeleton.`,
        `  Replace TODOs with the actual SDK calls per official docs.`,
        `*/`,
      ]
        .filter(Boolean)
        .join("\n");

      const lines: string[] = [header];

      // Script tag placeholder (kept generic to avoid stale URL breakage)
      lines.push(
        "\n<!-- Include the Checkout SDK per docs (script src may change by version) -->",
        `<!-- See: ${docUrl} -->`,
        "<!-- <script src=\"[CHECKOUT_SDK_SCRIPT_URL]\" defer></script> -->"
      );

      // Initialization skeleton
      if (features.includes("init_skeleton")) {
        lines.push(
          "\n<script>",
          "  // Wait for SDK/global object to be available.",
          "  // Replace 'onCheckoutSdkReady' with the actual readiness hook per docs.",
          "  function onCheckoutSdkReady() {",
          "    // TODO: Access checkout SDK instance/global.",
          "    // const checkout = window.__NUVEMSHOP_CHECKOUT__ || window.checkout;",
          "  }",
          "  // TODO: Wire the actual readiness event.",
          "  // document.addEventListener('checkout:ready', onCheckoutSdkReady);",
          "</script>"
        );
      }

      if (features.includes("listen_ready")) {
        lines.push(
          "\n<script>",
          "  // Example: listen for readiness (adjust to the real event)",
          "  // document.addEventListener('checkout:ready', (ev) => {",
          "  //   console.log('Checkout ready', ev.detail);",
          "  // });",
          "</script>"
        );
      }

      if (features.includes("preselect_payment_option")) {
        lines.push(
          "\n<script>",
          "  // Preselect a payment option once the SDK is ready.",
          "  // TODO: Replace with the actual API for selecting payment options.",
          `  // Hint: ${payment_provider_hint ?? "<add your provider/option key>"}`,
          "  function preselectPaymentOption() {",
          "    // Example pseudocode:",
          "    // const optionId = 'your_provider_or_option_id';",
          "    // checkout.payment.selectOption(optionId);",
          "  }",
          "  // document.addEventListener('checkout:ready', preselectPaymentOption);",
          "</script>"
        );
      }

      if (features.includes("apply_coupon_ui")) {
        lines.push(
          "\n<script>",
          "  // Provide a simple UI to apply a coupon via the SDK.",
          "  // TODO: Replace with the actual API to apply coupons.",
          "  function applyCoupon(code) {",
          "    // checkout.coupons.apply(code).then(() => {",
          "    //   console.log('Coupon applied');",
          "    // }).catch((e) => console.error('Failed to apply coupon', e));",
          "  }",
          "</script>",
          "\n<!-- Example input/button UI -->",
          "<div style=\"margin: 8px 0;\">",
          i18n(
            "  <label>Coupon: <input id=\"couponCode\" /></label>",
            "  <label>Cupón: <input id=\"couponCode\" /></label>",
            "  <label>Cupom: <input id=\"couponCode\" /></label>"
          ),
          i18n(
            "  <button onclick=\"applyCoupon(document.getElementById('couponCode').value)\">Apply</button>",
            "  <button onclick=\"applyCoupon(document.getElementById('couponCode').value)\">Aplicar</button>",
            "  <button onclick=\"applyCoupon(document.getElementById('couponCode').value)\">Aplicar</button>"
          ),
          "</div>"
        );
      }

      if (features.includes("track_checkout_events")) {
        lines.push(
          "\n<script>",
          "  // Track key checkout lifecycle events (adjust event names per docs).",
          "  // document.addEventListener('checkout:payment:selected', (ev) => console.log('Payment selected', ev.detail));",
          "  // document.addEventListener('checkout:submitted', (ev) => console.log('Checkout submitted', ev.detail));",
          "  // document.addEventListener('checkout:completed', (ev) => console.log('Order completed', ev.detail));",
          "</script>"
        );
      }

      const instructions: string[] = [
        i18n(
          "Open the checkout template or theme file that renders checkout.",
          "Abra la plantilla o archivo del tema que renderiza el checkout.",
          "Abra o arquivo de tema que renderiza o checkout."
        ),
        i18n(
          "Include the Checkout SDK script tag as per the official documentation.",
          "Incluya la etiqueta de script del Checkout SDK según la documentación oficial.",
          "Inclua a tag de script do Checkout SDK conforme a documentação oficial."
        ),
        i18n(
          "Wire the readiness event and replace TODOs with the real SDK methods from docs.",
          "Conecte el evento de disponibilidad y reemplace los TODOs con los métodos reales del SDK.",
          "Conecte o evento de disponibilidade e substitua os TODOs pelos métodos reais do SDK."
        ),
        i18n(
          "Test end-to-end in a sandbox or test store.",
          "Pruebe de punta a punta en un sandbox o tienda de prueba.",
          "Teste de ponta a ponta em um ambiente de testes ou loja de teste."
        ),
      ];

      return {
        success: true,
        docs: docUrl,
        template: lines.join("\n"),
        instructions,
      };
    }
    default:
      throw new Error(`Unknown checkout SDK tool: ${name}`);
  }
}

