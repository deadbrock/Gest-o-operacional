# 💰 Guia: Solicitação de Pagamento ao Financeiro

## 📋 Visão Geral

Sistema implementado para automatizar o envio de solicitações de pagamento ao setor financeiro quando uma viagem é aprovada.

---

## 🎯 Funcionalidades Implementadas

### ✅ **Backend**
1. **Campos no Banco de Dados:**
   - `statusPagamento`: `'pendente'` | `'solicitado'` | `'pago'`
   - `dataSolicitacaoPagamento`: Data da solicitação
   - `dataPagamento`: Data do pagamento efetivo
   - `metodoPagamento`: PIX, TED, Cheque, etc.
   - `observacoesPagamento`: Observações do financeiro

2. **Serviço de Email (EmailService):**
   - Envia emails HTML formatados
   - Suporta múltiplos provedores SMTP
   - Modo desenvolvimento (loga no console)
   - Template profissional com detalhamento de custos

3. **Rota API:**
   - `POST /api/solicitacoes/:id/solicitar-pagamento`
   - Valida se solicitação está aprovada
   - Impede envios duplicados
   - Envia email automaticamente

### ✅ **Frontend**
1. **Badge de Status de Pagamento:**
   - 🟢 Pendente (cinza)
   - 🟡 Solicitado (amarelo)
   - 🟢 Pago (verde)

2. **Botão "Solicitar Pagamento":**
   - Aparece apenas em solicitações aprovadas
   - Desaparece após envio
   - Confirmação antes de enviar

3. **Feedback ao Usuário:**
   - Mensagem de sucesso
   - Alerta se email não foi configurado
   - Tratamento de erros

---

## 🚀 Como Usar

### **1. Criar e Aprovar Solicitação**

1. Acesse o sistema: https://gestaooperacional-mocha.vercel.app
2. Login: `admin@gestaoviagens.com` / `admin123`
3. Vá em **"Solicitações de Viagem"**
4. Clique em **"Nova Solicitação"**
5. Preencha os dados da viagem
6. **Aprove a solicitação**

### **2. Solicitar Pagamento**

1. Na lista de solicitações, localize a viagem aprovada
2. Veja o badge: **"💰 Pendente"**
3. Clique no botão: **"💵 Pagamento"**
4. Confirme o envio
5. ✅ Email enviado ao financeiro!
6. Badge muda para: **"💰 Solicitado"**

---

## 📧 Exemplo de Email Enviado

```
De: noreply@gestaoviagens.com
Para: financeiro@suaempresa.com
Assunto: [Pagamento Pendente] Solicitação #123 - João Silva

╔═══════════════════════════════════╗
║  💰 Nova Solicitação de Pagamento  ║
╚═══════════════════════════════════╝

Solicitação #123

👤 Colaborador: João Silva
🏢 Departamento: Vendas
📍 Destino: São Paulo - SP
📅 Período: 15/01/2025 até 20/01/2025
💵 Valor Total: R$ 2.500,00

📋 Detalhamento dos Custos:

🏨 Hospedagens:
• Hotel Ibis - 5 diária(s) - R$ 800,00

✈️ Passagens:
• Belo Horizonte → São Paulo - R$ 1.200,00

🍽️ Alimentação/Despesas:
• Alimentação (5 dias) - R$ 500,00

[🔗 Ver Detalhes no Sistema]

⚠️ Atenção: Esta solicitação já foi aprovada
pelo gestor e está aguardando processamento
do pagamento.
```

---

## 🔧 Configuração (Railway)

### **1. Adicione as Variáveis de Ambiente**

