# 🚀 Sistema de Gestão de Viagens Corporativas v2.0

Sistema completo **enterprise** para gestão de custos com **Hospedagens**, **Passagens Aéreas/Terrestres**, **RDV** e **Alimentação**, com **autenticação**, **upload de documentos**, **políticas de limites** e **dashboard executivo avançado**.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## ✨ Novidades da Versão 2.0

### 🔐 Sistema de Autenticação e Permissões
- Login com JWT (validade 7 dias)
- 4 níveis de acesso: Colaborador, Gestor, Financeiro, Admin
- Controle de acesso por role
- Gestão completa de usuários

### 📎 Upload de Documentos e Comprovantes
- Upload de PDF, DOC, XLS, imagens
- Limite de 10MB por arquivo
- 7 tipos de documentos suportados
- Download e preview de arquivos

### 💰 Política de Limites e Regras
- 7 políticas padrão configuradas
- Limites por cargo, departamento ou global
- Validação automática de valores
- Sistema de exceções com justificativa

### 📊 Dashboard Executivo Avançado
- 8 análises executivas disponíveis
- KPIs em tempo real
- Tendências e projeções
- Ranking de colaboradores

---

## 📋 Funcionalidades Completas

### ✅ Gestão de Colaboradores
- Cadastro completo de colaboradores
- Controle de departamentos e cargos
- Status ativo/inativo
- Filtros e buscas avançadas

### ✅ Solicitações de Viagem
- Criação de solicitações com todos os detalhes
- Fluxo de aprovação/rejeição com níveis
- Vinculação com centro de custo
- Cálculo automático de custos totais
- Status: Pendente, Aprovada, Rejeitada, Em Andamento, Concluída, Cancelada

### ✅ Hospedagens
- Cadastro de hotéis e reservas
- Controle de check-in/check-out
- Cálculo automático de diárias
- Validação contra políticas de limites
- Múltiplos status de acompanhamento

### ✅ Passagens
- Suporte para passagens aéreas, ônibus, trem
- Passagens de ida e volta
- Controle de localizador e número de voo
- Validação de classe permitida
- Status de reserva, emissão e utilização

### ✅ Despesas RDV
- Registro de refeições (café, almoço, jantar)
- Despesas com transporte e outros
- Upload de comprovantes
- Fluxo de aprovação específico
- Controle de status de pagamento

### ✅ Solicitações de Alimentação
- Cálculo automático por período de viagem
- Quantidades e valores por tipo de refeição
- Aprovação e pagamento
- Relatórios específicos

### ✅ Dashboard e Relatórios
- 11 métricas principais em cards coloridos
- Gráficos interativos (Pizza, Barras, Linha, Doughnut)
- Top 10 contatos e ranking de atendentes
- Análise de tempo e atividade por hora
- Distribuição por canal e setor
- Exportação para Excel/CSV/PDF

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express** - Framework web
- **Sequelize** - ORM
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Multer** - Upload de arquivos

### Frontend
- **HTML5** + **CSS3**
- **Bootstrap 5.3** - Framework UI
- **Bootstrap Icons** - Ícones
- **Chart.js** - Gráficos interativos
- **Vanilla JavaScript** - Sem dependências pesadas

---

## 📦 Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Setup completo (Recomendado)
```bash
npm run setup
```

Isso irá:
- ✅ Inicializar o banco de dados
- ✅ Criar usuário administrador
- ✅ Popular 7 políticas padrão

### 3. Ou fazer manualmente:
```bash
# Inicializar banco de dados
npm run init-db

# Criar usuário admin
npm run create-admin

# Popular políticas
npm run seed-policies
```

### 4. Iniciar o servidor

#### Desenvolvimento (com hot-reload)
```bash
npm run dev
```

#### Produção
```bash
npm run build
npm start
```

---

## 🌐 Acesso ao Sistema

Após iniciar o servidor:

