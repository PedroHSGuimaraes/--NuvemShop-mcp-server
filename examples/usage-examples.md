# Exemplos de Uso - Tienda Nube MCP Server

Este arquivo contém exemplos práticos de como usar o servidor MCP da Tienda Nube para diversos cenários de e-commerce.

## 🔐 1. Autenticação Inicial

Sempre comece autenticando com a API:

```json
{
  "name": "tiendanube_authenticate",
  "arguments": {
    "access_token": "seu_access_token_aqui",
    "store_id": "123456"
  }
}
```

## 📦 2. Gerenciamento de Produtos

### Criar um produto simples

```json
{
  "name": "tiendanube_create_product",
  "arguments": {
    "name_es": "Camiseta Básica",
    "name_pt": "Camiseta Básica",
    "price": "29.99",
    "stock": 100,
    "sku": "CAM-BAS-001",
    "published": true,
    "free_shipping": false,
    "weight": "200",
    "categories": [123]
  }
}
```

### Criar produto com múltiplas imagens

```json
{
  "name": "tiendanube_create_product",
  "arguments": {
    "name_es": "Smartphone Premium",
    "name_pt": "Smartphone Premium",
    "price": "899.99",
    "promotional_price": "799.99",
    "stock": 50,
    "sku": "PHONE-PREM-001",
    "published": true,
    "brand": "TechBrand",
    "image_urls": [
      "https://exemplo.com/phone1.jpg",
      "https://exemplo.com/phone2.jpg",
      "https://exemplo.com/phone3.jpg"
    ],
    "seo_title": "Smartphone Premium - Alta Qualidade",
    "seo_description": "O melhor smartphone do mercado com tecnologia avançada",
    "tags": "smartphone,premium,tecnologia"
  }
}
```

### Buscar produtos por categoria

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "category_id": 123,
    "published": true,
    "page": 1,
    "per_page": 20,
    "sort_by": "price-ascending"
  }
}
```

### Buscar produtos com estoque baixo

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "max_stock": 10,
    "published": true,
    "sort_by": "name-ascending"
  }
}
```

## 🛒 3. Gerenciamento de Pedidos

### Criar pedido completo

```json
{
  "name": "tiendanube_create_order",
  "arguments": {
    "customer_name": "João Silva",
    "customer_email": "joao@exemplo.com",
    "customer_phone": "+5511999999999",
    "products": [
      {
        "variant_id": 12345,
        "quantity": 2,
        "price": "29.99"
      },
      {
        "variant_id": 67890,
        "quantity": 1
      }
    ],
    "billing_address": "Rua das Flores, 123",
    "billing_city": "São Paulo",
    "billing_province": "SP",
    "billing_country": "Brasil",
    "billing_zipcode": "01234-567",
    "billing_number": "123",
    "billing_floor": "Apto 45",
    "shipping_pickup_type": "ship",
    "note": "Entregar na portaria",
    "send_confirmation_email": true
  }
}
```

### Listar pedidos do último mês

```json
{
  "name": "tiendanube_list_orders",
  "arguments": {
    "created_at_min": "2024-08-01T00:00:00Z",
    "status": "any",
    "page": 1,
    "per_page": 50
  }
}
```

### Buscar pedidos pagos não enviados

```json
{
  "name": "tiendanube_list_orders",
  "arguments": {
    "payment_status": "paid",
    "shipping_status": "unfulfilled",
    "status": "open"
  }
}
```

## 👥 4. Gerenciamento de Clientes

### Criar cliente com endereço

```json
{
  "name": "tiendanube_create_customer",
  "arguments": {
    "name": "Maria Santos",
    "email": "maria@exemplo.com",
    "phone": "+5511888888888",
    "identification": "12345678901",
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "province": "SP",
    "country": "Brasil",
    "zipcode": "01310-100",
    "number": "1000",
    "note": "Cliente VIP"
  }
}
```

### Buscar clientes por email

```json
{
  "name": "tiendanube_search_customers",
  "arguments": {
    "query": "maria@exemplo.com"
  }
}
```

## 🏷️ 5. Gerenciamento de Categorias

### Criar categoria principal

```json
{
  "name": "tiendanube_create_category",
  "arguments": {
    "name_es": "Electrónicos",
    "name_pt": "Eletrônicos",
    "name_en": "Electronics",
    "description_es": "Productos electrónicos de alta calidad",
    "description_pt": "Produtos eletrônicos de alta qualidade"
  }
}
```

### Criar subcategoria

```json
{
  "name": "tiendanube_create_category",
  "arguments": {
    "name_es": "Smartphones",
    "name_pt": "Smartphones",
    "parent_id": 123,
    "google_shopping_category": "Electronics > Communications > Telephony > Mobile Phones"
  }
}
```

## 💰 6. Gerenciamento de Cupons

### Cupom de desconto percentual

