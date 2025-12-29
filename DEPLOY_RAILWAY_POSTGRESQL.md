# 🚀 Deploy no Railway com PostgreSQL

## 📋 Guia Completo de Deploy

### ✅ Passo 1: Push das Correções (CONCLUÍDO)

As correções de TypeScript foram commitadas e enviadas ao GitHub! ✅

---

## 🗄️ Passo 2: Adicionar PostgreSQL no Railway

### 1. No Dashboard do Railway:

1. **Abra seu projeto no Railway**
2. **Clique em "New"** no projeto
3. **Selecione "Database"**
4. **Escolha "Add PostgreSQL"**
5. **Aguarde a criação do banco**

### 2. Conectar o Banco ao Serviço:

O Railway automaticamente cria as variáveis de conexão:
- `DATABASE_URL` (completa)
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

---

## 📦 Passo 3: Instalar Dependências do PostgreSQL

Execute localmente:

```bash
npm install pg pg-hstore
```

Isso adiciona o driver PostgreSQL ao seu projeto.

---

## 🔧 Passo 4: Atualizar Configuração do Banco

Já vou criar um arquivo de configuração que detecta automaticamente se está usando SQLite (local) ou PostgreSQL (Railway).

---

## ⚙️ Passo 5: Variáveis de Ambiente no Railway

No Railway, configure:

```env
NODE_ENV=production
JWT_SECRET=SUA_CHAVE_SECRETA_FORTE_AQUI
PORT=3002
```

**IMPORTANTE:** O `DATABASE_URL` já é criado automaticamente pelo Railway quando você adiciona o PostgreSQL!

---

## 🚀 Passo 6: Deploy Automático

Após fazer push para o GitHub:

```bash
git add .
git commit -m "feat: adicionar suporte PostgreSQL"
git push origin main
```

O Railway fará o deploy automaticamente! 🎉

---

## 📊 Monitoramento

### Ver Logs do Deploy:

No Railway:
1. Clique no seu serviço
2. Vá em "Deployments"
3. Clique no deploy ativo
4. Veja os logs em tempo real

### Testar o Deploy:

```bash
curl https://seu-app.up.railway.app/api/status
```

Deve retornar:
```json
{
  "status": "online",
  "message": "API está funcionando!"
}
```

---

## 🗄️ Migração de Dados (Opcional)

Se você tem dados no SQLite local e quer migrar para PostgreSQL:

### 1. Exportar dados do SQLite:

```bash
sqlite3 database.sqlite .dump > backup.sql
```

### 2. Converter para PostgreSQL:

Ajuste o SQL manualmente ou use ferramentas como:
- `pgloader`
- Scripts de migração

### 3. Importar no Railway:

Use o cliente PostgreSQL conectado ao Railway.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'pg'"

**Solução:**
```bash
npm install pg pg-hstore
git add package.json package-lock.json
git commit -m "feat: adicionar driver PostgreSQL"
git push origin main
```

### Erro: "Connection refused"

**Solução:**
- Verifique se o PostgreSQL foi criado no Railway
- Verifique se o serviço está conectado ao banco
- Verifique as variáveis de ambiente

### Erro: "Table does not exist"

**Solução:**
- O Sequelize criará as tabelas automaticamente no primeiro deploy
- Se não criar, verifique os logs do Railway
- Você pode precisar rodar `sync({ force: true })` uma vez (CUIDADO: apaga dados!)

---

## 📝 Checklist de Deploy

Antes de fazer deploy:

- [ ] Correções de TypeScript commitadas ✅
- [ ] Driver PostgreSQL instalado (`pg`, `pg-hstore`)
- [ ] Configuração do banco atualizada
- [ ] PostgreSQL criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Push para GitHub realizado
- [ ] Deploy monitorado no Railway
- [ ] Testes realizados na URL do Railway

---

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Teste a API:**
   ```bash
   curl https://seu-app.up.railway.app/api/status
   ```

2. **Acesse o frontend:**
   ```
   https://seu-app.up.railway.app
   ```

3. **Faça login:**
   - Usuário: admin
   - Senha: admin123

4. **Configure domínio customizado (opcional):**
   - No Railway: Settings > Domains
   - Adicione seu domínio

---

## 🔐 Segurança em Produção

### IMPORTANTE:

1. **Mude o JWT_SECRET:**
   ```bash
   # Gere uma chave forte:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Configure CORS:**
   - Se tiver frontend separado, ajuste as origens permitidas

3. **Desabilite sync force:**
   - Nunca use `sync({ force: true })` em produção!

4. **Configure backups:**
   - Railway faz backups automáticos do PostgreSQL

---

## 📚 Recursos Úteis

- [Documentação Railway](https://docs.railway.app/)
- [Sequelize + PostgreSQL](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#postgresql)
- [Railway CLI](https://docs.railway.app/develop/cli)

---

🎉 **Pronto! Seu sistema estará rodando em produção com PostgreSQL!**