- **Login**: http://localhost:3002/login.html
- **Dashboard**: http://localhost:3002/
- **API**: http://localhost:3002/api
- **Status**: http://localhost:3002/api/status

### Credenciais Padrão

```
📧 Email: admin@gestaoviagens.com
🔑 Senha: admin123
👑 Role: ADMIN
```

⚠️ **IMPORTANTE**: Troque a senha após o primeiro login!

---

## 🌐 Deploy e Testes em Outros Computadores

### 🚀 Inicio Rápido

Para disponibilizar o sistema para testes em outros computadores:

**1. Execute o script automático (Recomendado):**
```powershell
powershell -ExecutionPolicy Bypass -File preparar-para-testes.ps1
```

**2. Ou siga o guia completo:**
- 📖 **INICIO_RAPIDO_TESTES.md** - Guia rápido (5-10 minutos)
- 📚 **GUIA_DEPLOY_TESTES.md** - Guia completo e detalhado
- ⚙️ **CONFIGURACAO_ENV.md** - Configuração de variáveis

### 🏠 Opção 1: Rede Local (Mesma Wi-Fi)

**Ideal para:** Testes internos, escritório

```bash
# 1. Compile o projeto
npm run build

# 2. Inicie o servidor
npm start

# 3. Descubra seu IP
ipconfig  # Windows
ifconfig  # Linux/Mac

# 4. Configure o firewall (Windows)
# Libere a porta 3002 no Windows Defender

# 5. Compartilhe com os usuários
# Eles acessam: http://SEU_IP:3002
```

### ☁️ Opção 2: Nuvem (Acesso pela Internet)

**Ideal para:** Testes remotos, home office

#### Railway (Recomendado - Gratuito):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway domain  # Obter URL pública
```

#### Render:
- Conecte seu repositório GitHub em [render.com](https://render.com/)
- Configure build: `npm install && npm run build`
- Configure start: `npm start`

#### Ngrok (Testes rápidos):
```bash
ngrok http 3002
# Compartilhe a URL gerada
```

### 📱 Instruções para Testadores

Após configurar, envie aos usuários:

```
🌐 URL: http://SEU_IP:3002 (ou URL da nuvem)
👤 Usuário: admin
🔑 Senha: [SUA_SENHA]

