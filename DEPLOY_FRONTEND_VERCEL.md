# 🚀 Deploy: Backend (Railway) + Frontend (Vercel)

## ✅ Configuração Completa

Seu projeto foi configurado para rodar em duas plataformas:

```
┌──────────────────┐         ┌──────────────────┐
│     RAILWAY      │◄───────►│     VERCEL       │
├──────────────────┤         ├──────────────────┤
│ Express API      │         │ HTML/CSS/JS      │
│ PostgreSQL       │         │ Frontend         │
│ Autenticação     │         │ CDN Global       │
│ Upload Files     │         │ Ultra-rápido ⚡  │
└──────────────────┘         └──────────────────┘
```

---

## 📋 Arquivos Criados/Modificados

### ✅ Novos Arquivos:

1. **`vercel.json`** - Configuração do Vercel
2. **`public/js/config.js`** - Configuração dinâmica da API

### ✅ Arquivos Atualizados:

1. **`src/server.ts`** - CORS configurado para Vercel
2. **`public/js/api.js`** - URL dinâmica da API
3. **`public/index.html`** - Carrega config.js
4. **`public/login.html`** - Carrega config.js

---

## 🚀 Passo 1: Deploy do Backend no Railway

### 1.1. Adicionar PostgreSQL

No Railway:
1. Abra seu projeto
2. Clique em **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Aguarde a criação (1-2 min)

### 1.2. Configurar Variáveis de Ambiente

No seu serviço (backend), adicione:

```env
NODE_ENV=production
JWT_SECRET=<GERAR_CHAVE_FORTE>
FRONTEND_URL=https://seu-app.vercel.app
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.3. Fazer Push das Alterações

```bash
cd "C:\Users\user\Documents\gestao operacional\Gest-o-operacional"

git add .
git commit -m "feat: configurar CORS e deploy separado frontend/backend"
git push origin main
```

### 1.4. Aguardar Deploy

O Railway detecta automaticamente e faz o deploy.

**Verificar:**
- Railway > Deployments > Ver logs
- Procure por: `🚀 Servidor rodando na porta...`

### 1.5. Obter URL do Backend

No Railway:
1. Clique no seu serviço
2. Vá em **"Settings"** → **"Domains"**
3. **Copie a URL** (exemplo: `https://gestao-operacional-production.up.railway.app`)

⚠️ **ATENÇÃO:** Você precisará desta URL no próximo passo!

---

## 🎨 Passo 2: Deploy do Frontend no Vercel

### 2.1. Atualizar URL do Backend

**IMPORTANTE:** Antes de fazer deploy no Vercel, atualize a URL do backend!

Edite `public/js/config.js`:

```javascript
const API_BASE_URL = isLocalhost
  ? 'http://localhost:3002'  
  : 'https://SEU_APP_RAILWAY.up.railway.app';  // ⚠️ COLE A URL DO RAILWAY AQUI
```

**Substitua** `SEU_APP_RAILWAY.up.railway.app` pela URL real do Railway!

**Commitar:**
```bash
git add public/js/config.js
git commit -m "chore: atualizar URL do backend Railway"
git push origin main
```

### 2.2. Deploy no Vercel (Via Dashboard)

1. **Acesse:** https://vercel.com/

2. **Login:** Com GitHub, GitLab ou email

3. **Novo Projeto:**
   - Clique em **"Add New..."** → **"Project"**
   - Selecione **"Import Git Repository"**
   - Escolha seu repositório: `deadbrock/Gest-o-operacional`

4. **Configurar Deploy:**

   **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (padrão)
   - **Build Command:** (deixe vazio ou `echo "Static site"`)
   - **Output Directory:** `public`
   - **Install Command:** (deixe vazio)

5. **Clique em "Deploy"**

6. **Aguardar:** 1-2 minutos

7. **Pronto!** ✅

### 2.3. Deploy no Vercel (Via CLI - Alternativa)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (na raiz do projeto)
cd "C:\Users\user\Documents\gestao operacional\Gest-o-operacional"
vercel

# Responder prompts:
# ? Set up and deploy? Yes
# ? Which scope? (sua conta)
# ? Link to existing project? No
# ? What's your project's name? gestao-operacional
# ? In which directory is your code located? ./
# ? Want to override the settings? Yes
# ? Build Command: (deixe vazio)
# ? Output Directory: public
# ? Development Command: (deixe vazio)

# Deploy!
# Vai gerar URL: https://gestao-operacional-xxxx.vercel.app
```

---

## 🔧 Passo 3: Configurar Variáveis no Vercel (Opcional)

Se quiser configurar URLs diferentes por ambiente:

No Vercel:
1. Vá em **"Settings"** → **"Environment Variables"**
2. Adicione:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://seu-app.up.railway.app`
   - **Environment:** Production

---

## ✅ Passo 4: Testar o Sistema

### 4.1. Testar Backend (Railway)

```bash
curl https://seu-app.up.railway.app/api/status
```

**Resposta esperada:**
```json
{
  "status": "online",
  "message": "API está funcionando!"
}
```

### 4.2. Testar Frontend (Vercel)

