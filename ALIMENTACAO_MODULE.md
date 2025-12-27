# 🍽️ Módulo de Solicitações de Alimentação

## Visão Geral

O módulo de **Solicitações de Alimentação** permite que colaboradores solicitem adiantamento ou reembolso de despesas com alimentação durante viagens corporativas.

## ✨ Funcionalidades

### 1. Solicitação Inteligente
- ✅ Cálculo automático baseado na duração da viagem
- ✅ Vinculação com solicitações de viagem aprovadas
- ✅ Preenchimento automático de datas e colaborador
- ✅ Sugestão de quantidades de refeições

### 2. Tipos de Refeições Suportadas
- ☕ **Café da Manhã** - Valor padrão: R$ 25,00
- 🍽️ **Almoço** - Valor padrão: R$ 45,00
- 🌙 **Jantar** - Valor padrão: R$ 45,00
- 🥐 **Lanche/Outros** - Valor padrão: R$ 15,00

### 3. Fluxo de Aprovação
1. **Criação** - Colaborador cria solicitação (Status: Pendente)
2. **Aprovação/Rejeição** - Gestor analisa (Status: Aprovada/Rejeitada)
3. **Pagamento** - Financeiro registra pagamento (Status: Paga)

### 4. Formas de Pagamento
- **Adiantamento** - Pagamento antecipado antes da viagem
- **Reembolso** - Reembolso após apresentação de comprovantes
- **Cartão Corporativo** - Uso de cartão da empresa

## 📊 Cálculo Automático

O sistema calcula automaticamente:
- **Número de dias** da viagem
- **Quantidade sugerida** de cada refeição
- **Valores totais** por tipo de refeição
- **Valor total** da solicitação

### Exemplo de Cálculo

```
Viagem: 3 dias (01/02 até 03/02)

Café da Manhã:
- Quantidade: 3 × R$ 25,00 = R$ 75,00

Almoço:
- Quantidade: 3 × R$ 45,00 = R$ 135,00

Jantar:
- Quantidade: 3 × R$ 45,00 = R$ 135,00

Lanche:
- Quantidade: 1 × R$ 15,00 = R$ 15,00

TOTAL: R$ 360,00
```

## 🎯 Status da Solicitação

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| **Pendente** | Aguardando aprovação | Editar, Aprovar, Rejeitar |
| **Aprovada** | Aprovada pelo gestor | Marcar como Paga |
| **Rejeitada** | Rejeitada pelo gestor | Visualizar apenas |
| **Paga** | Pagamento efetuado | Visualizar apenas |
| **Cancelada** | Cancelada pelo solicitante | Visualizar apenas |

## 🔌 Endpoints da API

### Listar Solicitações
```http
GET /api/solicitacoes-alimentacao
GET /api/solicitacoes-alimentacao?status=pendente
GET /api/solicitacoes-alimentacao?colaboradorId=1
```

### Buscar por ID
```http
GET /api/solicitacoes-alimentacao/:id
```

### Criar Solicitação
```http
POST /api/solicitacoes-alimentacao
Content-Type: application/json

{
  "solicitacaoViagemId": 1,
  "colaboradorId": 1,
  "dataInicio": "2024-02-01",
  "dataFim": "2024-02-03",
  "numeroDias": 3,
  "qtdCafeManha": 3,
  "qtdAlmoco": 3,
  "qtdJantar": 3,
  "qtdLanche": 1,
  "valorCafeManha": 25.00,
  "valorAlmoco": 45.00,
  "valorJantar": 45.00,
  "valorLanche": 15.00,
  "justificativa": "Viagem para reunião com cliente",
  "formaPagamento": "adiantamento"
}
```

### Atualizar Solicitação
```http
PUT /api/solicitacoes-alimentacao/:id
Content-Type: application/json

{
  "qtdCafeManha": 2,
  "observacoes": "Atualizado após revisão"
}
```

### Aprovar Solicitação
```http
POST /api/solicitacoes-alimentacao/:id/aprovar
Content-Type: application/json

{
  "aprovadoPor": "João Silva",
  "observacoes": "Aprovado conforme política de viagens"
}
```

### Rejeitar Solicitação
```http
POST /api/solicitacoes-alimentacao/:id/rejeitar
Content-Type: application/json

{
  "observacoes": "Valores acima da política permitida"
}
```

### Marcar como Paga
```http
POST /api/solicitacoes-alimentacao/:id/pagar
Content-Type: application/json

{
  "formaPagamento": "adiantamento",
  "comprovantePagamento": "https://..."
}
```

### Calcular Valores Automaticamente
```http
POST /api/solicitacoes-alimentacao/calcular
Content-Type: application/json

{
  "solicitacaoViagemId": 1
}
```

**Resposta:**
```json
{
  "dataInicio": "2024-02-01",
  "dataFim": "2024-02-03",
  "numeroDias": 3,
  "qtdCafeManha": 3,
  "qtdAlmoco": 3,
  "qtdJantar": 3,
  "qtdLanche": 1,
  "valorCafeManha": 25.00,
  "valorAlmoco": 45.00,
  "valorJantar": 45.00,
  "valorLanche": 15.00,
  "totalCafeManha": 75.00,
  "totalAlmoco": 135.00,
  "totalJantar": 135.00,
  "totalLanche": 15.00,
  "valorTotal": 360.00
}
```

