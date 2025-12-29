# 📧 Configuração de Email para Solicitação de Pagamento

## 🎯 Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis no arquivo `.env` do seu projeto:

```bash
# ========================================
# CONFIGURAÇÃO DE EMAIL
# ========================================

# Host do servidor SMTP
EMAIL_HOST=smtp.gmail.com

# Porta do servidor SMTP (587 para TLS, 465 para SSL)
EMAIL_PORT=587

# Usuário/Email remetente
EMAIL_USER=seu_email@gmail.com

# Senha do email ou App Password
EMAIL_PASS=sua_senha_ou_app_password

# Email do setor financeiro (quem recebe as solicitações de pagamento)
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

---

## 📝 Configuração por Provedor

### 1️⃣ **Gmail** (Recomendado para testes)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password_aqui
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

**⚠️ IMPORTANTE:** Para Gmail, você precisa gerar um **"App Password"**:

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma senha de app para "Mail"
3. Use essa senha no `EMAIL_PASS` (NÃO use sua senha real do Gmail)

---

### 2️⃣ **Outlook / Hotmail**

```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu_email@outlook.com
EMAIL_PASS=sua_senha
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

---

### 3️⃣ **SendGrid** (Recomendado para produção)

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=sua_api_key_do_sendgrid
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

Como obter a API Key:
1. Crie uma conta em https://sendgrid.com
2. Acesse "Settings" > "API Keys"
3. Crie uma nova API Key
4. Use "apikey" como usuário e a chave gerada como senha

---

### 4️⃣ **Mailgun**

```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@seu-dominio.mailgun.org
EMAIL_PASS=sua_senha_mailgun
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

---

### 5️⃣ **AWS SES** (Amazon Simple Email Service)

```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=suas_credenciais_smtp_aws
EMAIL_PASS=sua_senha_smtp_aws
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

**Nota:** Consulte a documentação da AWS para obter as credenciais SMTP.

---

## 🧪 Modo Desenvolvimento (Sem Email Configurado)

Se você **NÃO configurar as variáveis de email**, o sistema funcionará normalmente mas:

✅ A solicitação de pagamento será processada
✅ O status será atualizado no banco
📧 **O email será apenas LOGADO no console** (não será enviado de verdade)

Isso é útil para:
- Desenvolvimento local
- Testes
- Quando você não tem acesso a um servidor SMTP

**Exemplo de log no console:**

```
📧 ========== EMAIL (Modo Desenvolvimento) ==========
De: noreply@gestaoviagens.com
Para: financeiro@gestaoviagens.com
Assunto: [Pagamento Pendente] Solicitação #123 - João Silva
Conteúdo HTML: <!DOCTYPE html>...
====================================================
```

---

## 🚀 Configuração no Railway (Produção)

### **1. Acesse o Railway Dashboard**
   https://railway.app → Seu Projeto

### **2. Vá em "Variables"**

### **3. Adicione as variáveis:**

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

### **4. Clique em "Deploy"**

---

## 🧪 Como Testar

### **1. Faça login no sistema**

### **2. Crie uma solicitação de viagem**

### **3. Aprove a solicitação**

### **4. Clique no botão "Solicitar Pagamento"**

### **5. Verifique:**
   - ✅ Email recebido no financeiro
   - ✅ Status mudou para "Pagamento Solicitado"
   - ✅ Data da solicitação registrada

---

## ❓ Troubleshooting (Resolução de Problemas)

### **Erro: "Invalid login"**
- ✅ Verifique se o email e senha estão corretos
- ✅ Para Gmail, use App Password (não a senha real)
- ✅ Verifique se o "Acesso a apps menos seguros" está habilitado (Gmail)

### **Erro: "Connection timeout"**
- ✅ Verifique se a porta está correta (587 ou 465)
- ✅ Verifique se o host SMTP está correto
- ✅ Verifique se há firewall bloqueando a conexão

### **Email não chega**
- ✅ Verifique a caixa de SPAM do destinatário
- ✅ Verifique se o `EMAIL_FINANCEIRO` está correto
- ✅ Verifique os logs do Railway/servidor

---

## 📚 Recursos Adicionais

- **Nodemailer (Biblioteca usada):** https://nodemailer.com/
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **SendGrid Docs:** https://docs.sendgrid.com/
- **Mailgun Docs:** https://documentation.mailgun.com/

---

## 🔒 Segurança

⚠️ **NUNCA** commite suas senhas ou API keys no Git!

✅ **SEMPRE** use variáveis de ambiente
✅ Adicione `.env` no `.gitignore`
✅ Use senhas de app específicas (não a senha principal)
✅ Revogue credenciais comprometidas imediatamente

---

**✅ Pronto! Com isso configurado, o sistema enviará emails automáticos para o financeiro sempre que houver uma solicitação de pagamento.**

