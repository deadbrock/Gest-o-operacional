import { Router } from 'express';
import { ColaboradorController } from '../controllers/ColaboradorController';
import { SolicitacaoViagemController } from '../controllers/SolicitacaoViagemController';
import { HospedagemController } from '../controllers/HospedagemController';
import { PassagemController } from '../controllers/PassagemController';
import { DespesaRDVController } from '../controllers/DespesaRDVController';
import { SolicitacaoAlimentacaoController } from '../controllers/SolicitacaoAlimentacaoController';
import { RelatorioController } from '../controllers/RelatorioController';
import { AuthController } from '../controllers/AuthController';
import { DocumentController, upload } from '../controllers/DocumentController';
import { PolicyController } from '../controllers/PolicyController';
import { DashboardExecutivoController } from '../controllers/DashboardExecutivoController';
import { authenticate, isAdmin, isGestorOrAbove, isFinanceiroOrAbove } from '../middleware/auth';

const router = Router();

// Controllers
const colaboradorController = new ColaboradorController();
const solicitacaoViagemController = new SolicitacaoViagemController();
const hospedagemController = new HospedagemController();
const passagemController = new PassagemController();
const despesaRDVController = new DespesaRDVController();
const solicitacaoAlimentacaoController = new SolicitacaoAlimentacaoController();
const relatorioController = new RelatorioController();
const authController = new AuthController();
const documentController = new DocumentController();
const policyController = new PolicyController();
const dashboardExecutivoController = new DashboardExecutivoController();

// Rotas de Colaboradores
router.get('/colaboradores', colaboradorController.listar);
router.get('/colaboradores/departamentos', colaboradorController.departamentos);
router.get('/colaboradores/:id', colaboradorController.buscarPorId);
router.post('/colaboradores', colaboradorController.criar);
router.put('/colaboradores/:id', colaboradorController.atualizar);
router.delete('/colaboradores/:id', colaboradorController.deletar);

// Rotas de Solicitações de Viagem
router.get('/solicitacoes', solicitacaoViagemController.listar);
router.get('/solicitacoes/:id', solicitacaoViagemController.buscarPorId);
router.post('/solicitacoes', solicitacaoViagemController.criar);
router.put('/solicitacoes/:id', solicitacaoViagemController.atualizar);
router.delete('/solicitacoes/:id', solicitacaoViagemController.deletar);
router.post('/solicitacoes/:id/aprovar', solicitacaoViagemController.aprovar);
router.post('/solicitacoes/:id/rejeitar', solicitacaoViagemController.rejeitar);
router.get('/solicitacoes/:id/custo-total', solicitacaoViagemController.calcularCustoTotal);

// Rotas de Hospedagens
router.get('/hospedagens', hospedagemController.listar);
router.get('/hospedagens/:id', hospedagemController.buscarPorId);
router.post('/hospedagens', hospedagemController.criar);
router.put('/hospedagens/:id', hospedagemController.atualizar);
router.delete('/hospedagens/:id', hospedagemController.deletar);

// Rotas de Passagens
router.get('/passagens', passagemController.listar);
router.get('/passagens/:id', passagemController.buscarPorId);
router.post('/passagens', passagemController.criar);
router.put('/passagens/:id', passagemController.atualizar);
router.delete('/passagens/:id', passagemController.deletar);

// Rotas de Despesas RDV
router.get('/despesas-rdv', despesaRDVController.listar);
router.get('/despesas-rdv/:id', despesaRDVController.buscarPorId);
router.post('/despesas-rdv', despesaRDVController.criar);
router.put('/despesas-rdv/:id', despesaRDVController.atualizar);
router.delete('/despesas-rdv/:id', despesaRDVController.deletar);
router.post('/despesas-rdv/:id/aprovar', despesaRDVController.aprovar);
router.post('/despesas-rdv/:id/rejeitar', despesaRDVController.rejeitar);

// Rotas de Solicitações de Alimentação
router.get('/solicitacoes-alimentacao', solicitacaoAlimentacaoController.listar);
router.get('/solicitacoes-alimentacao/:id', solicitacaoAlimentacaoController.buscarPorId);
router.post('/solicitacoes-alimentacao', solicitacaoAlimentacaoController.criar);
router.put('/solicitacoes-alimentacao/:id', solicitacaoAlimentacaoController.atualizar);
router.delete('/solicitacoes-alimentacao/:id', solicitacaoAlimentacaoController.deletar);
router.post('/solicitacoes-alimentacao/:id/aprovar', solicitacaoAlimentacaoController.aprovar);
router.post('/solicitacoes-alimentacao/:id/rejeitar', solicitacaoAlimentacaoController.rejeitar);
router.post('/solicitacoes-alimentacao/:id/pagar', solicitacaoAlimentacaoController.marcarComoPaga);
router.post('/solicitacoes-alimentacao/calcular', solicitacaoAlimentacaoController.calcularAutomatico);
router.get('/solicitacoes-alimentacao/relatorio/resumo', solicitacaoAlimentacaoController.relatorio);