```json
{
  "name": "tiendanube_create_coupon",
  "arguments": {
    "code": "DESCONTO20",
    "type": "percentage",
    "value": "20",
    "valid": true,
    "max_uses": 100,
    "min_price": "50.00",
    "start_date": "2024-09-01T00:00:00Z",
    "end_date": "2024-09-30T23:59:59Z"
  }
}
```

### Cupom de valor fixo para categoria específica

```json
{
  "name": "tiendanube_create_coupon",
  "arguments": {
    "code": "ELETRONICOS50",
    "type": "absolute",
    "value": "50.00",
    "valid": true,
    "max_uses": 50,
    "min_price": "200.00",
    "categories": [123],
    "start_date": "2024-09-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z"
  }
}
```

## 🔔 7. Gerenciamento de Webhooks

### Webhook para novos pedidos

```json
{
  "name": "tiendanube_create_webhook",
  "arguments": {
    "url": "https://meu-sistema.com/webhooks/new-order",
    "event": "order/created"
  }
}
```

### Webhook para produtos atualizados

```json
{
  "name": "tiendanube_create_webhook",
  "arguments": {
    "url": "https://meu-sistema.com/webhooks/product-updated",
    "event": "product/updated"
  }
}
```

### Listar todos os webhooks ativos

```json
{
  "name": "tiendanube_list_webhooks",
  "arguments": {}
}
```

## 📊 8. Cenários de Relatórios

### Produtos mais vendidos (via busca)

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "sort_by": "best-selling",
    "per_page": 20,
    "published": true
  }
}
```

### Pedidos do dia atual

```json
{
  "name": "tiendanube_list_orders",
  "arguments": {
    "created_at_min": "2024-09-09T00:00:00Z",
    "created_at_max": "2024-09-09T23:59:59Z"
  }
}
```

### Clientes cadastrados este mês

```json
{
  "name": "tiendanube_list_customers",
  "arguments": {
    "created_at_min": "2024-09-01T00:00:00Z",
    "per_page": 100
  }
}
```

## 🔄 9. Operações em Lote

### Atualizar múltiplos produtos (exemplo de workflow)

1. **Listar produtos de uma categoria:**

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "category_id": 123,
    "per_page": 100
  }
}
```

2. **Atualizar cada produto individualmente:**

```json
{
  "name": "tiendanube_update_product",
  "arguments": {
    "product_id": 12345,
    "free_shipping": true
  }
}
```

### Processar pedidos pendentes

1. **Buscar pedidos pendentes:**

```json
{
  "name": "tiendanube_list_orders",
  "arguments": {
    "payment_status": "pending",
    "status": "open"
  }
}
```

2. **Atualizar status conforme necessário:**

```json
{
  "name": "tiendanube_update_order",
  "arguments": {
    "order_id": 67890,
    "owner_note": "Pagamento confirmado manualmente"
  }
}
```

## 🔍 10. Busca e Filtros Avançados

### Busca complexa de produtos

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "q": "camiseta",
    "min_stock": 1,
    "has_promotional_price": true,
    "published": true,
    "sort_by": "price-ascending",
    "language": "pt"
  }
}
```

### Análise de pedidos por período

```json
{
  "name": "tiendanube_list_orders",
  "arguments": {
    "created_at_min": "2024-08-01T00:00:00Z",
    "created_at_max": "2024-08-31T23:59:59Z",
    "payment_status": "paid",
    "per_page": 200,
    "aggregates": "fulfillment_orders"
  }
}
```

## 🛠️ 11. Manutenção e Limpeza

### Verificar produtos sem estoque

```json
{
  "name": "tiendanube_list_products",
  "arguments": {
    "max_stock": 0,
    "published": true
  }
}
```

### Listar cupons expirados

```json
{
  "name": "tiendanube_list_coupons",
  "arguments": {
    "created_at_max": "2024-08-31T23:59:59Z",
    "valid": false
  }
}
```

## ⚠️ 12. Tratamento de Erros

### Exemplo de resposta de erro

```json
{
  "success": false,
  "error": "Product with ID 99999 not found",
  "type": "ProductError"
}
```

### Validação antes de criar produto

```json
{
  "name": "tiendanube_get_category",
  "arguments": {
    "category_id": 123
  }
}
```

## 💡 Dicas de Boas Práticas

1. **Sempre autentique primeiro** antes de usar outras ferramentas
2. **Use paginação** para listas grandes (per_page máximo 200)
3. **Valide IDs** antes de fazer operações de update/delete
4. **Use filtros específicos** para melhorar performance
5. **Implemente retry logic** para operações críticas
6. **Monitore rate limits** da API
7. **Use webhooks** para sincronização em tempo real
8. **Mantenha logs** de todas as operações importantes

---

**Estes exemplos cobrem os principais casos de uso do e-commerce. Adapte conforme suas necessidades específicas!**
