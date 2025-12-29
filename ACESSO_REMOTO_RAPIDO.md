# 🌐 Acesso Remoto Rápido - Ngrok

## ⚡ Setup em 2 Minutos

### Passo 1: Baixar Ngrok

**Windows:**
1. Acesse: https://ngrok.com/download
2. Baixe o executável
3. Extraia para uma pasta (ex: `C:\ngrok`)

**Ou via Chocolatey:**
```powershell
choco install ngrok
```

**Ou via Scoop:**
```powershell
scoop install ngrok
```

---

### Passo 2: Cadastro Rápido (Opcional mas recomendado)

1. Crie conta gratuita: https://dashboard.ngrok.com/signup
2. Copie seu token de autenticação
3. Configure:
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

---

### Passo 3: Iniciar o Sistema

**Terminal 1 - Inicie seu servidor:**
```bash
cd "C:\Users\user\Documents\gestao operacional\Gest-o-operacional"
npm start
```

Aguarde a mensagem:
```
🚀 Servidor rodando na porta 3002
```

---

### Passo 4: Iniciar o Ngrok

**Terminal 2 - Inicie o Ngrok:**
```bash
ngrok http 3002
```

**Você verá algo assim:**
```
ngrok

Session Status: online
Account: seu-email (Plan: Free)
Region: South America (sa)
Latency: 45ms
Web Interface: http://127.0.0.1:4040
Forwarding: https://abc-123-xyz.ngrok-free.app -> http://localhost:3002

Connections  ttl  opn  rt1  rt5  p50  p90
             0    0    0.00 0.00 0.00 0.00
```

---

### Passo 5: Acessar de Qualquer Rede

**Copie a URL do "Forwarding":**
```
https://abc-123-xyz.ngrok-free.app
```

**Acesse no navegador:**
- Do seu celular (4G/5G)
- De outro computador em outra rede
- De qualquer lugar do mundo!

---

## 🎉 Pronto!

Agora você pode:
- ✅ Acessar de qualquer rede
- ✅ Testar no celular (4G/5G)
- ✅ Compartilhar com outros testadores
- ✅ Fazer demonstrações remotas

---

## 📱 Compartilhando com Outros

Envie essa mensagem aos testadores:

```
🌐 Sistema de Gestão Operacional

🔗 URL: https://abc-123-xyz.ngrok-free.app

👤 Usuário: admin
🔑 Senha: [SUA_SENHA]

✅ Acesse de qualquer navegador
✅ Funciona em celular também!

⚠️ Esta URL é temporária e expira quando o servidor for desligado
```

---

## 🔍 Monitoramento

**Interface Web do Ngrok:**
- Acesse: http://127.0.0.1:4040
- Veja todas as requisições em tempo real
- Debug de erros
- Estatísticas de uso

---

## ⚠️ Limitações da Versão Gratuita

- ❌ URL muda quando reinicia o ngrok
- ⚠️ Limite de 40 conexões/minuto
- ⚠️ Sessão expira após 2 horas (renovável)
- ⚠️ Pode aparecer aviso "ngrok warning" no navegador

**Versão Paga (opcional):**
- ✅ URL fixa (seu-dominio.ngrok.app)
- ✅ Sem limites de conexão
- ✅ Sem expiração
- ✅ Sem avisos
- 💰 A partir de $8/mês

---

## 🆘 Problemas Comuns

### "Comando ngrok não encontrado"

**Solução:** Adicione o ngrok ao PATH ou use o caminho completo:
```bash
C:\ngrok\ngrok.exe http 3002
```

### "Túnel não conecta"

**Solução:**
1. Verifique se o servidor está rodando (localhost:3002)
2. Teste localmente primeiro
3. Verifique seu firewall
4. Tente trocar a região:
```bash
ngrok http 3002 --region sa  # South America
ngrok http 3002 --region us  # United States
```

### "Aviso de segurança no navegador"

**É normal!** O ngrok mostra um aviso na primeira vez.
- Clique em "Visit Site" ou "Continuar"
- Isso acontece porque o ngrok funciona como proxy

### "Conexão muito lenta"

**Soluções:**
1. Escolha região mais próxima
2. Verifique sua internet
3. Em produção, use Railway/Render

---

## 📊 Comparação: Ngrok vs Railway

| Aspecto | Ngrok | Railway |
|---------|-------|---------|
| Setup | 2 minutos | 10 minutos |
| URL Fixa | ❌ Não (gratuito) | ✅ Sim |
| Seu PC ligado | ✅ Necessário | ❌ Não precisa |
| Expiração | 2 horas (renovável) | Ilimitado |
| Custo | Gratuito | Gratuito* |

---

## 💡 Quando Usar Cada Um

### Use Ngrok para:
- ✅ Testes rápidos
- ✅ Demonstrações
- ✅ Desenvolvimento
- ✅ Compartilhar com 1-3 pessoas

### Use Railway para:
- ✅ Testes mais longos (dias/semanas)
- ✅ Múltiplos testadores
- ✅ Quando seu PC precisa desligar
- ✅ Ambiente mais profissional

---

## 🚀 Próximo Passo: Railway

Se você gostou do acesso remoto e quer algo permanente:

```bash
# Instale o Railway
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
railway domain

# Pronto! URL permanente
```

Guia completo: `INICIO_RAPIDO_TESTES.md`

---

## ✅ Checklist

Antes de compartilhar com testadores:

- [ ] Servidor local rodando (npm start)
- [ ] Ngrok rodando (ngrok http 3002)
- [ ] URL do ngrok copiada
- [ ] Testou a URL no navegador
- [ ] Testou login com credenciais
- [ ] Compartilhou URL com testadores

---

## 📞 Comandos Úteis

**Ver status do ngrok:**
- Interface web: http://127.0.0.1:4040

**Parar o ngrok:**
- Pressione `Ctrl+C` no terminal do ngrok

**Reiniciar (nova URL):**
```bash
ngrok http 3002
```

**Usar mesma URL (conta paga):**
```bash
ngrok http 3002 --domain=seu-dominio-fixo.ngrok.app
```

---

🎉 **Pronto! Agora você pode acessar de qualquer rede!**

---

_Dica: Mantenha os dois terminais abertos enquanto estiver testando_

