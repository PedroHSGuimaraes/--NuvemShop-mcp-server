# Como usar o Servidor MCP da Tienda Nube

## ✅ Problema resolvido!

Os erros de JSON que você estava vendo foram corrigidos. O servidor agora tem:

### 🔧 Correções implementadas:

1. **Tratamento robusto de JSON**: Método `sanitizeForJson()` que remove referências circulares e valores não serializáveis
2. **Validação de autenticação**: Verificação prévia antes de fazer chamadas à API
3. **Mensagens de erro claras**: Respostas de erro estruturadas e serializáveis
4. **Tratamento de exceções**: Captura adequada de todos os tipos de erro

### 🚀 Como testar o servidor:

1. **Reinicie o Claude Desktop** para carregar as mudanças
2. **Use primeiro a ferramenta de autenticação**:

   ```
   tiendanube_authenticate
   ```

   Parâmetros necessários:
   - `access_token`: Seu token OAuth da Tienda Nube
   - `store_id`: ID da sua loja

3. **Teste uma chamada simples**:
   ```
   tiendanube_get_store_info
   ```

### 📋 Ferramentas disponíveis (37 total):

#### Autenticação (2):

- `tiendanube_authenticate` - Configurar credenciais
- `tiendanube_get_store_info` - Informações da loja

#### Produtos (6):

- `tiendanube_list_products` - Listar produtos
- `tiendanube_get_product` - Obter produto específico
- `tiendanube_create_product` - Criar produto
- `tiendanube_update_product` - Atualizar produto
- `tiendanube_delete_product` - Deletar produto
- `tiendanube_search_products` - Buscar produtos

#### Pedidos (6):

- `tiendanube_list_orders` - Listar pedidos
- `tiendanube_get_order` - Obter pedido específico
- `tiendanube_update_order` - Atualizar pedido
- `tiendanube_cancel_order` - Cancelar pedido
- `tiendanube_get_order_fulfillments` - Obter fulfillments
- `tiendanube_search_orders` - Buscar pedidos

#### Clientes (6):

- `tiendanube_list_customers` - Listar clientes
- `tiendanube_get_customer` - Obter cliente específico
- `tiendanube_create_customer` - Criar cliente
- `tiendanube_update_customer` - Atualizar cliente
- `tiendanube_delete_customer` - Deletar cliente
- `tiendanube_search_customers` - Buscar clientes

#### Categorias (5):

- `tiendanube_list_categories` - Listar categorias
- `tiendanube_get_category` - Obter categoria específica
- `tiendanube_create_category` - Criar categoria
- `tiendanube_update_category` - Atualizar categoria
- `tiendanube_delete_category` - Deletar categoria

#### Cupons (5):

- `tiendanube_list_coupons` - Listar cupons
- `tiendanube_get_coupon` - Obter cupom específico
- `tiendanube_create_coupon` - Criar cupom
- `tiendanube_update_coupon` - Atualizar cupom
- `tiendanube_delete_coupon` - Deletar cupom

#### Webhooks (5):

- `tiendanube_list_webhooks` - Listar webhooks
- `tiendanube_get_webhook` - Obter webhook específico
- `tiendanube_create_webhook` - Criar webhook
- `tiendanube_update_webhook` - Atualizar webhook
- `tiendanube_delete_webhook` - Deletar webhook

### 🔑 Obtendo credenciais da API:

1. Acesse o [painel de desenvolvedores da Tienda Nube](https://partners.tiendanube.com/)
2. Crie um aplicativo ou use um existente
3. Obtenha o `access_token` via OAuth 2.0
4. Use o `store_id` da loja que você quer gerenciar

### ⚡ Exemplo de uso:

```bash
# 1. Autenticar (substitua pelos seus dados reais)
tiendanube_authenticate
{
  "access_token": "seu_token_aqui",
  "store_id": "123456"
}

# 2. Listar produtos
tiendanube_list_products
{
  "limit": 10,
  "page": 1
}

# 3. Buscar produtos por nome
tiendanube_search_products
{
  "query": "camiseta",
  "limit": 5
}
```

### 🛠️ Se ainda houver problemas:

1. Verifique se o Claude Desktop foi reiniciado
2. Confirme que o arquivo `claude_desktop_config.json` está correto
3. Teste primeiro com `tiendanube_authenticate`
4. Verifique se suas credenciais estão válidas

O servidor agora deve funcionar sem erros de JSON! 🎉
