# 🚀 Próximos Passos no Railway

## ✅ O Que Já Foi Feito

- ✅ Erros de TypeScript corrigidos
- ✅ Driver PostgreSQL instalado (`pg`, `pg-hstore`)
- ✅ Configuração do banco atualizada (suporta SQLite local + PostgreSQL produção)
- ✅ Código commitado e enviado ao GitHub

---

## 🎯 Agora no Railway

### 1️⃣ Adicionar PostgreSQL

1. **Abra seu projeto no Railway**
   - Acesse: https://railway.app/

2. **Adicione PostgreSQL:**
   - Clique em **"+ New"**
   - Selecione **"Database"**
   - Escolha **"Add PostgreSQL"**
   - Aguarde a criação (1-2 minutos)

3. **Conecte ao seu serviço:**
   - O Railway automaticamente cria a variável `DATABASE_URL`
   - Ela é compartilhada entre o serviço e o banco

---

### 2️⃣ Configurar Variáveis de Ambiente

No seu serviço (backend), adicione:

```env
NODE_ENV=production
JWT_SECRET=<GERE_UMA_CHAVE_FORTE>
PORT=3002
```

**Como gerar JWT_SECRET forte:**

```bash
# No terminal local:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole como valor de `JWT_SECRET`.

**IMPORTANTE:** A variável `DATABASE_URL` já é criada automaticamente pelo PostgreSQL!

---

### 3️⃣ Fazer Redeploy

Duas opções:

**Opção A: Automático (Recomendado)**
- O Railway detecta o novo commit no GitHub
- Faz deploy automaticamente
- Aguarde 2-3 minutos

**Opção B: Manual**
- No Railway, vá em **"Deployments"**
- Clique em **"Deploy"**
- Ou use o comando: `railway up`

---

### 4️⃣ Monitorar o Deploy

1. **Ver logs em tempo real:**
   - Railway > Seu Serviço > **"Logs"**
   - Procure por:
     ```
     🔵 Usando PostgreSQL (Produção)
     ✅ Conexão com banco de dados estabelecida
     🚀 Servidor rodando na porta...
     ```

2. **Verificar build:**
   - Railway > **"Deployments"**
   - Deve aparecer ✅ **"Success"**
   - Se aparecer ❌ erro, clique para ver detalhes

---

### 5️⃣ Testar a API

```bash
# Substitua pela sua URL do Railway
curl https://seu-app.up.railway.app/api/status
```

**Resposta esperada:**
```json
{
  "status": "online",
  "message": "API está funcionando!",
  "timestamp": "2025-12-29T..."
}
```

---

### 6️⃣ Acessar o Sistema

1. **Abra no navegador:**
   ```
   https://seu-app.up.railway.app
   ```

2. **Fazer login:**
   - Usuário: `admin`
   - Senha: `admin123`

⚠️ **IMPORTANTE:** Na primeira vez, o banco está vazio!

---

## 🗄️ Passo 7: Criar Usuário Admin (Primeira Vez)

Você tem duas opções:

### Opção A: Via API (Recomendado)

```bash
# Criar usuário admin
curl -X POST https://seu-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gestaoviagens.com",
    "senha": "admin123",
    "nome": "Administrador",
    "role": "ADMIN"
  }'
```

### Opção B: Via Script no Railway

1. **Adicione script ao package.json:**

Já está pronto! O script `setup` cria tudo:
```bash
npm run setup
```

2. **Execute no Railway:**
   - Railway > Seu Serviço > **"Settings"**
   - Em "Deploy Command", temporariamente mude para:
     ```
     npm run setup && npm start
     ```
   - Após o primeiro deploy, volte para:
     ```
     npm start
     ```

---

## 🐛 Troubleshooting

### ❌ Erro: "Cannot find module 'pg'"

**Causa:** Railway não instalou as dependências

**Solução:**
```bash
# Localmente
npm install
git add package-lock.json
git commit -m "chore: atualizar lock file"
git push origin main
```

---

### ❌ Erro: "Connection refused" ou "ECONNREFUSED"

**Causa:** PostgreSQL não está conectado ao serviço

**Solução:**
1. Verifique se o PostgreSQL foi criado
2. Verifique se a variável `DATABASE_URL` existe
3. No Railway: Settings > Service Variables
4. Deve haver: `DATABASE_URL=postgresql://...`