### Relatório Resumido
```http
GET /api/solicitacoes-alimentacao/relatorio/resumo
GET /api/solicitacoes-alimentacao/relatorio/resumo?status=aprovada
GET /api/solicitacoes-alimentacao/relatorio/resumo?dataInicio=2024-01-01&dataFim=2024-12-31
```

**Resposta:**
```json
{
  "totais": {
    "quantidade": 15,
    "totalCafeManha": 1125.00,
    "totalAlmoco": 2025.00,
    "totalJantar": 2025.00,
    "totalLanche": 225.00,
    "valorTotal": 5400.00
  },
  "porStatus": {
    "pendente": { "quantidade": 3, "valor": 1080.00 },
    "aprovada": { "quantidade": 8, "valor": 2880.00 },
    "paga": { "quantidade": 4, "valor": 1440.00 }
  },
  "solicitacoes": 15
}
```

## 💡 Regras de Negócio

### 1. Criação de Solicitação
- ✅ Apenas viagens **aprovadas** podem ter solicitações de alimentação
- ✅ Colaborador é preenchido automaticamente da viagem
- ✅ Datas devem corresponder ao período da viagem
- ✅ Valores são personalizáveis por solicitação

### 2. Aprovação
- ✅ Apenas solicitações **pendentes** podem ser aprovadas/rejeitadas
- ✅ Necessário informar o nome do aprovador
- ✅ Observações são opcionais

### 3. Pagamento
- ✅ Apenas solicitações **aprovadas** podem ser pagas
- ✅ Necessário informar forma de pagamento
- ✅ Comprovante é opcional

### 4. Cálculos
- ✅ Totais são calculados automaticamente via hook do Sequelize
- ✅ Fórmula: `quantidade × valor_unitário`
- ✅ Valor total = soma de todos os tipos de refeição

## 📱 Interface do Usuário

### Dashboard de Estatísticas
```
┌─────────────────────────────────────────────────────┐
│  Pendentes     Aprovadas     Pagas     Total Geral  │
│     3           8             4         R$ 5.400,00  │
│  R$ 1.080,00  R$ 2.880,00  R$ 1.440,00             │
└─────────────────────────────────────────────────────┘
```

### Tabela de Solicitações
- **Filtros**: Status, Colaborador, Período
- **Colunas**: ID, Colaborador, Viagem, Período, Dias, Refeições, Valor, Status, Ações
- **Ações**: Visualizar, Editar, Aprovar, Rejeitar, Pagar

### Formulário de Criação
1. **Seleção de Viagem** - Dropdown com viagens aprovadas
2. **Cálculo Automático** - Preenche automaticamente:
   - Colaborador
   - Datas (início e fim)
   - Número de dias
   - Quantidades sugeridas
3. **Customização** - Ajuste de:
   - Quantidade de cada refeição
   - Valores unitários
   - Justificativa
   - Forma de pagamento
4. **Preview de Totais** - Visualização em tempo real dos valores

## 🎨 Elementos Visuais

### Ícones por Tipo de Refeição
- ☕ Café da Manhã
- 🍽️ Almoço
- 🌙 Jantar
- 🥐 Lanche

### Cores por Status
- 🟡 **Pendente** - Amarelo (warning)
- 🟢 **Aprovada** - Verde (success)
- 🔴 **Rejeitada** - Vermelho (danger)
- 🔵 **Paga** - Azul (primary)
- ⚫ **Cancelada** - Cinza (secondary)

## 🔐 Permissões (Futuro)

| Ação | Colaborador | Gestor | Financeiro | Admin |
|------|-------------|--------|------------|-------|
| Criar | ✅ | ✅ | ❌ | ✅ |
| Visualizar | ✅ (próprias) | ✅ (setor) | ✅ (todas) | ✅ |
| Editar | ✅ (pendentes) | ✅ | ❌ | ✅ |
| Aprovar | ❌ | ✅ | ❌ | ✅ |
| Rejeitar | ❌ | ✅ | ❌ | ✅ |
| Pagar | ❌ | ❌ | ✅ | ✅ |
| Cancelar | ✅ (próprias) | ✅ | ❌ | ✅ |

## 📊 Integração com Outros Módulos

### Solicitações de Viagem
- Alimentação vinculada a viagens aprovadas
- Herda dados da viagem (colaborador, datas, destino)

### Relatórios
- Total de despesas de alimentação por período
- Ranking de colaboradores por consumo
- Análise por departamento
- Comparativo mensal/anual

### Dashboard
- Card com valor total de alimentação
- Solicitações pendentes de aprovação
- Alertas de valores acima da política

## 🚀 Próximas Melhorias

- [ ] Política de limites por cargo/departamento
- [ ] Upload de comprovantes de despesas
- [ ] Notificações por email de aprovação/rejeição
- [ ] Relatório de economia com cartão corporativo
- [ ] Integração com sistema de pagamento
- [ ] App mobile para solicitação em campo
- [ ] QR Code para consulta rápida
- [ ] Histórico de alterações
- [ ] Comentários e discussões
- [ ] Workflow de múltiplas aprovações

---

**✅ Módulo 100% funcional e integrado ao sistema!**

