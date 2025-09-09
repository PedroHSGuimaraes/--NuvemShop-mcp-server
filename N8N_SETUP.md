# Configuração do Servidor MCP Tienda Nube no n8n

## 🎯 Configuração Rápida

### Campos para preencher no n8n:

```
Connect using: Command Line (STDIO)

Command: node

Arguments: d:\Trabalho\--Hias\--Livre\tiendanube-mcp-server\dist\index.js

Environments: NODE_ENV=production
```

### 🔄 Alternativa para WSL:

```
Connect using: Command Line (STDIO)

Command: wsl

Arguments: node /mnt/d/Trabalho/--Hias/--Livre/tiendanube-mcp-server/dist/index.js

Environments: NODE_ENV=production
```

## ✅ Verificações antes de configurar:

1. **Projeto compilado:** ✅ (rodamos `npm run build`)
2. **Arquivo dist/index.js existe:** ✅
3. **Node.js instalado:** ✅

## 🚀 Após conectar no n8n:

1. **Primeiro use:** `tiendanube_authenticate`
   - access_token: "seu_token_da_tienda_nube"
   - store_id: "id_da_sua_loja"

2. **Teste:** `tiendanube_get_store_info`

3. **Use qualquer uma das 37 ferramentas disponíveis!**

## 🛠️ Ferramentas disponíveis:

### Autenticação:

- tiendanube_authenticate
- tiendanube_get_store_info

### Produtos:

- tiendanube_list_products
- tiendanube_get_product
- tiendanube_create_product
- tiendanube_update_product
- tiendanube_delete_product
- tiendanube_search_products

### Pedidos:

- tiendanube_list_orders
- tiendanube_get_order
- tiendanube_update_order
- tiendanube_cancel_order
- tiendanube_get_order_fulfillments
- tiendanube_search_orders

### Clientes:

- tiendanube_list_customers
- tiendanube_get_customer
- tiendanube_create_customer
- tiendanube_update_customer
- tiendanube_delete_customer
- tiendanube_search_customers

### Categorias:

- tiendanube_list_categories
- tiendanube_get_category
- tiendanube_create_category
- tiendanube_update_category
- tiendanube_delete_category

### Cupons:

- tiendanube_list_coupons
- tiendanube_get_coupon
- tiendanube_create_coupon
- tiendanube_update_coupon
- tiendanube_delete_coupon

### Webhooks:

- tiendanube_list_webhooks
- tiendanube_get_webhook
- tiendanube_create_webhook
- tiendanube_update_webhook
- tiendanube_delete_webhook

## 📞 Troubleshooting:

Se não funcionar:

1. Verifique se o caminho está correto
2. Teste no terminal: `node d:\Trabalho\--Hias\--Livre\tiendanube-mcp-server\dist\index.js`
3. Use a alternativa WSL se necessário
4. Verifique se o Node.js está no PATH