---

### ❌ Erro: "relation 'users' does not exist"

**Causa:** Tabelas não foram criadas

**Solução:**
1. O Sequelize cria automaticamente no primeiro acesso
2. Se não criar, execute: `npm run setup` (temporariamente como deploy command)
3. Ou verifique os logs para ver erros de sincronização

---

### ❌ Build falha com erros TypeScript

**Causa:** Código no GitHub ainda tem erros

**Solução:**
- Verifique o último commit
- O push foi bem-sucedido? ✅
- Se ainda tiver erro, rode localmente:
  ```bash
  npm run build
  ```
- Se funcionar local mas não no Railway, limpe o cache:
  - Railway > Settings > "Clear Build Cache"

---

## 📊 Estrutura Final no Railway

```
Seu Projeto Railway
├── 🚀 Backend (seu-app)
│   ├── Conectado ao PostgreSQL
│   ├── Variáveis: NODE_ENV, JWT_SECRET, DATABASE_URL
│   └── Deploy automático do GitHub
│
└── 🗄️ PostgreSQL (database)
    ├── DATABASE_URL (auto-gerado)
    ├── PGHOST, PGPORT, PGUSER, etc.
    └── Volume persistente
```

---

## ✅ Checklist Final

Antes de considerar o deploy concluído:

- [ ] PostgreSQL criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido (sem erros)
- [ ] Logs mostram "PostgreSQL (Produção)"
- [ ] API responde: `/api/status`
- [ ] Usuário admin criado
- [ ] Login funciona
- [ ] Frontend carrega corretamente

---

## 🎯 Comandos Úteis Railway CLI

Se estiver usando a CLI:

```bash
# Ver logs em tempo real
railway logs

# Ver variáveis
railway variables

# Conectar ao PostgreSQL
railway connect postgres

# Fazer deploy manual
railway up

# Abrir no navegador
railway open
```

---

## 📝 Diferenças SQLite vs PostgreSQL

| Recurso | SQLite (Local) | PostgreSQL (Railway) |
|---------|----------------|----------------------|
| **Conexão** | Arquivo local | URL remota + SSL |
| **Concorrência** | Limitada | Alta |
| **Tipos de dados** | Simplificados | Completos |
| **Performance** | Boa p/ dev | Excelente p/ prod |
| **Backup** | Manual | Automático (Railway) |

O código agora suporta **AMBOS** automaticamente! 🎉

---

## 🔐 Segurança em Produção

### Obrigatório:

1. ✅ **JWT_SECRET forte** (64+ caracteres)
2. ✅ **Senha do admin alterada** após primeiro login
3. ✅ **HTTPS habilitado** (Railway faz automaticamente)
4. ✅ **Variáveis de ambiente** (não no código)

### Recomendado:

5. ⚠️ **CORS configurado** para domínio específico
6. ⚠️ **Rate limiting** em rotas sensíveis
7. ⚠️ **Logs de auditoria** habilitados
8. ⚠️ **Backups regulares** (Railway tem automático)

---

## 🎉 Pronto!

Após seguir esses passos:

✅ Seu backend estará rodando no Railway  
✅ Usando PostgreSQL em produção  
✅ Com HTTPS automático  
✅ Deploy automático do GitHub  
✅ Acessível de qualquer lugar  

---

## 📞 Suporte

**Logs do Railway:** Railway > Logs  
**Status do Projeto:** Railway > Overview  
**Documentação:** https://docs.railway.app/

---

🚀 **Boa sorte com o deploy!**

