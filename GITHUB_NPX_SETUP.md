# 🚀 Guia Completo: GitHub + NPX

## ✅ Configuração para GitHub e NPX

### 1️⃣ Subir para o GitHub

```bash
# Inicializar repositório Git
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "🚀 Initial release: Tienda Nube MCP Server with 37 tools"

# Adicionar origem remota (substitua seu-usuario)
git remote add origin https://github.com/seu-usuario/tiendanube-mcp-server.git

# Push para GitHub
git push -u origin main
```

### 2️⃣ Publicar no NPM (opcional)

```bash
# Login no NPM
npm login

# Publicar pacote
npm publish
```

### 3️⃣ Configuração via NPX

#### Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tiendanube": {
      "command": "npx",
      "args": ["tiendanube-mcp-server"],
      "env": {
        "TIENDANUBE_ACCESS_TOKEN": "seu_token_aqui",
        "TIENDANUBE_STORE_ID": "seu_store_id_aqui"
      }
    }
  }
}
```

#### n8n (MCP Client node):

- **Command:** `npx`
- **Arguments:** `tiendanube-mcp-server`
- **Environment:** Suas credenciais

### 4️⃣ Configuração via GitHub (sem NPM)

#### Claude Desktop:

```json
{
  "mcpServers": {
    "tiendanube": {
      "command": "npx",
      "args": ["github:seu-usuario/tiendanube-mcp-server"],
      "env": {
        "TIENDANUBE_ACCESS_TOKEN": "seu_token_aqui",
        "TIENDANUBE_STORE_ID": "seu_store_id_aqui"
      }
    }
  }
}
```

#### n8n:

- **Command:** `npx`
- **Arguments:** `github:seu-usuario/tiendanube-mcp-server`

## 🎯 Vantagens de cada abordagem:

### 📦 NPM Package:

- ✅ Mais rápido (cache do NPM)
- ✅ Versionamento automático
- ✅ Mais confiável
- ✅ Descoberta via npm search

### 🐙 GitHub Direct:

- ✅ Sempre a versão mais recente
- ✅ Não precisa publicar no NPM
- ✅ Controle total sobre o código
- ✅ Gratuito

## 🔧 Comandos úteis:

### Testar localmente via NPX:

```bash
# Testar antes de publicar
npx ./

# Ou se já foi publicado
npx tiendanube-mcp-server
```

### Atualizar versão (antes de republicar):

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Ver detalhes do pacote:

```bash
npm info tiendanube-mcp-server
```

## 🚀 Próximos passos:

1. **Crie um repositório no GitHub**
2. **Faça o push do código**
3. **Opcionalmente publique no NPM**
4. **Atualize o claude_desktop_config.json**
5. **Reinicie o Claude Desktop**
6. **Teste com `tiendanube_get_store_info`**

## 🎉 Resultado final:

- ✅ Servidor MCP funcionando via NPX
- ✅ Fácil de instalar e usar
- ✅ Sempre atualizado
- ✅ Funciona no Claude Desktop e n8n
- ✅ 37 ferramentas da Tienda Nube prontas para uso!
