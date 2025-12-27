import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import SolicitacaoViagem from '../models/SolicitacaoViagem';
import Colaborador from '../models/Colaborador';
import Hospedagem from '../models/Hospedagem';
import Passagem from '../models/Passagem';
import DespesaRDV from '../models/DespesaRDV';
import { Op } from 'sequelize';

export class RelatorioController {
  async dashboard(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;
      
      let whereDate: any = {};
      
      if (dataInicio && dataFim) {
        whereDate = {
          dataInicio: {
            [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
          },
        };
      }
      
      // Total de solicitações por status
      const solicitacoesPorStatus = await SolicitacaoViagem.findAll({
        where: whereDate,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        ],
        group: ['status'],
        raw: true,
      });
      
      // Custos totais
      const custoHospedagens = await Hospedagem.sum('valorTotal', { where: whereDate }) || 0;
      const custoPassagens = await Passagem.sum('valorTotal', { where: whereDate }) || 0;
      const custoDespesas = await DespesaRDV.sum('valor', { where: whereDate }) || 0;
      const custoTotal = custoHospedagens + custoPassagens + custoDespesas;
      
      // Top 5 colaboradores com mais viagens
      const topColaboradores = await SolicitacaoViagem.findAll({
        where: whereDate,
        attributes: [
          'colaboradorId',
          [sequelize.fn('COUNT', sequelize.col('SolicitacaoViagem.id')), 'totalViagens'],
          [sequelize.fn('SUM', sequelize.col('custoTotal')), 'custoTotal'],
        ],
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['nome', 'departamento'],
          },
        ],
        group: ['colaboradorId'],
        order: [[sequelize.fn('COUNT', sequelize.col('SolicitacaoViagem.id')), 'DESC']],
        limit: 5,
        raw: false,
      });
      
      // Custos por departamento
      const custosPorDepartamento = await SolicitacaoViagem.findAll({
        where: whereDate,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('custoTotal')), 'total'],
        ],
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['departamento'],
          },
        ],
        group: ['colaborador.departamento'],
        raw: true,
      });
      
      // Hospedagens por status
      const hospedagensPorStatus = await Hospedagem.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.col('valorTotal')), 'valorTotal'],
        ],
        group: ['status'],
        raw: true,
      });
      
      // Passagens por tipo
      const passagensPorTipo = await Passagem.findAll({
        attributes: [
          'tipo',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.col('valorTotal')), 'valorTotal'],
        ],
        group: ['tipo'],
        raw: true,
      });
      
      // Despesas RDV por tipo
      const despesasPorTipo = await DespesaRDV.findAll({
        attributes: [
          'tipo',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.col('valor')), 'valorTotal'],
        ],
        group: ['tipo'],
        raw: true,
      });
      
      return res.json({
        solicitacoesPorStatus,
        custos: {
          hospedagens: custoHospedagens,
          passagens: custoPassagens,
          despesas: custoDespesas,
          total: custoTotal,
        },
        topColaboradores,
        custosPorDepartamento,
        hospedagensPorStatus,
        passagensPorTipo,
        despesasPorTipo,
      });
    } catch (error: any) {
      console.error('Erro ao gerar dashboard:', error);
      return res.status(500).json({ error: 'Erro ao gerar dashboard', message: error.message });
    }
  }

  async custosDetalhados(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim, colaboradorId, departamento } = req.query;
      
      const where: any = {};
      
      if (dataInicio && dataFim) {
        where.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }
      
      if (colaboradorId) {
        where.colaboradorId = colaboradorId;
      }
      
      const includeColaborador: any = {
        model: Colaborador,
        as: 'colaborador',
        attributes: ['nome', 'departamento', 'cargo'],
      };
      
      if (departamento) {
        includeColaborador.where = { departamento };
      }
      
      const viagens = await SolicitacaoViagem.findAll({
        where,
        include: [
          includeColaborador,
          {
            model: Hospedagem,
            as: 'hospedagens',
          },
          {
            model: Passagem,
            as: 'passagens',
          },
          {
            model: DespesaRDV,
            as: 'despesasRDV',
          },
        ],
        order: [['dataInicio', 'DESC']],
      });
      
      const relatorio = viagens.map((viagem: any) => {
        const custoHospedagens = viagem.hospedagens?.reduce((sum: number, h: any) => sum + parseFloat(h.valorTotal), 0) || 0;
        const custoPassagens = viagem.passagens?.reduce((sum: number, p: any) => sum + parseFloat(p.valorTotal), 0) || 0;
        const custoDespesas = viagem.despesasRDV?.reduce((sum: number, d: any) => sum + parseFloat(d.valor), 0) || 0;
        
        return {
          id: viagem.id,
          colaborador: viagem.colaborador?.nome,
          departamento: viagem.colaborador?.departamento,
          destino: viagem.destino,
          dataInicio: viagem.dataInicio,
          dataFim: viagem.dataFim,
          status: viagem.status,
          custos: {
            hospedagens: custoHospedagens,
            passagens: custoPassagens,
            despesas: custoDespesas,
            total: custoHospedagens + custoPassagens + custoDespesas,
          },
          detalhes: {
            hospedagens: viagem.hospedagens?.length || 0,
            passagens: viagem.passagens?.length || 0,
            despesas: viagem.despesasRDV?.length || 0,
          },
        };
      });
      
      const totais = {
        hospedagens: relatorio.reduce((sum, r) => sum + r.custos.hospedagens, 0),
        passagens: relatorio.reduce((sum, r) => sum + r.custos.passagens, 0),
        despesas: relatorio.reduce((sum, r) => sum + r.custos.despesas, 0),
        total: relatorio.reduce((sum, r) => sum + r.custos.total, 0),
      };
      
      return res.json({
        viagens: relatorio,
        totais,
        quantidade: relatorio.length,
      });
    } catch (error: any) {
      console.error('Erro ao gerar relatório de custos:', error);
      return res.status(500).json({ error: 'Erro ao gerar relatório de custos', message: error.message });
    }
  }
}

