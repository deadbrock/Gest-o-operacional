import { Request, Response } from 'express';
import Passagem from '../models/Passagem';
import SolicitacaoViagem from '../models/SolicitacaoViagem';

export class PassagemController {
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
      
      const passagens = await Passagem.findAll({
        where,
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
        order: [['dataIda', 'DESC']],
      });
      
      return res.json(passagens);
    } catch (error: any) {
      console.error('Erro ao listar passagens:', error);
      return res.status(500).json({ error: 'Erro ao listar passagens', message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const passagem = await Passagem.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      if (!passagem) {
        return res.status(404).json({ error: 'Passagem não encontrada' });
      }
      
      return res.json(passagem);
    } catch (error: any) {
      console.error('Erro ao buscar passagem:', error);
      return res.status(500).json({ error: 'Erro ao buscar passagem', message: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const passagem = await Passagem.create(req.body);
      
      const passagemCompleta = await Passagem.findByPk(passagem.id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.status(201).json(passagemCompleta);
    } catch (error: any) {
      console.error('Erro ao criar passagem:', error);
      return res.status(400).json({ error: 'Erro ao criar passagem', message: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const passagem = await Passagem.findByPk(id);
      
      if (!passagem) {
        return res.status(404).json({ error: 'Passagem não encontrada' });
      }
      
      await passagem.update(req.body);
      
      const passagemCompleta = await Passagem.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.json(passagemCompleta);
    } catch (error: any) {
      console.error('Erro ao atualizar passagem:', error);
      return res.status(400).json({ error: 'Erro ao atualizar passagem', message: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const passagem = await Passagem.findByPk(id);
      
      if (!passagem) {
        return res.status(404).json({ error: 'Passagem não encontrada' });
      }
      
      await passagem.destroy();
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar passagem:', error);
      return res.status(500).json({ error: 'Erro ao deletar passagem', message: error.message });
    }
  }
}

