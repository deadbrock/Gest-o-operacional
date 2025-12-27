import { Request, Response } from 'express';
import SolicitacaoAlimentacao from '../models/SolicitacaoAlimentacao';
import SolicitacaoViagem from '../models/SolicitacaoViagem';
import Colaborador from '../models/Colaborador';
import { Op } from 'sequelize';

export class SolicitacaoAlimentacaoController {
  // Listar solicitações de alimentação
  async listar(req: Request, res: Response) {
    try {
      const { status, colaboradorId, solicitacaoViagemId, dataInicio, dataFim } = req.query;
      
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (colaboradorId) {
        where.colaboradorId = colaboradorId;
      }
      
      if (solicitacaoViagemId) {
        where.solicitacaoViagemId = solicitacaoViagemId;
      }
      
      if (dataInicio && dataFim) {
        where.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }
      
      const solicitacoes = await SolicitacaoAlimentacao.findAll({
        where,
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['id', 'nome', 'email', 'departamento'],
          },
          {
            model: SolicitacaoViagem,
            as: 'solicitacaoViagem',
            attributes: ['id', 'destino', 'motivo'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      
      return res.json(solicitacoes);
    } catch (error: any) {
      console.error('Erro ao listar solicitações de alimentação:', error);
      return res.status(500).json({ error: 'Erro ao listar solicitações', message: error.message });
    }
  }

  // Buscar por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
          {
            model: SolicitacaoViagem,
            as: 'solicitacaoViagem',
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

  // Criar nova solicitação
  async criar(req: Request, res: Response) {
    try {
      const solicitacao = await SolicitacaoAlimentacao.create(req.body);
      
      const solicitacaoCompleta = await SolicitacaoAlimentacao.findByPk(solicitacao.id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
          {
            model: SolicitacaoViagem,
            as: 'solicitacaoViagem',
          },
        ],
      });
      
      return res.status(201).json(solicitacaoCompleta);
    } catch (error: any) {
      console.error('Erro ao criar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao criar solicitação', message: error.message });
    }
  }

  // Atualizar solicitação
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.update(req.body);
      
      const solicitacaoCompleta = await SolicitacaoAlimentacao.findByPk(id, {
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
          },
          {
            model: SolicitacaoViagem,
            as: 'solicitacaoViagem',
          },
        ],
      });
      
      return res.json(solicitacaoCompleta);
    } catch (error: any) {
      console.error('Erro ao atualizar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao atualizar solicitação', message: error.message });
    }
  }

  // Deletar solicitação
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id);
      
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

  // Aprovar solicitação
  async aprovar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { aprovadoPor, observacoes } = req.body;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      await solicitacao.update({
        status: 'aprovada',
        aprovadoPor,
        dataAprovacao: new Date(),
        observacoes,
      });
      
      return res.json(solicitacao);
    } catch (error: any) {
      console.error('Erro ao aprovar solicitação:', error);
      return res.status(400).json({ error: 'Erro ao aprovar solicitação', message: error.message });
    }
  }

  // Rejeitar solicitação
  async rejeitar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id);
      
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

  // Marcar como paga
  async marcarComoPaga(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { formaPagamento, comprovantePagamento } = req.body;
      
      const solicitacao = await SolicitacaoAlimentacao.findByPk(id);
      
      if (!solicitacao) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }
      
      if (solicitacao.status !== 'aprovada') {
        return res.status(400).json({ error: 'Apenas solicitações aprovadas podem ser pagas' });
      }
      
      await solicitacao.update({
        status: 'paga',
        formaPagamento,
        dataPagamento: new Date(),
        comprovantePagamento,
      });
      
      return res.json(solicitacao);
    } catch (error: any) {
      console.error('Erro ao marcar como paga:', error);
      return res.status(400).json({ error: 'Erro ao marcar como paga', message: error.message });
    }
  }

  // Calcular valores automaticamente baseado na viagem
  async calcularAutomatico(req: Request, res: Response) {
    try {
      const { solicitacaoViagemId } = req.body;
      
      const viagem = await SolicitacaoViagem.findByPk(solicitacaoViagemId);
      
      if (!viagem) {
        return res.status(404).json({ error: 'Solicitação de viagem não encontrada' });
      }
      
      // Calcular número de dias
      const dataInicio = new Date(viagem.dataInicio);
      const dataFim = new Date(viagem.dataFim);
      const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
      const numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Valores padrão (podem vir do .env)
      const valorCafeManha = parseFloat(process.env.RDV_CAFE_PADRAO || '25.00');
      const valorAlmoco = parseFloat(process.env.RDV_ALMOCO_PADRAO || '45.00');
      const valorJantar = parseFloat(process.env.RDV_JANTAR_PADRAO || '45.00');
      const valorLanche = parseFloat(process.env.RDV_OUTROS_PADRAO || '15.00');
      
      // Sugestão padrão: todas as refeições durante os dias
      const sugestao = {
        dataInicio: viagem.dataInicio,
        dataFim: viagem.dataFim,
        numeroDias,
        qtdCafeManha: numeroDias,
        qtdAlmoco: numeroDias,
        qtdJantar: numeroDias,
        qtdLanche: Math.floor(numeroDias / 2), // Lanches apenas metade dos dias
        valorCafeManha,
        valorAlmoco,
        valorJantar,
        valorLanche,
        totalCafeManha: numeroDias * valorCafeManha,
        totalAlmoco: numeroDias * valorAlmoco,
        totalJantar: numeroDias * valorJantar,
        totalLanche: Math.floor(numeroDias / 2) * valorLanche,
        valorTotal: (numeroDias * (valorCafeManha + valorAlmoco + valorJantar)) + (Math.floor(numeroDias / 2) * valorLanche),
      };
      
      return res.json(sugestao);
    } catch (error: any) {
      console.error('Erro ao calcular valores:', error);
      return res.status(500).json({ error: 'Erro ao calcular valores', message: error.message });
    }
  }

  // Relatório resumido
  async relatorio(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim, status } = req.query;
      
      const where: any = {};
      
      if (dataInicio && dataFim) {
        where.dataInicio = {
          [Op.between]: [new Date(dataInicio as string), new Date(dataFim as string)],
        };
      }
      
      if (status) {
        where.status = status;
      }
      
      const solicitacoes = await SolicitacaoAlimentacao.findAll({
        where,
        include: [
          {
            model: Colaborador,
            as: 'colaborador',
            attributes: ['nome', 'departamento'],
          },
        ],
      });
      
      // Calcular totais
      const totais = solicitacoes.reduce((acc, sol) => ({
        quantidade: acc.quantidade + 1,
        totalCafeManha: acc.totalCafeManha + parseFloat(sol.totalCafeManha.toString()),
        totalAlmoco: acc.totalAlmoco + parseFloat(sol.totalAlmoco.toString()),
        totalJantar: acc.totalJantar + parseFloat(sol.totalJantar.toString()),
        totalLanche: acc.totalLanche + parseFloat(sol.totalLanche.toString()),
        valorTotal: acc.valorTotal + parseFloat(sol.valorTotal.toString()),
      }), {
        quantidade: 0,
        totalCafeManha: 0,
        totalAlmoco: 0,
        totalJantar: 0,
        totalLanche: 0,
        valorTotal: 0,
      });
      
      // Agrupar por status
      const porStatus = solicitacoes.reduce((acc: any, sol) => {
        if (!acc[sol.status]) {
          acc[sol.status] = { quantidade: 0, valor: 0 };
        }
        acc[sol.status].quantidade++;
        acc[sol.status].valor += parseFloat(sol.valorTotal.toString());
        return acc;
      }, {});
      
      return res.json({
        totais,
        porStatus,
        solicitacoes: solicitacoes.length,
      });
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({ error: 'Erro ao gerar relatório', message: error.message });
    }
  }
}

