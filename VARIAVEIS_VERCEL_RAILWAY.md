# 🔧 Configuração: Railway + Vercel

## ✅ URL do Railway

Seu backend está em:
```
https://gest-o-operacional-production.up.railway.app
```

---

## 🎯 Opção 1: Sem Variáveis de Ambiente (Recomendado)

### ✅ JÁ CONFIGURADO!

O arquivo `public/js/config.js` já foi atualizado com a URL do Railway:

```javascript
const API_BASE_URL = isLocalhost
  ? 'http://localhost:3002'  
  : 'https://gest-o-operacional-production.up.railway.app';  // ✅
```

### Vantagens:
- ✅ Simples
- ✅ Não precisa configurar nada no Vercel
- ✅ URL já está hardcoded no código

### Deploy:
```bash
✅ Commit e push já foram feitos!
⏳ O Vercel vai fazer redeploy automático em 2-3 minutos
```

---

## 🎯 Opção 2: Com Variáveis de Ambiente (Opcional)

Se você quiser usar variáveis de ambiente no Vercel:

### No Vercel:

1. **Acesse:** https://vercel.com/
2. **Vá para seu projeto**
3. **Settings** → **Environment Variables**
4. **Adicione:**

```
Name:  NEXT_PUBLIC_API_URL
Value: https://gest-o-operacional-production.up.railway.app
Environment: Production, Preview, Development
```

### Atualizar `config.js`:

```javascript
// URL base da API
const API_BASE_URL = isLocalhost
  ? 'http://localhost:3002'  
  : process.env.NEXT_PUBLIC_API_URL || 'https://gest-o-operacional-production.up.railway.app';
```

⚠️ **Nota:** Como não estamos usando Next.js, variáveis de ambiente não funcionarão no frontend estático!

---

## 🔧 Variáveis no Railway (Backend)

### Obrigatórias:

No Railway, configure:

```env
NODE_ENV=production
JWT_SECRET=<SUA_CHAVE_FORTE>
DATABASE_URL=<AUTO_GERADO_PELO_POSTGRESQL>
```

### Opcional (mas recomendado):

```env
FRONTEND_URL=https://seu-app.vercel.app
PORT=3002
```

**Como adicionar:**
1. Railway → Seu Serviço
2. **Variables** tab
3. **New Variable**
4. Adicionar cada uma

---

## 📊 Resumo das URLs

| Serviço | URL | Uso |
|---------|-----|-----|
| **Backend Railway** | `https://gest-o-operacional-production.up.railway.app` | API REST |
| **API Endpoints** | `https://gest-o-operacional-production.up.railway.app/api` | Endpoints |
| **Frontend Vercel** | `https://seu-app.vercel.app` | Interface |

---

## 🚀 Próximos Passos

### 1. Aguardar Deploy do Vercel

O Vercel detectou o novo commit e está fazendo redeploy.

**Verificar:**
- Vercel → Deployments
- Ver status: Building... → Ready ✅

### 2. Testar a API do Railway

```bash
# Testar se o backend está funcionando
curl https://gest-o-operacional-production.up.railway.app/api/status
```

**Resposta esperada:**
```json
{
  "status": "online",
  "message": "API está funcionando!",
  "timestamp": "2025-12-29T..."
}
```

### 3. Atualizar FRONTEND_URL no Railway

Depois que o Vercel fizer deploy, você terá a URL do frontend.

**No Railway:**
1. Vá em **Variables**
2. Adicione ou atualize:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```

### 4. Testar o Sistema Completo

1. **Abra:** `https://seu-app.vercel.app`
2. **Faça login:** admin / admin123
3. **Abra DevTools** (F12)
4. **Network tab**
5. **Verifique:** Requisições vão para `gest-o-operacional-production.up.railway.app`? ✅

---

## 🐛 Troubleshooting

### ❌ Erro CORS

Se aparecer erro CORS:

```
Access to fetch at 'https://gest-o-operacional-production...' 
from origin 'https://seu-app.vercel.app' 
has been blocked by CORS policy
```

**Solução:**

1. **No Railway**, verifique se o CORS está configurado
2. O código já permite `.vercel.app`:

```typescript
// src/server.ts
if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
  return callback(null, true);
}
```

3. Se não funcionar, adicione a URL específica:

**Railway → Variables → Adicionar:**
```
FRONTEND_URL=https://seu-app-exato.vercel.app
```

---

### ❌ API retorna 404

**Verificar:**

1. Backend está rodando?
   ```bash
   curl https://gest-o-operacional-production.up.railway.app/api/status
   ```

2. URL está correta no `config.js`?
   - Veja no console do navegador
   - Deve aparecer: `🔗 API URL: https://gest-o-operacional-production...`

3. Railway fez deploy com sucesso?
   - Railway → Deployments → Ver logs

---

### ❌ Frontend não atualiza

**Forçar redeploy no Vercel:**

1. Vercel → Deployments
2. Clique no último deploy
3. **... → Redeploy**
4. Marcar "Use existing Build Cache" = OFF
5. **Redeploy**

---

## ✅ Checklist Completo

### Backend (Railway):

- [x] PostgreSQL criado
- [x] Domínio gerado: `gest-o-operacional-production.up.railway.app`
- [ ] Variáveis configuradas (NODE_ENV, JWT_SECRET)
- [ ] Backend funcionando (teste com curl)
- [ ] CORS permite Vercel

### Frontend (Vercel):

- [x] `config.js` atualizado com URL do Railway
- [x] Commit e push feitos
- [ ] Deploy do Vercel concluído
- [ ] URL do Vercel obtida
- [ ] Teste no navegador funcionando

### Integração:

- [ ] FRONTEND_URL configurado no Railway
- [ ] Requisições do frontend vão para Railway
- [ ] Login funciona
- [ ] Sistema completo operacional

---

## 🎯 Comandos Úteis

### Testar Backend:

```bash
# Status da API
curl https://gest-o-operacional-production.up.railway.app/api/status

# Criar usuário admin (primeira vez)
curl -X POST https://gest-o-operacional-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gestaoviagens.com",
    "senha": "admin123",
    "nome": "Administrador",
    "role": "ADMIN"
  }'
```

### Ver Logs:

```bash
# Railway CLI
railway logs

# Ou no dashboard:
# Railway > Seu Serviço > Logs
```

---

## 📝 Variáveis Resumidas

### ❌ Não Precisa no Vercel:

Para frontend estático (HTML/CSS/JS), variáveis de ambiente **não funcionam** no build.

A URL está hardcoded em `config.js` ✅

### ✅ Precisa no Railway:

```env
NODE_ENV=production
JWT_SECRET=<gere uma chave forte>
DATABASE_URL=<auto-gerado>
FRONTEND_URL=https://seu-app.vercel.app (opcional)
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🎉 Status Atual

### ✅ Concluído:
- Backend Railway com domínio
- URL atualizada no frontend
- Código commitado e enviado
- Deploy automático iniciado

### ⏳ Aguardando:
- Vercel terminar redeploy (2-3 min)
- Testar sistema completo

### 📋 Próximo Passo:
1. Aguardar deploy do Vercel
2. Obter URL do Vercel
3. Adicionar `FRONTEND_URL` no Railway
4. Testar!

---

🚀 **Quase lá! Aguarde o deploy do Vercel e depois teste o sistema!**

