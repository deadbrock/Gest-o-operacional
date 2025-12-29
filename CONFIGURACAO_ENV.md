# ⚙️ Configuração de Variáveis de Ambiente

## 📄 Arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações do Servidor
PORT=3002
NODE_ENV=production

# Segurança
JWT_SECRET=sua-chave-secreta-muito-forte-aqui-mude-em-producao

# Banco de Dados
DATABASE_PATH=./database.sqlite

# Upload de Arquivos
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## 🔐 Configurações Importantes

### JWT_SECRET
**O que é:** Chave secreta para gerar tokens de autenticação

**⚠️ IMPORTANTE:**
- Mude para uma chave forte e única
- Nunca compartilhe esta chave
- Use no mínimo 32 caracteres aleatórios

**Gerar chave forte:**
```powershell
# PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### PORT
**O que é:** Porta onde o servidor irá rodar

**Valores comuns:**
- `3002` - Desenvolvimento/Produção local
- `80` - HTTP padrão (requer permissões de administrador)
- `443` - HTTPS padrão (requer certificado SSL)

### NODE_ENV
**O que é:** Ambiente de execução

**Valores:**
- `development` - Desenvolvimento (logs detalhados)
- `production` - Produção (otimizado)
- `test` - Testes

---

## 🌐 Configurações para Deploy na Nuvem

### Railway

Railway detecta automaticamente as variáveis. Configure no dashboard:

```bash
railway variables set JWT_SECRET="sua-chave-aqui"
railway variables set NODE_ENV="production"
```

Ou no arquivo `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"

[[deploy.environmentVariables]]
name = "NODE_ENV"
value = "production"

[[deploy.environmentVariables]]
name = "PORT"
value = "3002"
```

### Render

Configure no dashboard do Render:
1. Vá em "Environment"
2. Adicione as variáveis:
   - `JWT_SECRET` = sua-chave-secreta
   - `NODE_ENV` = production
   - `PORT` = 3002

### Heroku

```bash
heroku config:set JWT_SECRET="sua-chave-secreta"
heroku config:set NODE_ENV="production"
```

---

## 🗂️ Estrutura de Diretórios

O sistema criará automaticamente:

```
projeto/
├── database.sqlite     # Banco de dados
├── uploads/           # Arquivos enviados pelos usuários
└── dist/             # Código compilado
```

---

## ✅ Checklist de Configuração

Para **Desenvolvimento:**
- [ ] Arquivo .env criado
- [ ] PORT definida (3002)
- [ ] NODE_ENV = development
- [ ] JWT_SECRET definido

Para **Produção (Rede Local):**
- [ ] Arquivo .env criado
- [ ] PORT definida
- [ ] NODE_ENV = production
- [ ] JWT_SECRET FORTE e único
- [ ] Backup do banco de dados configurado

Para **Produção (Nuvem):**
- [ ] Variáveis configuradas no painel
- [ ] JWT_SECRET FORTE e único
- [ ] NODE_ENV = production
- [ ] Domínio configurado (opcional)

---

## 🔒 Segurança

### ⚠️ NUNCA:
- Compartilhe o arquivo `.env`
- Faça commit do `.env` no Git
- Use a mesma JWT_SECRET em diferentes ambientes
- Use senhas fracas para JWT_SECRET

### ✅ SEMPRE:
- Mantenha `.env` no `.gitignore`
- Use JWT_SECRET diferente para dev/produção
- Faça backup das configurações de produção
- Documente as variáveis necessárias

---

## 📝 Variáveis Adicionais (Opcional)

### Para Email (futura implementação):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha
```

### Para Logs:
```env
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Para CORS (APIs externas):
```env
CORS_ORIGIN=https://seu-frontend.com
```

---

## 🆘 Problemas Comuns

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "JWT_SECRET is not defined"
- Verifique se o arquivo `.env` existe
- Verifique se está na raiz do projeto
- Reinicie o servidor após criar o arquivo

### "Port 3002 already in use"
- Mude a PORT no `.env`
- Ou finalize o processo que está usando a porta:

```powershell
# Windows PowerShell
netstat -ano | findstr :3002
taskkill /PID [numero_do_pid] /F
```

---

## 📚 Referências

- [Documentação dotenv](https://www.npmjs.com/package/dotenv)
- [Best Practices Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Segurança JWT](https://jwt.io/introduction)

---

🔧 **Configuração concluída! Seu sistema está pronto para rodar!**