1. **Abra:** `https://seu-app.vercel.app`
2. **Deve aparecer:** Tela de login
3. **Abra DevTools** (F12)
4. **Vá em "Network"**
5. **Faça login** com: admin / admin123
6. **Verifique:** As requisições vão para o Railway? ✅

---

## 🔄 Passo 5: Atualizar URL do Vercel no Railway

Depois do deploy no Vercel, você terá a URL final.

### No Railway:

1. Vá em **"Variables"**
2. Atualize:
   ```env
   FRONTEND_URL=https://gestao-operacional-xxxx.vercel.app
   ```
3. **Salvar** (vai reiniciar automaticamente)

---

## 🎯 Resumo: URLs Finais

| Serviço | URL | Função |
|---------|-----|--------|
| **Backend** | `https://seu-app.up.railway.app` | API REST |
| **API** | `https://seu-app.up.railway.app/api` | Endpoints |
| **Frontend** | `https://seu-app.vercel.app` | Interface do usuário |

---

## 🔐 Passo 6: Criar Usuário Admin (Primeira Vez)

No Railway (apenas na primeira vez):

### Opção A: Temporariamente alterar Deploy Command

1. Railway → Serviço → **"Settings"** → **"Deploy"**
2. Mudar **"Start Command"** para:
   ```bash
   npm run setup && npm start
   ```
3. **Redeploy**
4. Aguardar conclusão
5. **Voltar** Start Command para:
   ```bash
   npm start
   ```

### Opção B: Via API

```bash
curl -X POST https://seu-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gestaoviagens.com",
    "senha": "admin123",
    "nome": "Administrador",
    "role": "ADMIN"
  }'
```

---

## 🚀 Passo 7: Deploy Contínuo (Automático)

Agora toda vez que você fizer push para `main`:

1. **Railway:** Detecta mudança e redeploy backend ✅
2. **Vercel:** Detecta mudança e redeploy frontend ✅

```bash
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Aguardar deploy automático (1-3 min)
```

---

## 🐛 Troubleshooting

### ❌ Erro CORS no Console

```
Access to fetch at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**Solução:**
1. Verifique se o backend está rodando
2. Verifique se `.vercel.app` está permitido no CORS (já está!)
3. Se tiver domínio custom, adicione em `src/server.ts`

---

### ❌ API retorna 404 ou 502

**Solução:**
1. Verifique se o Railway está rodando
2. Teste a API diretamente: `curl https://seu-app.up.railway.app/api/status`
3. Veja os logs no Railway

---

### ❌ Frontend não carrega

**Solução:**
1. Verifique se o deploy no Vercel foi bem-sucedido
2. Veja os logs no Vercel → Deployments
3. Teste: `https://seu-app.vercel.app/js/config.js`
4. Deve retornar o arquivo JavaScript

---

### ❌ Requisições vão para localhost

**Solução:**
1. Verifique `public/js/config.js`
2. A URL do Railway está correta?
3. Fez commit e push?
4. O Vercel fez redeploy?

**Forçar redeploy no Vercel:**
- Vercel → Deployments → ... → Redeploy

---

## 📊 Monitoramento

### Logs do Backend (Railway)

```bash
# Via CLI
railway logs --follow

# Ou no dashboard:
# Railway > Seu Serviço > Logs
```

### Logs do Frontend (Vercel)

```bash
# Via CLI
vercel logs [deployment-url]

# Ou no dashboard:
# Vercel > Seu Projeto > Deployments > View Function Logs
```

---

## 🎯 Checklist Final

Antes de considerar o deploy concluído:

- [ ] Backend no Railway funcionando
- [ ] PostgreSQL criado e conectado
- [ ] Variáveis de ambiente configuradas (Railway)
- [ ] CORS configurado
- [ ] URL do Railway copiada
- [ ] `config.js` atualizado com URL do Railway
- [ ] Código commitado e enviado ao GitHub
- [ ] Frontend no Vercel deployado
- [ ] URL do Vercel copiada
- [ ] `FRONTEND_URL` configurado no Railway
- [ ] Testado: Login funciona? ✅
- [ ] Testado: API responde? ✅
- [ ] DevTools: Requisições vão para Railway? ✅

---

## 🎉 Pronto!

Agora você tem:

✅ **Backend** robusto no Railway (Express + PostgreSQL)  
✅ **Frontend** ultra-rápido no Vercel (CDN global)  
✅ **HTTPS** automático em ambos  
✅ **Deploy contínuo** via GitHub  
✅ **Escalabilidade** independente  

---

## 📞 Próximos Passos

### Opcional: Domínio Customizado

**Vercel (Frontend):**
1. Vercel → Settings → Domains
2. Adicione: `www.seu-dominio.com`
3. Configure DNS conforme instruções

**Railway (Backend):**
1. Railway → Settings → Domains
2. Adicione: `api.seu-dominio.com`
3. Configure DNS conforme instruções

---

## 💡 Dicas de Performance

### Cache no Vercel

Já configurado! O Vercel cacheia automaticamente:
- ✅ CSS/JS estáticos
- ✅ Imagens
- ✅ Assets públicos

### Otimizar Backend

```typescript
// src/server.ts - Adicionar compressão
import compression from 'compression';
app.use(compression());
```

---

🎉 **Deploy concluído! Seu sistema está online e acessível de qualquer lugar!**

