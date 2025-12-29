# 🗄️ Inicializar PostgreSQL no Railway

## 🔍 Problema: Sistema Instável

O backend está crashando porque:
- ❌ Banco PostgreSQL está vazio (sem tabelas)
- ❌ Sistema tenta acessar tabelas inexistentes
- ❌ Crashes e reinicia constantemente

---

## 🚀 Solução: Executar Setup no Railway

### Opção 1: Alterar Deploy Command Temporariamente (Recomendado)

#### Passo 1: Ir para Configurações

1. **Acesse:** Railway Dashboard
2. **Clique** no seu serviço (backend)
3. **Vá em:** Settings

#### Passo 2: Alterar Start Command

**Encontre:** Deploy → Start Command

**De:**
```bash
npm start
```

**Para (temporário):**
```bash
npm run setup && npm start
```

Isso vai:
1. ✅ Criar todas as tabelas
2. ✅ Criar usuário admin
3. ✅ Popular políticas
4. ✅ Iniciar o servidor

#### Passo 3: Fazer Redeploy

1. **Clique em:** Deployments
2. **Clique em:** ... (três pontos) no último deploy
3. **Clique em:** Redeploy
4. **Aguarde:** 2-3 minutos

#### Passo 4: Ver Logs (IMPORTANTE)

1. **Vá em:** Logs (menu lateral)
2. **Procure por:**
   ```
   🗄️  Criando tabelas...
   ✅ Tabelas criadas!
   👤 Usuário admin criado!
   📋 Políticas populadas!
   🚀 Servidor rodando...
   ```

#### Passo 5: Voltar Start Command

**Após setup bem-sucedido, VOLTE para:**
```bash
npm start
```

**E faça mais um Redeploy**

---

### Opção 2: Via Railway CLI (Alternativa)

Se tiver Railway CLI instalado:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Executar comando remoto
railway run npm run setup

# Reiniciar serviço
railway up
```

---

### Opção 3: Conectar ao PostgreSQL e Executar SQL (Avançado)

#### Passo 1: Obter Credenciais do PostgreSQL

Railway → PostgreSQL → Connect → Copy Connection String

Algo como:
```
postgresql://postgres:senha@containers.railway.app:port/railway
```

#### Passo 2: Conectar via Cliente PostgreSQL

**Via Railway:**
```bash
railway connect postgres
```

**Ou via psql:**
```bash
psql "postgresql://postgres:senha@containers.railway.app:port/railway"
```

#### Passo 3: Criar Tabelas Manualmente

```sql
-- Ver tabelas existentes
\dt

-- Se não houver tabelas, o Sequelize criará automaticamente
-- ao executar npm run setup
```

---

## 📋 Script de Setup Explicado

O comando `npm run setup` executa:

```json
{
  "scripts": {
    "setup": "npm run init-db && npm run create-admin && npm run seed-policies"
  }
}
```

### 1. `npm run init-db`
- Cria todas as tabelas do banco
- Usa o Sequelize sync()

### 2. `npm run create-admin`
- Cria usuário: admin@gestaoviagens.com
- Senha: admin123
- Role: ADMIN

### 3. `npm run seed-policies`
- Popula 7 políticas padrão
- Limites de hospedagem, passagens, etc.

---

## 🔍 Como Ver Logs no Railway

### Via Dashboard:

1. **Railway** → Seu Serviço
2. **Logs** (menu lateral esquerdo)
3. **Ver em tempo real**

### Via CLI:

```bash
railway logs --follow
```

### O Que Procurar:

**✅ Logs Bons:**
```
🔵 Usando PostgreSQL (Produção)
✅ Conexão com banco de dados estabelecida
✅ Modelos sincronizados
🚀 Servidor rodando na porta 3002
```

**❌ Logs Ruins (Erros):**
```
❌ Error: relation "users" does not exist
❌ Error: connect ECONNREFUSED
❌ SequelizeDatabaseError
```

---

## 🐛 Problemas Comuns

### ❌ "relation 'users' does not exist"

**Causa:** Tabelas não foram criadas

**Solução:** Execute `npm run setup`

---

### ❌ "Connection refused" ou "ECONNREFUSED"

**Causa:** Variável DATABASE_URL incorreta

**Solução:**
1. Railway → PostgreSQL → Variables
2. Copie a `DATABASE_URL`
3. Certifique-se que está disponível no serviço backend

---

### ❌ "Invalid connection string"

**Causa:** DATABASE_URL malformada

**Solução:**
Formato correto:
```
postgresql://user:password@host:port/database
```

---

### ❌ Backend fica reiniciando

**Causa:** Crashes contínuos por falta de tabelas

**Solução:**
1. Execute setup
2. Veja logs para identificar erro exato

---

## ✅ Verificar se Setup Funcionou

### Teste 1: Logs do Railway

Deve aparecer:
```
✅ Usuário admin criado com sucesso
✅ Políticas criadas com sucesso
🚀 Servidor rodando na porta 3002
```

### Teste 2: API Status

```bash
curl https://gest-o-operacional-production.up.railway.app/api/status
```

**Resposta esperada:**
```json
{
  "status": "online",
  "message": "API está funcionando!"
}
```

### Teste 3: Login

```bash
curl -X POST https://gest-o-operacional-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gestaoviagens.com",
    "senha": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@gestaoviagens.com",
    "role": "ADMIN"
  }
}
```

---

## 📊 Estrutura do Banco PostgreSQL

Após o setup, você terá estas tabelas:

```
railway=# \dt

                List of relations
 Schema |           Name            | Type  |  Owner   
--------+---------------------------+-------+----------
 public | colaboradores             | table | postgres
 public | despesas_rdv              | table | postgres
 public | documents                 | table | postgres
 public | hospedagens               | table | postgres
 public | passagens                 | table | postgres
 public | policies                  | table | postgres
 public | solicitacoes_alimentacao  | table | postgres
 public | solicitacoes_viagem       | table | postgres
 public | users                     | table | postgres
```

---

## 🎯 Checklist Completo

### Antes do Setup:

- [ ] PostgreSQL criado no Railway
- [ ] DATABASE_URL disponível no backend
- [ ] Backend conectado ao PostgreSQL
- [ ] Código mais recente (com suporte PostgreSQL)

### Executar Setup:

- [ ] Start Command alterado para: `npm run setup && npm start`
- [ ] Redeploy executado
- [ ] Logs verificados (setup concluído?)
- [ ] Start Command voltado para: `npm start`
- [ ] Redeploy final executado

### Após Setup:

- [ ] API /status responde
- [ ] Login funciona
- [ ] Tabelas criadas (verificar logs)
- [ ] Sistema estável (não reinicia)

---

## 🚀 Comandos Rápidos (Railway CLI)

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Ver logs em tempo real
railway logs --follow

# Executar comando no Railway
railway run npm run setup

# Conectar ao PostgreSQL
railway connect postgres

# Reiniciar serviço
railway restart
```

---

## 💡 Dica Importante

**SEMPRE** execute o setup apenas **UMA VEZ**!

Depois, mantenha apenas:
```bash
npm start
```

Se precisar recriar o banco:
```bash
# ⚠️ CUIDADO: Apaga todos os dados!
npm run init-db
npm run create-admin
npm run seed-policies
```

---

## 📞 Próximos Passos

1. **Altere** Start Command para `npm run setup && npm start`
2. **Faça** Redeploy
3. **Veja** os logs até aparecer "Servidor rodando"
4. **Volte** Start Command para `npm start`
5. **Teste** o login no frontend

---

🎉 **Após isso, seu sistema estará estável e funcionando!**