// Rotas de Relatórios
router.get('/relatorios/dashboard', relatorioController.dashboard);
router.get('/relatorios/custos-detalhados', relatorioController.custosDetalhados);

// ============================================
// ROTAS DE AUTENTICAÇÃO (Públicas)
// ============================================
router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/register', authController.register.bind(authController));

// ============================================
// ROTAS PROTEGIDAS (Requerem autenticação)
// ============================================

// Rotas de Usuário (Autenticado)
router.get('/auth/me', authenticate, authController.me.bind(authController));
router.post('/auth/change-password', authenticate, authController.changePassword.bind(authController));

// Rotas de Gestão de Usuários (Admin)
router.get('/users', authenticate, isAdmin, authController.list.bind(authController));
router.put('/users/:id', authenticate, isAdmin, authController.update.bind(authController));
router.delete('/users/:id', authenticate, isAdmin, authController.delete.bind(authController));

// ============================================
// ROTAS DE DOCUMENTOS
// ============================================
router.post('/documents/upload', authenticate, upload.single('file'), documentController.uploadDocument.bind(documentController));
router.get('/documents', authenticate, documentController.list.bind(documentController));
router.get('/documents/stats', authenticate, isGestorOrAbove, documentController.stats.bind(documentController));
router.get('/documents/:id', authenticate, documentController.getById.bind(documentController));
router.get('/documents/:id/download', authenticate, documentController.download.bind(documentController));
router.put('/documents/:id', authenticate, documentController.update.bind(documentController));
router.delete('/documents/:id', authenticate, documentController.delete.bind(documentController));

// ============================================
// ROTAS DE POLÍTICAS
// ============================================
router.post('/policies', authenticate, isAdmin, policyController.create.bind(policyController));
router.get('/policies', authenticate, policyController.list.bind(policyController));
router.get('/policies/applicable', authenticate, policyController.getApplicablePolicy.bind(policyController));
router.post('/policies/validate', authenticate, policyController.validateValue.bind(policyController));
router.get('/policies/compliance', authenticate, isGestorOrAbove, policyController.complianceStats.bind(policyController));
router.get('/policies/:id', authenticate, policyController.getById.bind(policyController));
router.put('/policies/:id', authenticate, isAdmin, policyController.update.bind(policyController));
router.delete('/policies/:id', authenticate, isAdmin, policyController.delete.bind(policyController));

// ============================================
// DASHBOARD EXECUTIVO
// ============================================
router.get('/dashboard/kpis', authenticate, isGestorOrAbove, dashboardExecutivoController.getKPIs.bind(dashboardExecutivoController));
router.get('/dashboard/tendencias', authenticate, isGestorOrAbove, dashboardExecutivoController.getTendencias.bind(dashboardExecutivoController));
router.get('/dashboard/departamentos', authenticate, isGestorOrAbove, dashboardExecutivoController.getComparativoDepartamentos.bind(dashboardExecutivoController));
router.get('/dashboard/destinos', authenticate, dashboardExecutivoController.getTopDestinos.bind(dashboardExecutivoController));
router.get('/dashboard/sazonalidade', authenticate, isGestorOrAbove, dashboardExecutivoController.getAnalyseSazonalidade.bind(dashboardExecutivoController));
router.get('/dashboard/projecao', authenticate, isGestorOrAbove, dashboardExecutivoController.getProjecaoGastos.bind(dashboardExecutivoController));
router.get('/dashboard/economia', authenticate, isGestorOrAbove, dashboardExecutivoController.getAnaliseEconomia.bind(dashboardExecutivoController));
router.get('/dashboard/ranking-colaboradores', authenticate, isGestorOrAbove, dashboardExecutivoController.getRankingColaboradores.bind(dashboardExecutivoController));
router.get('/dashboard/consolidado', authenticate, isGestorOrAbove, dashboardExecutivoController.getDashboardConsolidado.bind(dashboardExecutivoController));

// Rota de Status (Pública)
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'API de Gestão de Viagens Corporativas',
    version: '2.0.0',
    features: [
      'Autenticação JWT',
      'Upload de Documentos',
      'Políticas de Limites',
      'Dashboard Executivo Avançado',
    ],
    timestamp: new Date().toISOString(),
  });
});

export default router;

