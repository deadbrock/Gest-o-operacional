import { Request, Response } from 'express';
import Hospedagem from '../models/Hospedagem';
import SolicitacaoViagem from '../models/SolicitacaoViagem';

export class HospedagemController {
  async listar(req: Request, res: Response) {
    try {
      const { solicitacaoId, status } = req.query;
      
      const where: any = {};
      
      if (solicitacaoId) {
        where.solicitacaoId = solicitacaoId;
      }
      
      if (status) {
        where.status = status;
      }
      
      const hospedagens = await Hospedagem.findAll({
        where,
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
        order: [['dataCheckin', 'DESC']],
      });
      
      return res.json(hospedagens);
    } catch (error: any) {
      console.error('Erro ao listar hospedagens:', error);
      return res.status(500).json({ error: 'Erro ao listar hospedagens', message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const hospedagem = await Hospedagem.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      if (!hospedagem) {
        return res.status(404).json({ error: 'Hospedagem não encontrada' });
      }
      
      return res.json(hospedagem);
    } catch (error: any) {
      console.error('Erro ao buscar hospedagem:', error);
      return res.status(500).json({ error: 'Erro ao buscar hospedagem', message: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      // Validar campos obrigatórios
      const { solicitacaoId, nomeHotel, cidade, estado, dataCheckin, dataCheckout, numeroDiarias, valorDiaria, valorTotal } = req.body;
      
      if (!solicitacaoId) {
        return res.status(400).json({ 
          error: 'Solicitação de Viagem é obrigatória', 
          message: 'Por favor, selecione uma Solicitação de Viagem para vincular a hospedagem.' 
        });
      }
      
      if (!nomeHotel || !cidade || !estado || !dataCheckin || !dataCheckout || !numeroDiarias || !valorDiaria || !valorTotal) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios não preenchidos', 
          message: 'Por favor, preencha todos os campos obrigatórios (hotel, cidade, estado, datas, diárias e valores).' 
        });
      }
      
      // Verificar se solicitação existe
      const solicitacao = await SolicitacaoViagem.findByPk(solicitacaoId);
      if (!solicitacao) {
        return res.status(404).json({ 
          error: 'Solicitação não encontrada', 
          message: `Solicitação de Viagem com ID ${solicitacaoId} não existe no sistema.` 
        });
      }
      
      const hospedagem = await Hospedagem.create(req.body);
      
      const hospedagemCompleta = await Hospedagem.findByPk(hospedagem.id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.status(201).json(hospedagemCompleta);
    } catch (error: any) {
      console.error('Erro ao criar hospedagem:', error);
      return res.status(400).json({ 
        error: 'Erro ao criar hospedagem', 
        message: error.message || 'Erro desconhecido ao criar hospedagem.' 
      });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const hospedagem = await Hospedagem.findByPk(id);
      
      if (!hospedagem) {
        return res.status(404).json({ error: 'Hospedagem não encontrada' });
      }
      
      await hospedagem.update(req.body);
      
      const hospedagemCompleta = await Hospedagem.findByPk(id, {
        include: [
          {
            model: SolicitacaoViagem,
            as: 'solicitacao',
          },
        ],
      });
      
      return res.json(hospedagemCompleta);
    } catch (error: any) {
      console.error('Erro ao atualizar hospedagem:', error);
      return res.status(400).json({ error: 'Erro ao atualizar hospedagem', message: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const hospedagem = await Hospedagem.findByPk(id);
      
      if (!hospedagem) {
        return res.status(404).json({ error: 'Hospedagem não encontrada' });
      }
      
      await hospedagem.destroy();
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar hospedagem:', error);
      return res.status(500).json({ error: 'Erro ao deletar hospedagem', message: error.message });
    }
  }
}

