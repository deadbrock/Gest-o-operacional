import { Request, Response } from 'express';
import SolicitacaoViagem from '../models/SolicitacaoViagem';
import Colaborador from '../models/Colaborador';
import Hospedagem from '../models/Hospedagem';
import Passagem from '../models/Passagem';
import DespesaRDV from '../models/DespesaRDV';
import { Op } from 'sequelize';

export class SolicitacaoViagemController {
  async listar(req: Request, res: Response) {
    try {
      const { status, colaboradorId, dataInicio, dataFim } = req.query;
      
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (colaboradorId) {
        where.colaboradorId = colaboradorId;
      }
      
      if (dataInicio && dataFim) {
        where.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }
      
      const solicitacoes = await SolicitacaoViagem.findAll({
        where,
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['id', 'nome', 'email', 'departamento', 'cargo'],
          },
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
      
      return res.json(solicitacoes);
    } catch (error: any) {
      console.error('Erro ao listar solicitações:', error);
      return res.status(500).json({ error: 'Erro ao listar solicitações', message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
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
      });
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      return res.json(solicitacao);
    } catch (error: any) {
      console.error('Erro ao buscar solicitação:', error);
      return res.status(500).json({ error: 'Erro ao buscar solicitação', message: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const solicitacao = await SolicitacaoViagem.create(req.body);
      
      const solicitacaoCompleta = await SolicitacaoViagem.findByPk(solicitacao.id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
        ],
      });
      
      return res.status(201).json(solicitacaoCompleta);
    } catch (error: any) {
      console.error('Erro ao criar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao criar solicitação', message: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.update(req.body);
      
      const solicitacaoCompleta = await SolicitacaoViagem.findByPk(id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
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
      });
      
      return res.json(solicitacaoCompleta);
    } catch (error: any) {
      console.error('Erro ao atualizar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao atualizar solicitação', message: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.destroy();
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar solicitação:', error);
      return res.status(500).json({ error: 'Erro ao deletar solicitação', message: error.message });
    }
  }

  async aprovar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { aprovadoPor } = req.body;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.update({
        status: 'aprovada',
        aprovadoPor,
        dataAprovacao: new Date(),
      });
      
      return res.json(solicitacao);
    } catch (error: any) {
      console.error('Erro ao aprovar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao aprovar solicitação', message: error.message });
    }
  }

  async rejeitar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.update({
        status: 'rejeitada',
        observacoes,
      });
      
      return res.json(solicitacao);
    } catch (error: any) {
      console.error('Erro ao rejeitar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao rejeitar solicitação', message: error.message });
    }
  }

  async calcularCustoTotal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoViagem.findByPk(id, {
        include: [
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
      });
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      let custoTotal = 0;
      
      // @ts-ignore
      if (solicitacao.hospedagens) {
        // @ts-ignore
        solicitacao.hospedagens.forEach((h: any) => {
          custoTotal += parseFloat(h.valorTotal);
        });
      }
      
      // @ts-ignore
      if (solicitacao.passagens) {
        // @ts-ignore
        solicitacao.passagens.forEach((p: any) => {
          custoTotal += parseFloat(p.valorTotal);
        });
      }
      
      // @ts-ignore
      if (solicitacao.despesasRDV) {
        // @ts-ignore
        solicitacao.despesasRDV.forEach((d: any) => {
          custoTotal += parseFloat(d.valor);
        });
      }
      
      await solicitacao.update({ custoTotal });
      
      return res.json({ custoTotal });
    } catch (error: any) {
      console.error('Erro ao calcular custo total:', error);
      return res.status(500).json({ error: 'Erro ao calcular custo total', message: error.message });
    }
  }
}

