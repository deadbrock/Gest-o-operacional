import { Request, Response } from 'express';
import DespesaRDV from '../models/DespesaRDV';
import SolicitacaoViagem from '../models/SolicitacaoViagem';

export class DespesaRDVController {
  async listar(req: Request, res: Response) {
    try {
      const { solicitacaoId, tipo, status } = req.query;
      
      const where: any = {};
      
      if (solicitacaoId) {
        where.solicitacaoId = solicitacaoId;
      }
      
      if (tipo) {
        where.tipo = tipo;
      }
      
      if (status) {
        where.status = status;
      }
      
      const despesas = await DespesaRDV.findAll({
        where,
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
        order: [['data', 'DESC']],
      });
      
      return res.json(despesas);
    } catch (error: any) {
      console.error('Erro ao listar despesas RDV:', error);
      return res.status(500).json({ error: 'Erro ao listar despesas RDV', message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const despesa = await DespesaRDV.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa RDV não encontrada' });
      }
      
      return res.json(despesa);
    } catch (error: any) {
      console.error('Erro ao buscar despesa RDV:', error);
      return res.status(500).json({ error: 'Erro ao buscar despesa RDV', message: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const despesa = await DespesaRDV.create(req.body);
      
      const despesaCompleta = await DespesaRDV.findByPk(despesa.id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.status(201).json(despesaCompleta);
    } catch (error: any) {
      console.error('Erro ao criar despesa RDV:', error);
      return res.status(400).json({ error: 'Erro ao criar despesa RDV', message: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const despesa = await DespesaRDV.findByPk(id);
      
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa RDV não encontrada' });
      }
      
      await despesa.update(req.body);
      
      const despesaCompleta = await DespesaRDV.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.json(despesaCompleta);
    } catch (error: any) {
      console.error('Erro ao atualizar despesa RDV:', error);
      return res.status(400).json({ error: 'Erro ao atualizar despesa RDV', message: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const despesa = await DespesaRDV.findByPk(id);
      
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa RDV não encontrada' });
      }
      
      await despesa.destroy();
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar despesa RDV:', error);
      return res.status(500).json({ error: 'Erro ao deletar despesa RDV', message: error.message });
    }
  }

  async aprovar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const despesa = await DespesaRDV.findByPk(id);
      
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa RDV não encontrada' });
      }
      
      await despesa.update({ status: 'aprovada' });
      
      return res.json(despesa);
    } catch (error: any) {
      console.error('Erro ao aprovar despesa RDV:', error);
      return res.status(400).json({ error: 'Erro ao aprovar despesa RDV', message: error.message });
    }
  }

  async rejeitar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;
      
      const despesa = await DespesaRDV.findByPk(id);
      
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa RDV não encontrada' });
      }
      
      await despesa.update({ 
        status: 'rejeitada',
        observacoes,
      });
      
      return res.json(despesa);
    } catch (error: any) {
      console.error('Erro ao rejeitar despesa RDV:', error);
      return res.status(400).json({ error: 'Erro ao rejeitar despesa RDV', message: error.message });
    }
  }
}

