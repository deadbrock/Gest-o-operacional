# 🚀 Guia Rápido - Sistema de Gestão de Viagens v2.0

## ⚡ Início Rápido

### 1. Acessar o Sistema

```
🌐 Login: http://localhost:3002/login.html
📊 Dashboard: http://localhost:3002/
🔌 API: http://localhost:3002/api
```

### 2. Credenciais de Acesso

```
📧 Email: admin@gestaoviagens.com
🔑 Senha: admin123
👑 Role: Administrador
```

---

## 🎯 O Que Foi Implementado

### ✅ 1. Sistema de Autenticação e Permissões
- Login com JWT
- 4 níveis de acesso (Colaborador, Gestor, Financeiro, Admin)
- Controle de acesso por role
- Sessão persistente

### ✅ 2. Upload de Documentos
- Upload de PDF, DOC, XLS, imagens
- Limite de 10MB por arquivo
- Associação com viagens, hospedagens, passagens, despesas
- Download e preview

### ✅ 3. Política de Limites
- 7 políticas padrão criadas
- Limites por cargo, departamento ou global
- Validação automática de valores
- Sistema de exceções com justificativa

### ✅ 4. Dashboard Executivo
- 8 análises avançadas disponíveis
- KPIs em tempo real
- Tendências mensais e sazonalidade
- Projeção de gastos
- Ranking de colaboradores

---

## 📖 Endpoints Principais da API

### Autenticação
```
POST   /api/auth/login              - Login
POST   /api/auth/register           - Registrar
GET    /api/auth/me                 - Usuário logado
POST   /api/auth/change-password    - Trocar senha
```

### Documentos
```
POST   /api/documents/upload        - Upload (multipart/form-data)
GET    /api/documents               - Listar
GET    /api/documents/:id/download  - Download
DELETE /api/documents/:id           - Deletar
```

### Políticas
```
GET    /api/policies                - Listar políticas
POST   /api/policies/validate       - Validar valor
GET    /api/policies/applicable     - Buscar aplicável
```

### Dashboard Executivo
```
GET    /api/dashboard/kpis          - KPIs principais
GET    /api/dashboard/tendencias    - Tendências mensais
GET    /api/dashboard/departamentos - Comparativo
GET    /api/dashboard/projecao      - Projeção de gastos
GET    /api/dashboard/consolidado   - Tudo em uma requisição
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                  # Iniciar servidor

# Setup
npm run init-db             # Inicializar banco de dados
npm run create-admin        # Criar usuário admin
npm run seed-policies       # Popular políticas
npm run setup               # Tudo de uma vez

# Produção
npm run build               # Build
npm start                   # Start produção
```

---

## 💡 Exemplos de Uso

### Login via API
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@gestaoviagens.com',
    senha: 'admin123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);
```

### Upload de Documento
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('entityType', 'solicitacao_viagem');
formData.append('entityId', '123');
formData.append('tipo', 'comprovante_hospedagem');

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Validar Valor Contra Política
```javascript
const response = await fetch('/api/policies/validate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tipo: 'hospedagem',
    valor: 450.00,
    colaboradorId: 123,
    cargo: 'Gerente',
    context: 'diaria'
  })
});

const result = await response.json();
// { valid: false, message: '...', requiresJustification: true }
```

### Buscar KPIs
```javascript
const response = await fetch('/api/dashboard/kpis', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const kpis = await response.json();
// { totalViagens, custoTotal, custoMedio, ... }
```

---

## 📊 Políticas Padrão Criadas

1. **Global - Hospedagem**: R$ 300/diária, 4 estrelas
2. **Global - Passagem Aérea**: R$ 1.500, classe econômica
3. **Global - Alimentação**: R$ 80/refeição
4. **Diretoria - Hospedagem**: R$ 600/diária, 5 estrelas
5. **Diretoria - Passagem**: R$ 3.000, classe executiva
6. **Gerentes - Hospedagem**: R$ 400/diária, 4 estrelas
7. **Global - Transporte**: R$ 100/dia

---

## 🎨 Níveis de Acesso

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
- Acesso total
- Gerenciar usuários
- Criar/editar políticas
- Configurações do sistema

---

## 📁 Estrutura de Arquivos

```
uploads/                    # Documentos uploadados
database.sqlite             # Banco de dados SQLite
src/
  ├── models/               # User, Document, Policy, ...
  ├── controllers/          # Auth, Document, Policy, Dashboard
  ├── middleware/           # Autenticação e autorização
  ├── routes/               # Rotas da API
  └── scripts/              # Scripts de setup
public/
  ├── login.html            # Página de login
  ├── index.html            # Dashboard principal
  └── js/
      ├── auth.js           # Sistema de autenticação
      └── ...               # Outros módulos
```

---

## ⚡ Próximos Passos Recomendados

### Imediatos
1. ✅ Trocar senha padrão do admin
2. ✅ Criar usuários para colaboradores
3. ✅ Testar upload de documentos
4. ✅ Revisar políticas padrão

### Curto Prazo
1. 📧 Sistema de notificações por email
2. 📱 App mobile (PWA)
3. 🗓️ Calendário de viagens
4. 🔄 Workflow de aprovações múltiplas

### Médio Prazo
1. 🤖 Integração com APIs de booking
2. 💳 Gestão de adiantamentos
3. 🌍 Multi-idioma e multi-moeda
4. 🔗 Integração com ERP/RH

---

## 🆘 Troubleshooting

### Erro de porta em uso
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Recriar banco de dados
```bash
# Deletar database.sqlite e rodar
npm run setup
```

### Token expirado
- Faça logout e login novamente
- Token tem validade de 7 dias

### Upload falha
- Verifique tamanho (máx 10MB)
- Verifique tipo de arquivo permitido
- Confirme que está autenticado

---

## 📞 Suporte

### Documentação Completa
- `NOVAS_FUNCIONALIDADES.md` - Documentação detalhada
- `ROADMAP_FUNCIONALIDADES.md` - Roadmap de features
- `README.md` - Visão geral do projeto

### Status da API
```
http://localhost:3002/api/status
```

---

## ✨ Recursos Destacados

🔐 **Segurança**: JWT + bcrypt + controle de acesso  
📎 **Documentos**: Upload com 7 tipos suportados  
💰 **Controle**: 7 políticas configuráveis  
📊 **Insights**: 8 análises executivas  
🎨 **Design**: Interface profissional e responsiva  
🚀 **Performance**: API otimizada e escalável  

---

**🎉 Sistema 100% funcional e pronto para uso em produção!**

_Versão 2.0.0 - Dezembro 2025_

