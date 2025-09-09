# 🚀 Guia de Instalação Rápida - Tienda Nube MCP Server

Este guia irá ajudá-lo a configurar e usar o servidor MCP da Tienda Nube em poucos minutos.

## ✅ Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Credenciais da API Tienda Nube (access token e store ID)
- Claude Desktop ou outro cliente MCP

## 📥 Instalação

### 1. Clone ou baixe o projeto

```bash
# Se usando git
git clone <repository-url>
cd tiendanube-mcp-server

# Ou extraia o arquivo ZIP baixado
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Compile o projeto

```bash
npm run build
```

### 4. Teste a instalação

```bash
npm test
```

Se tudo estiver correto, você verá:

```
✅ Servidor iniciado com sucesso!
🎯 Próximos passos:
   1. Configure suas credenciais da Tienda Nube
   2. Adicione o servidor ao Claude Desktop
   3. Use tiendanube_authenticate para começar
```

## 🔧 Configuração no Claude Desktop

### 1. Localize o arquivo de configuração

**Windows:**

```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**

```
~/.config/Claude/claude_desktop_config.json
```

### 2. Adicione o servidor MCP

Edite o arquivo `claude_desktop_config.json` e adicione:

```json
{
  "mcpServers": {
    "tiendanube": {
      "command": "node",
      "args": ["/caminho/completo/para/tiendanube-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

**Substitua `/caminho/completo/para/` pelo caminho real onde você baixou o projeto.**

### 3. Reinicie o Claude Desktop

Feche completamente o Claude Desktop e abra novamente.

## 🔐 Obtenha suas Credenciais da Tienda Nube

### 1. Acesse o Painel da Tienda Nube

- Faça login na sua conta Tienda Nube
- Vá para o painel administrativo da sua loja

### 2. Acesse a seção de Apps

- No menu lateral, clique em "Apps"
- Clique em "Desenvolver" ou "Develop"

### 3. Crie ou use uma App existente

- Se não tiver uma app, clique em "Criar App"
- Se já tiver, clique na app existente

### 4. Obtenha as credenciais

Você precisará dos seguintes dados:

- **Access Token**: Token de acesso OAuth 2.0
- **Store ID**: ID numérico da sua loja

### 5. Anote o Store ID

O Store ID pode ser encontrado na URL da sua loja ou nas configurações da app.

## 🎯 Primeiro Uso

### 1. Abra o Claude Desktop

Após reiniciar, o Claude Desktop deve reconhecer o servidor MCP.

### 2. Autentique com a API

Use a ferramenta de autenticação:

```
Quero autenticar com a API da Tienda Nube usando:
- Access Token: seu_token_aqui
- Store ID: seu_store_id_aqui
```

O Claude irá usar a ferramenta `tiendanube_authenticate` automaticamente.

### 3. Verifique a conexão

Teste obtendo informações da loja:

```
Mostre informações da minha loja Tienda Nube
```

## 📚 Exemplos de Comandos

### Listar produtos

```
Liste os primeiros 10 produtos da minha loja
```

### Criar produto

```
Crie um produto com nome "Camiseta Azul", preço R$ 49,90 e estoque de 50 unidades
```

### Listar pedidos

```
Mostre os pedidos criados hoje
```

### Criar cliente

```
Cadastre um cliente com nome "João Silva" e email "joao@example.com"
```

## 🛠️ Comandos Úteis

### Durante desenvolvimento:

```bash
# Compilar alterações
npm run build

# Executar em modo desenvolvimento
npm run dev

# Testar servidor
npm test

# Ver arquivos compilados
ls -la dist/
```

### Verificar funcionamento:

```bash
# Iniciar servidor manualmente
npm start

# O servidor deve mostrar:
# "Tienda Nube MCP Server running on stdio"
```

## 🔍 Solução de Problemas

### ❌ Erro: "command not found"

- Verifique se o Node.js está instalado: `node --version`
- Verifique se o caminho no `claude_desktop_config.json` está correto

### ❌ Erro de autenticação

- Verifique se o access token está correto
- Confirme se o store ID está correto
- Teste as credenciais diretamente na API da Tienda Nube

### ❌ Claude não reconhece o servidor

- Verifique se o arquivo `claude_desktop_config.json` está na localização correta
- Confirme se a sintaxe JSON está correta
- Reinicie completamente o Claude Desktop

### ❌ Servidor não inicia

- Execute `npm test` para verificar erros
- Verifique se todas as dependências foram instaladas: `npm install`
- Confirme se o projeto foi compilado: `npm run build`

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs de erro** no Claude Desktop
2. **Execute o teste** com `npm test`
3. **Confirme as credenciais** da Tienda Nube
4. **Verifique a documentação** no README.md

## 🎉 Pronto!

Se tudo funcionou, você agora tem acesso a mais de 35 ferramentas para gerenciar sua loja Tienda Nube diretamente no Claude:

- ✅ Autenticação e informações da loja
- ✅ Gerenciamento completo de produtos
- ✅ Gerenciamento de pedidos e clientes
- ✅ Categorias e cupons de desconto
- ✅ Webhooks e integrações
- ✅ Filtros avançados e busca
- ✅ Suporte multi-idioma

**Aproveite seu novo superpoder de e-commerce! 🚀**
