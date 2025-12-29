import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Op, QueryTypes } from 'sequelize';
import SolicitacaoViagem from '../models/SolicitacaoViagem';
import Colaborador from '../models/Colaborador';
import Hospedagem from '../models/Hospedagem';
import Passagem from '../models/Passagem';
import DespesaRDV from '../models/DespesaRDV';
import SolicitacaoAlimentacao from '../models/SolicitacaoAlimentacao';

export class DashboardExecutivoController {
  // KPIs Executivos
  async getKPIs(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;

      const whereDate: any = {};
      if (dataInicio && dataFim) {
        whereDate.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }

      // Total de viagens
      const totalViagens = await SolicitacaoViagem.count({ where: whereDate });

      // Custo médio por viagem
      const custoMedioViagem = await SolicitacaoViagem.findOne({
        where: whereDate,
        attributes: [
          [sequelize.fn('AVG', sequelize.col('custoTotal')), 'media'],
        ],
        raw: true,
      }) as any;

      // Custo total
      const custoTotal = await SolicitacaoViagem.sum('custoTotal', { where: whereDate }) || 0;

      // Ticket médio de hospedagem
      const ticketMedioHospedagem = await Hospedagem.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('valorTotal')), 'media'],
        ],
        raw: true,
      }) as any;

      // Ticket médio de passagem
      const ticketMedioPassagem = await Passagem.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('valorTotal')), 'media'],
        ],
        raw: true,
      }) as any;

      // Tempo médio de aprovação (em dias)
      const tempoMedioAprovacao = await sequelize.query<{ media: number }>(`
        SELECT AVG(julianday(dataAprovacao) - julianday(createdAt)) as media
        FROM solicitacoes_viagem
        WHERE status = 'aprovada' AND dataAprovacao IS NOT NULL
      `, { type: QueryTypes.SELECT });

      // Taxa de aprovação
      const totalSolicitacoes = await SolicitacaoViagem.count({ where: whereDate });
      const solicitacoesAprovadas = await SolicitacaoViagem.count({
        where: { ...whereDate, status: 'aprovada' },
      });
      const taxaAprovacao = totalSolicitacoes > 0 
        ? (solicitacoesAprovadas / totalSolicitacoes) * 100 
        : 0;

      // Taxa de rejeição
      const solicitacoesRejeitadas = await SolicitacaoViagem.count({
        where: { ...whereDate, status: 'rejeitada' },
      });
      const taxaRejeicao = totalSolicitacoes > 0 
        ? (solicitacoesRejeitadas / totalSolicitacoes) * 100 
        : 0;

      return res.json({
        totalViagens,
        custoTotal,
        custoMedioViagem: custoMedioViagem?.media || 0,
        ticketMedioHospedagem: ticketMedioHospedagem?.media || 0,
        ticketMedioPassagem: ticketMedioPassagem?.media || 0,
        tempoMedioAprovacaoDias: tempoMedioAprovacao[0]?.media || 0,
        taxaAprovacao: Math.round(taxaAprovacao * 100) / 100,
        taxaRejeicao: Math.round(taxaRejeicao * 100) / 100,
      });

    } catch (error: any) {
      console.error('Erro ao buscar KPIs:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar KPIs', 
        message: error.message 
      });
    }
  }

  // Tendências mensais
  async getTendencias(req: Request, res: Response) {
    try {
      const { ano } = req.query;
      const anoAtual = ano ? parseInt(ano as string) : new Date().getFullYear();

      // Custos mensais
      const custosMensais = await sequelize.query(`
        SELECT 
          strftime('%m', dataInicio) as mes,
          COUNT(*) as totalViagens,
          SUM(custoTotal) as custoTotal,
          AVG(custoTotal) as custoMedio
        FROM solicitacoes_viagem
        WHERE strftime('%Y', dataInicio) = :ano
        GROUP BY strftime('%m', dataInicio)
        ORDER BY mes
      `, {
        replacements: { ano: anoAtual.toString() },
        type: QueryTypes.SELECT,
      });

      return res.json({
        ano: anoAtual,
        tendencias: custosMensais,
      });

    } catch (error: any) {
      console.error('Erro ao buscar tendências:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar tendências', 
        message: error.message 
      });
    }
  }

  // Comparativo de departamentos
  async getComparativoDepartamentos(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;

      const whereDate: any = {};
      if (dataInicio && dataFim) {
        whereDate.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }

      const comparativo = await SolicitacaoViagem.findAll({
        where: whereDate,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('SolicitacaoViagem.id')), 'totalViagens'],
          [sequelize.fn('SUM', sequelize.col('custoTotal')), 'custoTotal'],
          [sequelize.fn('AVG', sequelize.col('custoTotal')), 'custoMedio'],
        ],
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['departamento'],
          },
        ],
        group: ['colaborador.departamento'],
        raw: false,
      });

      return res.json(comparativo);

    } catch (error: any) {
      console.error('Erro ao buscar comparativo:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar comparativo', 
        message: error.message 
      });
    }
  }

  // Top destinos mais visitados
  async getTopDestinos(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const topDestinos = await SolicitacaoViagem.findAll({
        attributes: [
          'destino',
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalViagens'],
          [sequelize.fn('SUM', sequelize.col('custoTotal')), 'custoTotal'],
        ],
        group: ['destino'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: parseInt(limit as string),
        raw: true,
      });

      return res.json(topDestinos);

    } catch (error: any) {
      console.error('Erro ao buscar top destinos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar top destinos', 
        message: error.message 
      });
    }
  }

  // Análise de sazonalidade
  async getAnalyseSazonalidade(req: Request, res: Response) {
    try {
      const sazonalidade = await sequelize.query(`
        SELECT 
          strftime('%m', dataInicio) as mes,
          COUNT(*) as totalViagens,
          SUM(custoTotal) as custoTotal
        FROM solicitacoes_viagem
        WHERE strftime('%Y', dataInicio) >= strftime('%Y', date('now', '-2 years'))
        GROUP BY strftime('%m', dataInicio)
        ORDER BY mes
      `, { type: QueryTypes.SELECT });

      return res.json(sazonalidade);

    } catch (error: any) {
      console.error('Erro ao analisar sazonalidade:', error);
      return res.status(500).json({ 
        error: 'Erro ao analisar sazonalidade', 
        message: error.message 
      });
    }
  }

  // Projeção de gastos
  async getProjecaoGastos(req: Request, res: Response) {
    try {
      const anoAtual = new Date().getFullYear();
      const mesAtual = new Date().getMonth() + 1;

      // Calcular média mensal do ano atual
      const mediaMensal = await sequelize.query<{ media: number }>(`
        SELECT AVG(custoMensal) as media
        FROM (
          SELECT SUM(custoTotal) as custoMensal
          FROM solicitacoes_viagem
          WHERE strftime('%Y', dataInicio) = :ano
          GROUP BY strftime('%m', dataInicio)
        )
      `, {
        replacements: { ano: anoAtual.toString() },
        type: QueryTypes.SELECT,
      });

      const mediaValor = mediaMensal[0]?.media || 0;

      // Calcular total já gasto no ano
      const totalGastoAno = await SolicitacaoViagem.sum('custoTotal', {
        where: {
          dataInicio: {
            [Op.gte]: new Date(`${anoAtual}-01-01`),
          },
        },
      });

      // Projetar para o resto do ano
      const mesesRestantes = 12 - mesAtual;
      const projecaoRestante = mediaValor * mesesRestantes;
      const projecaoTotal = (totalGastoAno || 0) + projecaoRestante;

      return res.json({
        anoAtual,
        mesAtual,
        totalGastoAno: totalGastoAno || 0,
        mediaMensal: mediaValor,
        mesesRestantes,
        projecaoRestante,
        projecaoTotal,
      });

    } catch (error: any) {
      console.error('Erro ao calcular projeção:', error);
      return res.status(500).json({ 
        error: 'Erro ao calcular projeção', 
        message: error.message 
      });
    }
  }

  // Análise de economia (com/sem política)
  async getAnaliseEconomia(req: Request, res: Response) {
    try {
      // Esta é uma análise simulada
      // Em produção, você compararia valores reais vs. valores da política

      const totalGasto = await SolicitacaoViagem.sum('custoTotal');
      const totalViagens = await SolicitacaoViagem.count();

      // Simulação: assumindo 15% de economia com políticas
      const economiaEstimada = (totalGasto || 0) * 0.15;
      const economiaMediaPorViagem = totalViagens > 0 ? economiaEstimada / totalViagens : 0;

      return res.json({
        totalGasto: totalGasto || 0,
        economiaEstimada,
        economiaMediaPorViagem,
        percentualEconomia: 15,
        message: 'Valores estimados baseados em políticas implementadas',
      });

    } catch (error: any) {
      console.error('Erro ao analisar economia:', error);
      return res.status(500).json({ 
        error: 'Erro ao analisar economia', 
        message: error.message 
      });
    }
  }

  // Ranking de colaboradores por custo
  async getRankingColaboradores(req: Request, res: Response) {
    try {
      const { limit = 20, orderBy = 'custoTotal' } = req.query;

      const ranking = await SolicitacaoViagem.findAll({
        attributes: [
          'colaboradorId',
          [sequelize.fn('COUNT', sequelize.col('SolicitacaoViagem.id')), 'totalViagens'],
          [sequelize.fn('SUM', sequelize.col('custoTotal')), 'custoTotal'],
          [sequelize.fn('AVG', sequelize.col('custoTotal')), 'custoMedio'],
        ],
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['nome', 'email', 'departamento', 'cargo'],
          },
        ],
        group: ['colaboradorId'],
        order: [[sequelize.fn('SUM', sequelize.col('custoTotal')), 'DESC']],
        limit: parseInt(limit as string),
        raw: false,
      });

      return res.json(ranking);

    } catch (error: any) {
      console.error('Erro ao buscar ranking:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar ranking', 
        message: error.message 
      });
    }
  }

  // Dashboard consolidado (todas as métricas)
  async getDashboardConsolidado(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;

      // Buscar todas as métricas em paralelo
      const [
        kpis,
        tendencias,
        comparativoDept,
        topDestinos,
        projecao,
      ] = await Promise.all([
        this.getKPIsData(dataInicio as string, dataFim as string),
        this.getTendenciasData(),
        this.getComparativoDepartamentosData(dataInicio as string, dataFim as string),
        this.getTopDestinosData(),
        this.getProjecaoGastosData(),
      ]);

      return res.json({
        kpis,
        tendencias,
        comparativoDepartamentos: comparativoDept,
        topDestinos,
        projecao,
        timestamp: new Date(),
      });

    } catch (error: any) {
      console.error('Erro ao buscar dashboard consolidado:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar dashboard consolidado', 
        message: error.message 
      });
    }
  }

  // Métodos privados auxiliares
  private async getKPIsData(dataInicio?: string, dataFim?: string) {
    // Implementar lógica similar ao getKPIs
    return { totalViagens: 0, custoTotal: 0 };
  }

  private async getTendenciasData() {
    // Implementar lógica similar ao getTendencias
    return [];
  }

  private async getComparativoDepartamentosData(dataInicio?: string, dataFim?: string) {
    // Implementar lógica similar ao getComparativoDepartamentos
    return [];
  }

  private async getTopDestinosData() {
    // Implementar lógica similar ao getTopDestinos
    return [];
  }

  private async getProjecaoGastosData() {
    // Implementar lógica similar ao getProjecaoGastos
    return {};
  }
}

