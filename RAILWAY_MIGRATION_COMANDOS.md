# 🚀 Comandos para Executar no Railway

## ⚠️ **PROBLEMA: Colunas de Pagamento Não Existem**

O erro ocorre porque as novas colunas (`statusPagamento`, `dataSolicitacaoPagamento`, etc.) não existem no PostgreSQL do Railway.

---

## 🔧 **SOLUÇÃO: Executar Migration**

### **Opção 1: Via Railway CLI (RECOMENDADO)**

1. Acesse o terminal do Railway:
   ```bash
   railway run bash
   ```

2. Execute o script de migration:
   ```bash
   npm run add-pagamento-colunas
   ```

3. Reinicie o serviço:
   ```bash
   railway restart
   ```

---

### **Opção 2: Via Railway Dashboard**

1. Acesse: https://railway.app → Seu Projeto
2. Clique em **"Deploy"** → **"View Logs"**
3. No canto superior direito, clique nos **3 pontinhos** → **"Open Shell"**
4. Execute:
   ```bash
   npm run add-pagamento-colunas
   ```

---

### **Opção 3: SQL Direto no PostgreSQL**

Se você tem acesso ao PostgreSQL:

1. No Railway Dashboard, vá em **PostgreSQL** → **"Connect"**
2. Copie a conexão ou use o **"pgAdmin"**
3. Execute o SQL:

```sql
ALTER TABLE solicitacoes_viagem 
ADD COLUMN IF NOT EXISTS "statusPagamento" VARCHAR(20) DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS "dataSolicitacaoPagamento" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "dataPagamento" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "metodoPagamento" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "observacoesPagamento" TEXT;
```

---

### **Opção 4: Recriar Banco (⚠️ PERDE DADOS)**

Se o banco está vazio ou em teste:

```bash
npm run setup
```

**⚠️ ATENÇÃO:** Isso irá **RECRIAR TODAS AS TABELAS** e você perderá todos os dados!

---

## ✅ **Verificar se Funcionou**

Após executar a migration, teste:

1. Recarregue o sistema: https://gestaooperacional-mocha.vercel.app
2. Vá em **"Solicitações de Viagem"**
3. Verifique se:
   - ✅ Lista carrega sem erros
   - ✅ Badge de pagamento aparece
   - ✅ Botão "Solicitar Pagamento" está visível

---

## 🐛 **Logs para Verificar**

No Railway, verifique os logs:

**Se funcionar, você verá:**
```
✅ Coluna statusPagamento adicionada
✅ Coluna dataSolicitacaoPagamento adicionada
✅ Coluna dataPagamento adicionada
✅ Coluna metodoPagamento adicionada
✅ Coluna observacoesPagamento adicionada
🎉 Colunas de pagamento adicionadas com sucesso!
```

**Se houver erro:**
```
❌ Erro ao adicionar colunas: [descrição do erro]
```

---

## 📞 **Precisa de Ajuda?**

Se o erro persistir, me envie:
1. Logs do Railway
2. Screenshot do erro
3. Confirmação de que executou o comando

---

**Boa sorte! 🚀**

