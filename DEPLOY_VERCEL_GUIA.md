# 🚀 Deploy no Vercel (Adaptação Express)

## ⚠️ Aviso Importante

Seu projeto usa **Express.js tradicional**, que não é ideal para o Vercel.

**Recomendação:** Use Railway para backend + Vercel apenas para frontend.

Mas se você REALMENTE quer fazer deploy no Vercel, aqui está como:

---

## 📦 Frameworks Detectados

### Backend:
- **Express.js** 4.18.2
- **TypeScript** 5.3.3
- **Sequelize ORM** 6.35.2

### Frontend:
- **HTML5 + CSS3 + JavaScript Vanilla**
- **Bootstrap** 5.3

---

## 🔧 Opções de Deploy no Vercel

### Opção 1: Backend + Frontend Separados (RECOMENDADO)

```
Railway (Backend)           Vercel (Frontend)
├── Express API            ├── HTML/CSS/JS
├── PostgreSQL             ├── CDN Global
└── Autenticação           └── Assets Estáticos
```

### Opção 2: Backend Adaptado para Serverless (COMPLEXO)

```
Vercel (Serverless)
├── API Routes (substituem Express)
├── Frontend Estático
└── PostgreSQL Externo (Railway/Supabase)
```

---

## 🎯 Guia: Opção 1 (Backend Railway + Frontend Vercel)

### Passo 1: Backend no Railway

✅ **Já está configurado!** Seu backend ficará no Railway.

URL do backend: `https://seu-app.up.railway.app`

---

### Passo 2: Preparar Frontend para Vercel

Crie uma estrutura separada ou configure o Vercel para servir apenas o `/public`:

**Criar `vercel.json`:**

```json
{
  "version": 2,
  "name": "gestao-viagens-frontend",
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

---

### Passo 3: Atualizar URLs da API

Crie um arquivo de configuração no frontend:

**`public/js/config.js`:**

```javascript
// Detectar ambiente
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3002'  // Desenvolvimento
  : 'https://seu-app.up.railway.app';  // Produção (Railway)

export { API_BASE_URL };
```

**Atualizar `public/js/api.js`:**

```javascript
import { API_BASE_URL } from './config.js';

class API {
  constructor() {
    this.baseURL = API_BASE_URL + '/api';
    this.token = localStorage.getItem('token');
  }
  
  // ... resto do código
}
```

---

### Passo 4: Configurar CORS no Backend

No `src/server.ts` (Railway), atualizar:

```typescript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3002',
  'https://seu-app.vercel.app',  // Adicionar URL do Vercel
  'https://seu-dominio.com'       // Se tiver domínio custom
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commitar e fazer push:

```bash
git add src/server.ts
git commit -m "feat: configurar CORS para Vercel"
git push origin main
```

---

### Passo 5: Deploy no Vercel

**Via Dashboard (Mais Fácil):**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (deixe vazio)
   - **Output Directory:** `public`
   - **Install Command:** (deixe vazio)

5. Clique em **"Deploy"**

**Via CLI:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir prompts:
# - Link to existing project? No
# - Project name: gestao-viagens-frontend
# - Directory: ./
# - Override settings? Yes
# - Build Command: (vazio)
# - Output Directory: public
# - Development Command: (vazio)
```

---

### Passo 6: Testar

1. **Vercel URL:** `https://seu-app.vercel.app`
2. **Backend URL:** `https://seu-app.up.railway.app`

**Teste:**
- Abra a URL do Vercel
- Faça login
- Verifique no DevTools se as chamadas API vão para o Railway

---

## 🎯 Guia: Opção 2 (Vercel Serverless - COMPLEXO)

### ⚠️ Requer Refatoração Completa

**Não recomendado para seu projeto atual!**

Mas se quiser mesmo assim:

1. **Converter Express para Vercel Functions:**

Criar `api/` na raiz:

```
projeto/
├── api/
│   ├── auth/
│   │   └── login.ts       # Função serverless
│   ├── users/
│   │   └── [id].ts        # Função serverless
│   └── ...
└── public/
```

2. **Cada rota vira uma função:**

**`api/auth/login.ts`:**

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDatabase } from '../../src/config/database';
import User from '../../src/models/User';

export default async function handler(
  req: VercelRequest, 
  res: VercelResponse
) {
  // Inicializar conexão DB
  await initDatabase();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email, senha } = req.body;
  
  // ... lógica de login
  
  return res.status(200).json({ token, user });
}
```

3. **Atualizar vercel.json:**

```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.ts", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

4. **Problemas a resolver:**
   - ❌ Cada função inicia nova conexão DB (lento)
   - ❌ Cold starts (primeira requisição lenta)
   - ❌ Timeout de 10s (plano gratuito)
   - ❌ Upload de arquivos limitado (5MB)
   - ❌ SQLite não funciona (precisa PostgreSQL externo)

---

## 📊 Comparação de Opções

| Aspecto | Railway Full | Railway + Vercel | Vercel Serverless |
|---------|--------------|------------------|-------------------|
| **Complexidade** | ⭐ Baixa | ⭐⭐ Média | ⭐⭐⭐⭐ Alta |
| **Performance** | ⚡⚡ Boa | ⚡⚡⚡ Ótima | ⚡ Regular |
| **Cold Start** | ✅ Não | ✅ Não | ❌ Sim (1-3s) |
| **Timeout** | ✅ Sem limite | ✅ Sem limite | ❌ 10s (free) |
| **Custo (free)** | 500h/mês | Ilimitado | Ilimitado* |
| **Setup Time** | 5 min | 30 min | 2-4 horas |
| **Manutenção** | Fácil | Médio | Complexo |
| **Recomendado?** | ✅ Sim | ✅ Se precisar CDN | ❌ Não |

---

## 🎯 Minha Recomendação Final

### Para Você (AGORA):

**✅ Use Railway (Full-Stack)**

Por quê?
1. Já está pronto e funcionando
2. Express funciona perfeitamente
3. PostgreSQL integrado
4. Zero configuração extra
5. Performance boa para 90% dos casos

### Se Realmente Quer Vercel:

**✅ Use Railway (Backend) + Vercel (Frontend)**

Por quê?
1. Melhor dos dois mundos
2. Frontend ultra-rápido (CDN global)
3. Backend sem limitações
4. Configuração simples (30 min)

### NÃO Recomendo:

**❌ Vercel Serverless (Express adaptado)**

Por quê?
1. Requer refatoração completa
2. Cold starts prejudicam UX
3. Limitações de timeout
4. Complexidade alta
5. Não vale a pena para Express tradicional

---

## 📝 Checklist de Decisão

Escolha Vercel APENAS se:

- [ ] Frontend precisa ser MUITO rápido
- [ ] Vai ter tráfego global (usuários em vários países)
- [ ] CDN é crítico para seu negócio
- [ ] Tem tempo para configurar corretamente
- [ ] Não se importa com duas URLs (frontend + backend)

Caso contrário: **Use Railway!**

---

## 🚀 Próximos Passos

### Se escolher Railway (Full):
```bash
# Já está pronto! ✅
# Continue no Railway
```

### Se escolher Railway + Vercel:
```bash
# Vou criar os arquivos de configuração
# Configurar CORS
# Fazer deploy separado
```

### Se escolher Vercel Serverless:
```bash
# ⚠️  Não recomendado!
# Mas posso criar um guia de migração completo
```

---

## 💡 Dica Final

**Railway** foi feito para aplicações como a sua (Express full-stack).

**Vercel** foi feito para Next.js e frontend moderno.

**Não force** uma ferramenta em um caso de uso não ideal.

Use a ferramenta certa para o trabalho certo! 🎯

---

🎉 **Recomendação: Mantenha no Railway e seja feliz!**

