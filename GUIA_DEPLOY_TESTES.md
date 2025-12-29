# 🚀 Guia para Disponibilizar o Sistema para Testes

## 📋 Índice
1. [Opção 1: Rede Local (LAN)](#opção-1-rede-local-lan) - **Mais Rápido**
2. [Opção 2: Deploy na Nuvem](#opção-2-deploy-na-nuvem) - **Acesso pela Internet**
3. [Opção 3: Servidor Próprio](#opção-3-servidor-próprio)

---

## 🏠 Opção 1: Rede Local (LAN)
**Melhor para:** Testes internos, mesma rede Wi-Fi ou escritório

### Passo 1: Preparar o Sistema no Seu Computador

1. **Compile o projeto:**
```bash
npm run build
```

2. **Inicie o servidor:**
```bash
npm start
```

### Passo 2: Descobrir o IP do Seu Computador

**No Windows (PowerShell):**
```powershell
ipconfig
```
- Procure por "Endereço IPv4" (exemplo: `192.168.1.100`)
- Anote este IP

### Passo 3: Configurar o Firewall

**Windows:**
1. Abra o "Windows Defender Firewall"
2. Clique em "Configurações Avançadas"
3. Clique em "Regras de Entrada"
4. Clique em "Nova Regra..."
5. Selecione "Porta" → Avançar
6. TCP → Portas locais específicas: `3002` → Avançar
7. Permitir a conexão → Avançar
8. Marque todas as opções (Domínio, Privado, Público) → Avançar
9. Nome: "Sistema Gestão Operacional" → Concluir

### Passo 4: Compartilhar o Acesso

Os usuários devem acessar pelo navegador:
```
http://SEU_IP:3002
```

**Exemplo:**
```
http://192.168.1.100:3002
```

### ⚠️ Importante:
- Seu computador deve estar **sempre ligado** enquanto outros testam
- Todos devem estar na **mesma rede** (mesmo Wi-Fi)
- Se mudar de rede, o IP pode mudar

---

## ☁️ Opção 2: Deploy na Nuvem
**Melhor para:** Acesso remoto, qualquer lugar do mundo

### 2A. Railway (Recomendado - Gratuito)

1. **Crie uma conta:** [railway.app](https://railway.app/)

2. **Instale o Railway CLI:**
```powershell
npm install -g @railway/cli
```

3. **Faça login:**
```bash
railway login
```

4. **Inicialize o projeto:**
```bash
railway init
```

5. **Deploy:**
```bash
railway up
```

6. **Configure o domínio:**
```bash
railway domain
```

**Pronto!** O Railway te dará uma URL pública (exemplo: `https://seu-projeto.up.railway.app`)

### 2B. Render (Alternativa Gratuita)

1. **Crie conta:** [render.com](https://render.com/)
2. Conecte seu repositório GitHub
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Clique em "Deploy"

### 2C. Heroku

1. **Crie conta:** [heroku.com](https://heroku.com/)

2. **Instale Heroku CLI:**
```bash
npm install -g heroku
```

3. **Login e deploy:**
```bash
heroku login
heroku create nome-do-seu-app
git push heroku main
```

---

## 🖥️ Opção 3: Servidor Próprio na Rede

### Se sua empresa tem um servidor Windows/Linux:

1. **Copie os arquivos do projeto** para o servidor

2. **Instale Node.js** no servidor (versão 18+)

3. **Configure o serviço:**

**Windows (como serviço):**
```powershell
npm install -g node-windows
```

Crie arquivo `install-service.js`:
```javascript
var Service = require('node-windows').Service;

var svc = new Service({
  name: 'Gestão Operacional',
  description: 'Sistema de Gestão de Viagens',
  script: 'C:\\caminho\\para\\dist\\server.js'
});

svc.on('install', function(){
  svc.start();
});

svc.install();
```

Execute:
```bash
node install-service.js
```

4. **Configure o IP fixo** no servidor
5. **Abra a porta 3002** no firewall
6. Usuários acessam: `http://IP_DO_SERVIDOR:3002`

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3002
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-aqui-muito-forte
DATABASE_PATH=./database.sqlite
```

### Preparar Banco de Dados

Antes de disponibilizar, certifique-se que o banco está configurado:

```bash
npm run setup
```

Isso irá:
- Criar as tabelas
- Criar usuário admin
- Configurar políticas padrão

---

## 📱 Acesso dos Usuários

### Credenciais de Teste

Forneça aos usuários:
- **URL:** (dependendo da opção escolhida)
- **Usuário:** admin (ou o que você criou)
- **Senha:** (a senha definida)

### Orientações para os Testadores

Envie estas instruções:

```
📌 ACESSO AO SISTEMA DE GESTÃO OPERACIONAL

🌐 URL: http://[SEU_IP_OU_DOMINIO]:3002

👤 Credenciais:
   Usuário: admin
   Senha: [SUA_SENHA]

✅ Navegadores suportados:
   - Google Chrome (recomendado)
   - Microsoft Edge
   - Firefox
   - Safari

⚠️ Importante:
   - Este é um ambiente de testes
   - Os dados podem ser resetados
   - Reporte qualquer problema encontrado
```

---

## 🐛 Troubleshooting

### Problema: "Não consigo acessar"

**Verifique:**
1. O servidor está rodando?
2. O firewall está configurado?
3. O IP está correto?
4. Vocês estão na mesma rede? (para LAN)

### Problema: "Página não carrega"

```bash
# Verifique se a porta está em uso
netstat -ano | findstr :3002

# Reinicie o servidor
# Ctrl+C para parar, depois:
npm start
```

### Problema: "Erro de conexão com banco de dados"

```bash
# Recrie o banco
npm run init-db
npm run create-admin
```

---

## 🎯 Recomendação Final

**Para testes rápidos (mesma rede):**
→ Use **Opção 1: Rede Local**

**Para testes remotos (cada um em sua casa):**
→ Use **Opção 2: Railway** (mais fácil e gratuito)

**Para produção/uso contínuo:**
→ Use **Opção 3: Servidor próprio**

---

## 📞 Checklist Antes de Disponibilizar

- [ ] Sistema compilado (`npm run build`)
- [ ] Banco de dados configurado (`npm run setup`)
- [ ] Usuário admin criado
- [ ] Firewall configurado
- [ ] IP/URL anotado
- [ ] Credenciais de teste definidas
- [ ] Instruções enviadas aos testadores
- [ ] Teste de acesso realizado

---

## 🔐 Segurança

**IMPORTANTE para produção:**

1. **Mude o JWT_SECRET** no arquivo `.env`
2. **Crie senhas fortes** para os usuários
3. **Configure HTTPS** (para nuvem, já vem configurado)
4. **Limite acesso** ao banco de dados
5. **Faça backups regulares**

---

## 💡 Dica Extra: Ngrok (Para Testes Rápidos)

Se quiser compartilhar rapidamente sem configurações:

1. **Instale:** [ngrok.com](https://ngrok.com/)
2. **Execute:**
```bash
ngrok http 3002
```
3. **Compartilhe a URL** gerada (exemplo: `https://abc123.ngrok.io`)

⚠️ **Atenção:** A URL muda cada vez que reinicia o ngrok (versão gratuita)

---

🎉 **Pronto! Agora você pode disponibilizar o sistema para testes!**