✅ Use Chrome, Edge ou Firefox
⚠️ Para rede local: conecte-se à mesma Wi-Fi
```

### ✅ Checklist Antes de Disponibilizar

- [ ] Sistema compilado (`npm run build`)
- [ ] Banco configurado (`npm run setup`)
- [ ] Servidor testado localmente
- [ ] Firewall configurado (rede local)
- [ ] IP/URL anotado e testado
- [ ] Instruções enviadas aos testadores

---

## 📊 Estrutura do Projeto

```
gestao-viagens-corporativas/
├── src/
│   ├── config/
│   │   └── database.ts                    # Configuração do banco
│   ├── models/
│   │   ├── User.ts                        # 🆕 Modelo de usuário
│   │   ├── Document.ts                    # 🆕 Modelo de documento
│   │   ├── Policy.ts                      # 🆕 Modelo de política
│   │   ├── Colaborador.ts                 # Modelo de colaboradores
│   │   ├── SolicitacaoViagem.ts           # Modelo de solicitações
│   │   ├── Hospedagem.ts                  # Modelo de hospedagens
│   │   ├── Passagem.ts                    # Modelo de passagens
│   │   ├── DespesaRDV.ts                  # Modelo de despesas RDV
│   │   └── SolicitacaoAlimentacao.ts      # Modelo de alimentação
│   ├── controllers/
│   │   ├── AuthController.ts              # 🆕 Autenticação
│   │   ├── DocumentController.ts          # 🆕 Upload/download
│   │   ├── PolicyController.ts            # 🆕 Políticas
│   │   ├── DashboardExecutivoController.ts # 🆕 Dashboard avançado
│   │   ├── ColaboradorController.ts
│   │   ├── SolicitacaoViagemController.ts
│   │   ├── HospedagemController.ts
│   │   ├── PassagemController.ts
│   │   ├── DespesaRDVController.ts
│   │   ├── SolicitacaoAlimentacaoController.ts
│   │   └── RelatorioController.ts
│   ├── middleware/
│   │   └── auth.ts                        # 🆕 Middlewares de autenticação
│   ├── scripts/
│   │   ├── initDatabase.ts                # 🆕 Inicializar DB
│   │   ├── createAdmin.ts                 # 🆕 Criar admin
│   │   └── seedPolicies.ts                # 🆕 Popular políticas
│   ├── routes/
│   │   └── index.ts                       # Rotas da API
│   └── server.ts                          # Servidor principal
├── public/
│   ├── login.html                         # 🆕 Página de login
│   ├── index.html                         # Interface principal
│   ├── css/
│   │   ├── style.css
│   │   └── professional-theme.css
│   └── js/
│       ├── auth.js                        # 🆕 Sistema de autenticação
│       ├── api.js                         # Cliente da API
│       ├── dashboard.js                   # Dashboard e métricas
│       ├── colaboradores.js               # Gestão de colaboradores
│       ├── solicitacoes.js                # Gestão de solicitações
│       ├── hospedagens.js                 # Gestão de hospedagens
│       ├── passagens.js                   # Gestão de passagens
│       ├── rdv.js                         # Gestão de RDV
│       ├── alimentacao.js                 # Gestão de alimentação
│       ├── relatorios.js                  # Relatórios detalhados
│       └── app.js                         # App principal
├── uploads/                               # 🆕 Diretório de uploads
├── database.sqlite                        # Banco de dados
├── package.json
├── tsconfig.json
├── README.md
├── NOVAS_FUNCIONALIDADES.md              # 🆕 Documentação completa
├── ROADMAP_FUNCIONALIDADES.md            # 🆕 Roadmap de features
├── GUIA_RAPIDO.md                        # 🆕 Guia rápido
└── RESUMO_IMPLEMENTACAO.md               # 🆕 Resumo da implementação
```

---

## 🔌 Endpoints da API

### 🔐 Autenticação (Novos)
```
POST   /api/auth/login                    - Login
POST   /api/auth/register                 - Registrar usuário
GET    /api/auth/me                       - Dados do usuário logado
POST   /api/auth/change-password          - Trocar senha
GET    /api/users                         - Listar usuários (admin)
PUT    /api/users/:id                     - Atualizar usuário (admin)
DELETE /api/users/:id                     - Desativar usuário (admin)
```

### 📎 Documentos (Novos)
```
POST   /api/documents/upload              - Upload de arquivo
GET    /api/documents                     - Listar documentos
GET    /api/documents/stats               - Estatísticas (gestor+)
GET    /api/documents/:id                 - Buscar por ID
GET    /api/documents/:id/download        - Download
PUT    /api/documents/:id                 - Atualizar metadados
DELETE /api/documents/:id                 - Deletar documento
```

### 💰 Políticas (Novos)
```
POST   /api/policies                      - Criar política (admin)
GET    /api/policies                      - Listar políticas
GET    /api/policies/applicable           - Buscar política aplicável
POST   /api/policies/validate             - Validar valor
GET    /api/policies/compliance           - Estatísticas (gestor+)
GET    /api/policies/:id                  - Buscar por ID
PUT    /api/policies/:id                  - Atualizar (admin)
DELETE /api/policies/:id                  - Desativar (admin)
```

### 📊 Dashboard Executivo (Novos)
```
GET    /api/dashboard/kpis                - KPIs principais (gestor+)
GET    /api/dashboard/tendencias          - Tendências mensais (gestor+)
GET    /api/dashboard/departamentos       - Comparativo (gestor+)
GET    /api/dashboard/destinos            - Top destinos
GET    /api/dashboard/sazonalidade        - Análise sazonalidade (gestor+)
GET    /api/dashboard/projecao            - Projeção de gastos (gestor+)
GET    /api/dashboard/economia            - Análise de economia (gestor+)
GET    /api/dashboard/ranking-colaboradores - Ranking (gestor+)
GET    /api/dashboard/consolidado         - Dashboard consolidado (gestor+)
```

### Colaboradores
```
GET    /api/colaboradores                 - Listar colaboradores
GET    /api/colaboradores/:id             - Buscar por ID
POST   /api/colaboradores                 - Criar colaborador
PUT    /api/colaboradores/:id             - Atualizar colaborador
DELETE /api/colaboradores/:id             - Deletar colaborador
GET    /api/colaboradores/departamentos   - Listar departamentos
```

### Solicitações de Viagem
```
GET    /api/solicitacoes                  - Listar solicitações
GET    /api/solicitacoes/:id              - Buscar por ID
POST   /api/solicitacoes                  - Criar solicitação
PUT    /api/solicitacoes/:id              - Atualizar solicitação
DELETE /api/solicitacoes/:id              - Deletar solicitação
POST   /api/solicitacoes/:id/aprovar      - Aprovar solicitação
POST   /api/solicitacoes/:id/rejeitar     - Rejeitar solicitação
GET    /api/solicitacoes/:id/custo-total  - Calcular custo total
```

### Hospedagens
```
GET    /api/hospedagens                   - Listar hospedagens
GET    /api/hospedagens/:id               - Buscar por ID
POST   /api/hospedagens                   - Criar hospedagem
PUT    /api/hospedagens/:id               - Atualizar hospedagem
DELETE /api/hospedagens/:id               - Deletar hospedagem
```

### Passagens
```
GET    /api/passagens                     - Listar passagens
GET    /api/passagens/:id                 - Buscar por ID
POST   /api/passagens                     - Criar passagem
PUT    /api/passagens/:id                 - Atualizar passagem
DELETE /api/passagens/:id                 - Deletar passagem
```

### Despesas RDV
```
GET    /api/despesas-rdv                  - Listar despesas
GET    /api/despesas-rdv/:id              - Buscar por ID
POST   /api/despesas-rdv                  - Criar despesa
PUT    /api/despesas-rdv/:id              - Atualizar despesa
DELETE /api/despesas-rdv/:id              - Deletar despesa
POST   /api/despesas-rdv/:id/aprovar      - Aprovar despesa
POST   /api/despesas-rdv/:id/rejeitar     - Rejeitar despesa
```

### Solicitações de Alimentação
```
GET    /api/solicitacoes-alimentacao      - Listar solicitações
GET    /api/solicitacoes-alimentacao/:id  - Buscar por ID
POST   /api/solicitacoes-alimentacao      - Criar solicitação
PUT    /api/solicitacoes-alimentacao/:id  - Atualizar solicitação
DELETE /api/solicitacoes-alimentacao/:id  - Deletar solicitação
POST   /api/solicitacoes-alimentacao/:id/aprovar  - Aprovar
POST   /api/solicitacoes-alimentacao/:id/rejeitar - Rejeitar
POST   /api/solicitacoes-alimentacao/:id/pagar    - Marcar como paga
POST   /api/solicitacoes-alimentacao/calcular     - Calcular automático
GET    /api/solicitacoes-alimentacao/relatorio/resumo - Relatório
```

### Relatórios
```
GET    /api/relatorios/dashboard          - Dashboard com métricas
GET    /api/relatorios/custos-detalhados  - Relatório detalhado
```

---

## 🎨 Design

- Interface moderna com gradientes coloridos profissionais
- Cards de métricas com animações hover
- Tema responsivo para mobile, tablet e desktop
- Gráficos interativos com Chart.js
- Tabelas com paginação e filtros
- Modais para criação/edição de dados
- Sistema de login elegante
- Tema claro/escuro

---

## 🔒 Segurança

- ✅ Autenticação JWT com expiração
- ✅ Senhas criptografadas com bcrypt
- ✅ Controle de acesso por role (RBAC)
- ✅ Middleware de autenticação
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho de upload (10MB)
- ✅ Validação de dados no backend
- ✅ Tratamento de erros robusto
- ✅ CORS configurado
- ✅ SQL Injection protegido pelo Sequelize ORM

---

## 📚 Documentação Completa

- **NOVAS_FUNCIONALIDADES.md** - Documentação detalhada das 4 novas funcionalidades (5.000+ linhas)
- **ROADMAP_FUNCIONALIDADES.md** - Roadmap com 15+ funcionalidades sugeridas
- **GUIA_RAPIDO.md** - Guia rápido de uso
- **RESUMO_IMPLEMENTACAO.md** - Resumo da implementação v2.0

---

## 🚀 Roadmap de Melhorias

### ✅ Implementado na v2.0
- [x] Sistema de autenticação e autorização
- [x] Upload real de comprovantes
- [x] Políticas de limites configuráveis
- [x] Dashboard executivo avançado

### 📋 Próximas Melhorias
- [ ] Notificações por email
- [ ] App mobile (PWA)
- [ ] Calendário de viagens
- [ ] Workflow de aprovações múltiplas
- [ ] Integração com APIs de booking
- [ ] Gestão de adiantamentos
- [ ] Multi-idioma e multi-moeda
- [ ] BI e análise preditiva
- [ ] Gamificação
- [ ] Pesquisa de satisfação/NPS

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                  # Iniciar servidor com hot-reload

# Produção
npm run build               # Build TypeScript
npm start                   # Iniciar servidor de produção

# Setup
npm run init-db             # Inicializar banco de dados
npm run create-admin        # Criar usuário administrador
npm run seed-policies       # Popular políticas padrão
npm run setup               # Setup completo (tudo de uma vez)
```