Acesse Railway Dashboard → Seu Projeto → **Variables**:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password_aqui
EMAIL_FINANCEIRO=financeiro@suaempresa.com
```

### **2. Para Gmail - Gere App Password:**

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Mail" 
3. Copie a senha gerada
4. Use essa senha no `EMAIL_PASS`

### **3. Deploy Automático**

O Railway fará redeploy automático ao detectar as variáveis.

**Consulte `CONFIGURACAO_EMAIL.md` para mais detalhes!**

---

## 🧪 Modo Desenvolvimento (Sem Email)

Se você **NÃO configurar as variáveis de email**:

✅ Sistema funciona normalmente
✅ Status é atualizado
✅ Botões aparecem corretamente
📧 **Email é apenas LOGADO no console**

**Exemplo de log:**

```
📧 ========== EMAIL (Modo Desenvolvimento) ==========
De: noreply@gestaoviagens.com
Para: financeiro@gestaoviagens.com
Assunto: [Pagamento Pendente] Solicitação #123
====================================================
```

---

## 📊 Status de Pagamento

| Status      | Cor     | Significado                                    |
|-------------|---------|------------------------------------------------|
| **Pendente** | Cinza   | Aguardando solicitação de pagamento            |
| **Solicitado** | Amarelo | Email enviado, aguardando processamento        |
| **Pago**    | Verde   | Pagamento processado pelo financeiro           |

---

## 🎯 Próximas Evoluções (Opção 3)

Planejadas para implementação futura:

### **1. Portal do Financeiro**
- Dashboard específico para o setor financeiro
- Listagem de solicitações pendentes
- Botão "Marcar como Pago"
- Upload de comprovante de pagamento

### **2. Adiantamento vs. Reembolso**
- Pagamento antes da viagem (adiantamento)
- Pagamento após viagem (reembolso)
- Prestação de contas
- Cálculo de diferenças

### **3. Notificações Inteligentes**
- Email ao colaborador quando pago
- Lembrete de anexar notas fiscais
- Alerta de pagamentos atrasados
- Notificação de diferenças a acertar

### **4. Múltiplos Aprovadores**
- Fluxo: Gestor → Diretor → Financeiro
- Aprovação hierárquica
- Histórico de aprovações

---

## ❓ FAQ

### **P: O email não chegou. O que fazer?**
**R:** Verifique:
1. Caixa de SPAM
2. Email do financeiro está correto no `.env`
3. Configuração SMTP está correta
4. Logs do Railway para erros

### **P: Posso mudar o email do financeiro?**
**R:** Sim! Altere a variável `EMAIL_FINANCEIRO` no Railway.

### **P: Como testar sem enviar email de verdade?**
**R:** Não configure as variáveis de email. O sistema logará no console.

### **P: Posso usar outro provedor de email?**
**R:** Sim! Consulte `CONFIGURACAO_EMAIL.md` para Outlook, SendGrid, Mailgun, etc.

### **P: O que fazer se a solicitação foi enviada por engano?**
**R:** Atualmente não há função de cancelar envio. Contate o financeiro diretamente. (Função de cancelamento será implementada na Opção 3).

---

## 🐛 Troubleshooting

### **Erro: "Apenas solicitações aprovadas podem ter pagamento solicitado"**
- ✅ Aprove a solicitação primeiro
- ✅ Status deve ser "Aprovada" ou "Em Andamento"

### **Erro: "Pagamento já foi solicitado para esta solicitação"**
- ✅ Pagamento já foi enviado antes
- ✅ Verifique o badge (deve estar "Solicitado")

### **Erro: "Invalid login" (SMTP)**
- ✅ Gmail: Use App Password, não a senha real
- ✅ Verifique usuário e senha no `.env`

### **Erro: "Connection timeout"**
- ✅ Verifique porta (587 ou 465)
- ✅ Verifique host SMTP
- ✅ Firewall pode estar bloqueando

---

## 📝 Changelog

### **v1.0 - Implementação Inicial** (29/12/2024)
- ✅ Sistema de solicitação de pagamento
- ✅ Envio de email automatizado
- ✅ Badge de status de pagamento
- ✅ Botão "Solicitar Pagamento"
- ✅ Template de email profissional
- ✅ Modo desenvolvimento sem SMTP
- ✅ Documentação completa

---

## 🎉 Pronto!

O sistema está funcionando e pronto para uso!

**Para dúvidas, consulte:**
- `CONFIGURACAO_EMAIL.md` - Configuração de email
- Logs do Railway - Erros e debugs
- Console do navegador (F12) - Erros frontend

**Bom uso! 🚀**

