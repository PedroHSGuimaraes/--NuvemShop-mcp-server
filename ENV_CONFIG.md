# 🔐 Configuração com Variáveis de Ambiente

## ✅ Configuração Completa

### 1. Arquivo `claude_desktop_config.json` já configurado:

```json
{
  "mcpServers": {
    "tiendanube": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "TIENDANUBE_ACCESS_TOKEN": "seu_token_aqui",
        "TIENDANUBE_STORE_ID": "seu_store_id_aqui"
      }
    }
  }
}
```

### 2. Substitua os valores:

1. **TIENDANUBE_ACCESS_TOKEN**: Seu token OAuth da Tienda Nube
2. **TIENDANUBE_STORE_ID**: ID da sua loja (normalmente um número)

### 📝 Exemplo real:

```json
{
  "mcpServers": {
    "tiendanube": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "TIENDANUBE_ACCESS_TOKEN": "abc123def456ghi789",
        "TIENDANUBE_STORE_ID": "123456"
      }
    }
  }
}
```

## 🚀 Como usar:

### Automático (com env configurado):

1. Reinicie o Claude Desktop
2. Use diretamente: `tiendanube_get_store_info`
3. Todas as ferramentas já funcionarão!

### Manual (se precisar trocar credenciais):

1. Use: `tiendanube_authenticate`
2. Isso sobrescreverá as credenciais do env temporariamente

## 🔍 Verificação:

Quando o servidor iniciar, você verá uma das mensagens:

✅ **Com credenciais configuradas:**

```
✅ TiendaNube credentials loaded from environment variables
```

⚠️ **Sem credenciais:**

```
⚠️ TiendaNube credentials not found in environment. Use tiendanube_authenticate tool to set them.
```

## 🔐 Obtendo as credenciais:

### Access Token:

1. Acesse: https://partners.tiendanube.com/
2. Crie/selecione seu aplicativo
3. Configure OAuth 2.0
4. Obtenha o token de acesso

### Store ID:

- Normalmente é um número (ex: 123456)
- Encontrado na URL da administração da loja
- Ou obtido via API após autenticação

## 🎉 Vantagens desta configuração:

1. **Segurança**: Credenciais não ficam no código
2. **Praticidade**: Não precisa autenticar toda vez
3. **Flexibilidade**: Pode trocar facilmente editando o arquivo
4. **Automação**: Perfeito para uso em workflows

## 📋 Troubleshooting:

**Se não funcionar:**

1. Verifique se as credenciais estão corretas
2. Reinicie o Claude Desktop
3. Teste com `tiendanube_get_store_info`
4. Se necessário, use `tiendanube_authenticate` manualmente