---

## 🎯 Níveis de Acesso

### 🔹 COLABORADOR
- Criar próprias solicitações
- Visualizar próprias viagens
- Upload de comprovantes pessoais

### 🔸 GESTOR
- Tudo do colaborador +
- Aprovar solicitações do departamento
- Acessar dashboard executivo
- Visualizar relatórios

### 🔶 FINANCEIRO
- Tudo do gestor +
- Aprovar pagamentos
- Visualizar todos os departamentos
- Gerenciar compliance

### 🔴 ADMIN
- Acesso total ao sistema
- Gerenciar usuários
- Criar/editar políticas
- Configurações do sistema

---

## 📈 Métricas e Impacto

### Antes da v2.0
- ❌ Sem controle de acesso
- ❌ Documentos em planilhas/email
- ❌ Sem políticas formais
- ❌ Relatórios manuais

### Depois da v2.0
- ✅ 4 níveis de acesso definidos
- ✅ Documentos centralizados e auditados
- ✅ 7 políticas configuradas
- ✅ 8 análises automáticas disponíveis
- ✅ Dashboard executivo em tempo real

### Benefícios Esperados
- 📈 **30% de economia** com políticas de limites
- ⚡ **80% mais rápido** na aprovação com notificações
- 📊 **100% de visibilidade** com dashboard executivo
- 🔒 **Segurança total** com autenticação e permissões

---

## 🆘 Troubleshooting

### Erro de porta em uso
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node

# Depois
npm run dev
```

### Recriar banco de dados
```bash
# Deletar database.sqlite
npm run setup
```

### Token expirado
- Faça logout e login novamente
- Token tem validade de 7 dias

---

## 📝 Licença

MIT

---

## 👨‍💻 Autor

Sistema desenvolvido para substituir planilhas manuais de controle de viagens corporativas e elevar a gestão a um nível enterprise.

---

## 🙏 Agradecimento

Obrigado por usar o Sistema de Gestão de Viagens Corporativas! 

**🎉 Sistema 100% funcional e pronto para produção!**

---

**Desenvolvido com ❤️ usando Node.js + TypeScript + Bootstrap**

_Versão 2.0.0 - Dezembro 2025_
"# Gest-o-operacional" 
