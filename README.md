# Tienda Nube MCP Server

Servidor MCP (Model Context Protocol) para integrar com a API da Tienda Nube/Nuvemshop.

Este servidor expõe ferramentas MCP abrangendo os principais recursos da API v1:

- Autenticação e informações da loja: `tiendanube_get_store_info`
- Produtos: listar, buscar, obter, criar, atualizar, excluir
- Pedidos: listar, obter, criar, atualizar, cancelar, fulfillment
- Clientes: listar, buscar, obter, criar, atualizar, excluir
- Categorias: listar, obter, criar, atualizar, excluir
- Cupons: listar, obter, criar, atualizar, excluir
- Webhooks: listar, obter, criar, atualizar, excluir

Requisitos
- Node.js 18+
- Variáveis de ambiente:
  - `TIENDANUBE_ACCESS_TOKEN` (obrigatório)
  - `TIENDANUBE_STORE_ID` (obrigatório)

Instalação
- Instale as dependências: `npm install`
- Compile o projeto: `npm run build`

Execução
- Stdio (MCP padrão): `npm start`
- HTTP utilitário: `npm run start:http` (endpoint de saúde em `/health`)

Configuração do Cliente MCP
Adicione no seu cliente MCP (por exemplo, Claude Desktop) apontando para o binário ou para `node dist/index.js`.

Ferramentas Disponíveis
Liste as ferramentas via MCP (ListTools). O servidor registra mais de 35 ferramentas cobrindo:
- `tiendanube_*product*`
- `tiendanube_*order*`
- `tiendanube_*customer*`
- `tiendanube_*category*`
- `tiendanube_*coupon*`
- `tiendanube_*webhook*`

Exemplos de Uso (MCP CallTool)
- Obter info da loja: `tiendanube_get_store_info`
- Listar produtos: `tiendanube_list_products` (args opcionais: `page`, `per_page`, `language`, `q`, etc.)
- Criar produto: `tiendanube_create_product` (campos multilíngues e variantes suportados)
- Listar pedidos: `tiendanube_list_orders` (filtros por status, pagamento, datas)
- Criar pedido: `tiendanube_create_order` (cliente, itens, endereços)
- Gerenciar webhooks: `tiendanube_list_webhooks` | `tiendanube_create_webhook` | `tiendanube_update_webhook` | `tiendanube_delete_webhook`

Notas Importantes
- Rate limit e backoff: o cliente implementa retry para 429/5xx.
- Serialização segura: respostas são sanitizadas para JSON.
- Multi‑idioma: diversos campos aceitam `es`, `pt`, `en`.

Problemas e Próximos Passos
Se você precisar de recursos extras da documentação oficial (por exemplo, operações dedicadas para variantes ou imagens fora do payload do produto), abra uma issue ou peça aqui que eu adiciono as ferramentas MCP correspondentes.
