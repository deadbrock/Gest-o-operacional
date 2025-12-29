# 🚀 Deploy Manual no Vercel

## ✅ Vercel CLI Instalado!

Versão: 50.1.3 ✅

---

## 📋 Passo a Passo Completo

### 1️⃣ Fazer Login no Vercel

Abra o terminal e execute:

```bash
cd "C:\Users\user\Documents\gestao operacional\Gest-o-operacional"
vercel login
```

**O que acontece:**
- Abrirá o navegador
- Faça login com GitHub (recomendado)
- Confirme no navegador
- Volte ao terminal

---

### 2️⃣ Linkar ao Projeto Existente

```bash
vercel link
```

**Perguntas que aparecerão:**

1. **"Set up and deploy?"** → `Y` (Yes)

2. **"Which scope?"** → Selecione: `douglas-projects-c2be5a2b`

3. **"Link to existing project?"** → `Y` (Yes)

4. **"What's the name of your existing project?"** → Digite: `gestao_operacional`

**Pronto!** Projeto linkado ✅

---

### 3️⃣ Fazer Deploy

```bash
vercel --prod
```

**O que vai acontecer:**
- Vercel vai fazer upload dos arquivos
- Vai detectar que é um site estático
- Vai fazer o deploy
- Vai te dar a URL final

**Tempo:** 2-3 minutos

**Resultado esperado:**
```
✅  Preview: https://gestao-operacional-xxxx.vercel.app
✅  Deployed to production
```

---

## 🎯 Comandos Resumidos (Copie e Cole)

```bash
# 1. Login
vercel login

# 2. Linkar projeto
vercel link

# 3. Deploy em produção
vercel --prod
```

---

## 📍 Opção 2: Via Dashboard (Alternativa)

Se preferir usar a interface web:

### Passo 1: Ir para o Projeto

Acesse: https://vercel.com/douglas-projects-c2be5a2b/gestao_operacional

### Passo 2: Configurar Build Settings

1. Clique em **"Settings"**
2. Vá em **"General"**
3. Configure:

```
Framework Preset: Other
Root Directory: ./
Build Command: (deixe vazio ou: echo "Static site")
Output Directory: public
Install Command: (deixe vazio)
```

4. **Save**

### Passo 3: Conectar ao GitHub

1. Vá em **"Git"**
2. **"Connect Git Repository"**
3. Selecione: `deadbrock/Gest-o-operacional`
4. Branch: `main`
5. **Connect**

### Passo 4: Deploy Manual

1. Vá em **"Deployments"**
2. Clique em **"Deploy"** ou **"Redeploy"**
3. Aguarde 2-3 minutos

---

## 🔧 Verificar Configuração do vercel.json

Antes de fazer deploy, vamos confirmar o `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/public/login.html"
    },
    {
      "src": "/app",
      "dest": "/public/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

✅ **Já está configurado!**

---

## 🐛 Problemas Comuns

### ❌ "Authentication failed"

**Solução:**
```bash
vercel logout
vercel login
```

---

### ❌ "Project not found"

**Solução:**
Use `vercel link` para reconectar ao projeto

---

### ❌ "Build failed"

**Solução:**
Como é site estático, não precisa de build. Configure:
- Build Command: (vazio)
- Output Directory: `public`

---

### ❌ "404 Not Found" após deploy

**Solução:**
Verifique se o `vercel.json` está na raiz do projeto e configurado corretamente.

---

## 📊 Após Deploy Bem-Sucedido

### 1. Obter URL do Vercel

Após o deploy, você terá uma URL tipo:
```
https://gestao-operacional-xxxx.vercel.app
```

### 2. Atualizar Railway

No Railway → Variables → Adicionar:
```
FRONTEND_URL=https://gestao-operacional-xxxx.vercel.app
```

### 3. Testar

1. Abra a URL do Vercel
2. Faça login: admin / admin123
3. Abra DevTools (F12)
4. Verifique se requisições vão para Railway ✅

---

## 🎯 Comandos Úteis do Vercel CLI

```bash
# Ver informações do projeto
vercel inspect

# Ver deployments
vercel ls

# Ver logs
vercel logs

# Remover projeto
vercel remove gestao_operacional

# Abrir no navegador
vercel open
```

---

## ✅ Checklist de Deploy

- [ ] Vercel CLI instalado
- [ ] Login no Vercel feito
- [ ] Projeto linkado
- [ ] `vercel.json` configurado
- [ ] Deploy executado
- [ ] URL obtida
- [ ] Testado no navegador
- [ ] FRONTEND_URL configurado no Railway

---

## 🚀 Executar Agora

**Cole no terminal:**

```bash
cd "C:\Users\user\Documents\gestao operacional\Gest-o-operacional"
vercel login
vercel link
vercel --prod
```

**Aguarde a URL e teste!**

---

## 📞 Se Tiver Problemas

### Ver logs do deploy:
```bash
vercel logs
```

### Forçar redeploy:
```bash
vercel --prod --force
```

### Limpar cache e redeploy:
```bash
vercel --prod --no-cache
```

---

🎉 **Pronto para fazer deploy!**

Execute os comandos acima e em 2-3 minutos seu frontend estará online no Vercel!

