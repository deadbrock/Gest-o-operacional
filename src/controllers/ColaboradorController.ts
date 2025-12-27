import { Request, Response } from 'express';
import Colaborador from '../models/Colaborador';
import { Op } from 'sequelize';

export class ColaboradorController {
  async listar(req: Request, res: Response) {
    try {
      const { ativo, departamento, busca } = req.query;
      
      const where: any = {};
      
      if (ativo !== undefined) {
        where.ativo = ativo === 'true';
      }
      
      if (departamento) {
        where.departamento = departamento;
      }
      
      if (busca) {
        where[Op.or] = [
          { nome: { [Op.like]: `%${busca}%` } },
          { email: { [Op.like]: `%${busca}%` } },
          { cpf: { [Op.like]: `%${busca}%` } },
          { matricula: { [Op.like]: `%${busca}%` } },
        ];
      }
      
      const colaboradores = await Colaborador.findAll({
        where,
        order: [['nome', 'ASC']],
      });
      
      return res.json(colaboradores);
    } catch (error: any) {
      console.error('Erro ao listar colaboradores:', error);
      return res.status(500).json({ error: 'Erro ao listar colaboradores', message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const colaborador = await Colaborador.findByPk(id);
      
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      
      return res.json(colaborador);
    } catch (error: any) {
      console.error('Erro ao buscar colaborador:', error);
      return res.status(500).json({ error: 'Erro ao buscar colaborador', message: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const colaborador = await Colaborador.create(req.body);
      return res.status(201).json(colaborador);
    } catch (error: any) {
      console.error('Erro ao criar colaborador:', error);
      return res.status(400).json({ error: 'Erro ao criar colaborador', message: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const colaborador = await Colaborador.findByPk(id);
      
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      
      await colaborador.update(req.body);
      
      return res.json(colaborador);
    } catch (error: any) {
      console.error('Erro ao atualizar colaborador:', error);
      return res.status(400).json({ error: 'Erro ao atualizar colaborador', message: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const colaborador = await Colaborador.findByPk(id);
      
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      
      await colaborador.destroy();
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar colaborador:', error);
      return res.status(500).json({ error: 'Erro ao deletar colaborador', message: error.message });
    }
  }

  async departamentos(req: Request, res: Response) {
    try {
      const colaboradores = await Colaborador.findAll({
        attributes: ['departamento'],
        group: ['departamento'],
        raw: true,
      });
      
      const departamentos = colaboradores.map((c: any) => c.departamento);
      
      return res.json(departamentos);
    } catch (error: any) {
      console.error('Erro ao listar departamentos:', error);
      return res.status(500).json({ error: 'Erro ao listar departamentos', message: error.message });
    }
  }
}

