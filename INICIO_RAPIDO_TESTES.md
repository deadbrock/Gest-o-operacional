# ⚡ Início Rápido - Disponibilizar para Testes

## 🎯 Opção Mais Simples: Rede Local (5 minutos)

### 1️⃣ Execute o Script Automático

Abra o PowerShell como **Administrador** e execute:

```powershell
powershell -ExecutionPolicy Bypass -File preparar-para-testes.ps1
```

**O script irá:**
- ✅ Compilar o projeto
- ✅ Configurar o banco de dados
- ✅ Configurar o firewall
- ✅ Mostrar seu IP
- ✅ Gerar instruções para os usuários

### 2️⃣ Inicie o Servidor

```bash
npm start
```

### 3️⃣ Compartilhe o Acesso

Envie aos usuários:
- **URL:** `http://SEU_IP:3002` (o script mostra seu IP)
- **Arquivo:** `INSTRUCOES_PARA_USUARIOS.txt`

---

## 🌐 Opção Internet: Railway (10 minutos)

### Passo a Passo:

1. **Crie conta gratuita:** https://railway.app/

2. **Instale o CLI:**
```bash
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

5. **Faça o deploy:**
```bash
railway up
```

6. **Pegue o domínio público:**
```bash
railway domain
```

✅ **Pronto!** Agora você tem uma URL pública tipo: `https://seu-app.up.railway.app`

---

## 🚀 Comandos Úteis

### Verificar se está rodando:
```bash
# Abrir no navegador:
start http://localhost:3002
```

### Parar o servidor:
```
Ctrl + C
```

### Reiniciar banco de dados:
```bash
npm run setup
```

### Ver logs em tempo real:
```bash
npm start
```

---

## 📱 Testadores Precisam:

### Hardware Mínimo:
- Computador/Notebook
- Navegador moderno (Chrome, Edge, Firefox)
- Conexão à internet/rede

### Para Rede Local:
- Estar na **mesma rede Wi-Fi** que você
- Seu computador deve estar **ligado**

### Para Railway (nuvem):
- Apenas internet
- Seu computador pode estar desligado

---

## ✅ Checklist Rápido

Antes de chamar os testadores:

- [ ] Servidor compilado e rodando
- [ ] Acessou `http://localhost:3002` com sucesso
- [ ] Fez login com usuário admin
- [ ] Firewall configurado (para rede local)
- [ ] IP anotado (para rede local)
- [ ] URL pública funcionando (para nuvem)
- [ ] Instruções enviadas aos testadores

---

## 🐛 Problemas Comuns

### "Não consigo acessar"

**Solução:**
```bash
# 1. Verifique se o servidor está rodando
# Deve aparecer "Servidor rodando na porta 3002"

# 2. Teste localmente primeiro
start http://localhost:3002

# 3. Verifique o firewall (Windows)
# Windows Defender > Firewall > Permitir app
```

### "Erro de compilação"

**Solução:**
```bash
# Reinstale as dependências
npm install
npm run build
```

### "Banco de dados com erro"

**Solução:**
```bash
# Recrie o banco
del database.sqlite
npm run setup
```

---

## 💡 Dica de Ouro

### Para testes rápidos SEM configuração:

Use o **ngrok** (túnel temporário):

1. **Baixe:** https://ngrok.com/download
2. **Execute:**
```bash
ngrok http 3002
```
3. **Compartilhe a URL** gerada

⚠️ **Atenção:** URL expira quando fechar o ngrok

---

## 📞 Contato com os Testadores

### Mensagem Modelo:

```
Olá! 👋

Preciso que teste nosso novo sistema de Gestão Operacional.

🌐 Acesso: http://[SEU_IP]:3002
👤 Usuário: admin
🔑 Senha: [SENHA]

✅ Use Chrome ou Edge
⚠️ Conecte-se à rede [NOME_DA_REDE]

Por favor, teste:
- Login
- Cadastro de solicitações
- Aprovações
- Relatórios

Reporte qualquer problema!

Obrigado! 🙏
```

---

## 🎓 Próximos Passos

Após os testes iniciais:

1. **Colete feedback** dos usuários
2. **Corrija bugs** encontrados
3. **Ajuste funcionalidades**
4. **Planeje o deploy definitivo**

### Para Produção Final:

- Configure domínio próprio
- Ative HTTPS
- Configure backup automático
- Documente procedimentos
- Treine usuários finais

---

## ❓ Precisa de Ajuda?

Consulte o guia completo: `GUIA_DEPLOY_TESTES.md`

---

🎉 **Boa sorte com os testes!**

