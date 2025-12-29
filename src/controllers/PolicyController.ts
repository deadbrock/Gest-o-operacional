import { Request, Response } from 'express';
import Policy, { PolicyType, PolicyScope } from '../models/Policy';
import { Op } from 'sequelize';

export class PolicyController {
  // Criar política
  async create(req: Request, res: Response) {
    try {
      // @ts-ignore
      const createdBy = req.user?.id;
      
      const policy = await Policy.create({
        ...req.body,
        createdBy,
      });

      return res.status(201).json({
        message: 'Política criada com sucesso',
        policy,
      });

    } catch (error: any) {
      console.error('Erro ao criar política:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar política', 
        message: error.message 
      });
    }
  }

  // Listar políticas
  async list(req: Request, res: Response) {
    try {
      const { tipo, scope, ativo } = req.query;

      const where: any = {};
      
      if (tipo) where.tipo = tipo;
      if (scope) where.scope = scope;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const policies = await Policy.findAll({
        where,
        order: [['prioridade', 'DESC'], ['createdAt', 'DESC']],
      });

      return res.json(policies);

    } catch (error: any) {
      console.error('Erro ao listar políticas:', error);
      return res.status(500).json({ 
        error: 'Erro ao listar políticas', 
        message: error.message 
      });
    }
  }

  // Buscar por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const policy = await Policy.findByPk(id);

      if (!policy) {
        return res.status(404).json({ error: 'Política não encontrada' });
      }

      return res.json(policy);

    } catch (error: any) {
      console.error('Erro ao buscar política:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar política', 
        message: error.message 
      });
    }
  }

  // Atualizar política
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const policy = await Policy.findByPk(id);

      if (!policy) {
        return res.status(404).json({ error: 'Política não encontrada' });
      }

      await policy.update(req.body);

      return res.json({
        message: 'Política atualizada com sucesso',
        policy,
      });

    } catch (error: any) {
      console.error('Erro ao atualizar política:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar política', 
        message: error.message 
      });
    }
  }

  // Deletar política
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const policy = await Policy.findByPk(id);

      if (!policy) {
        return res.status(404).json({ error: 'Política não encontrada' });
      }

      // Soft delete
      await policy.update({ ativo: false });

      return res.json({
        message: 'Política desativada com sucesso',
      });

    } catch (error: any) {
      console.error('Erro ao deletar política:', error);
      return res.status(500).json({ 
        error: 'Erro ao deletar política', 
        message: error.message 
      });
    }
  }

  // Buscar política aplicável para um contexto específico
  async getApplicablePolicy(req: Request, res: Response) {
    try {
      const { tipo, colaboradorId, departamento, cargo } = req.query;

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo é obrigatório' });
      }

      // Buscar políticas em ordem de prioridade
      const orConditions: any[] = [
        { scope: PolicyScope.GLOBAL },
      ];
      
      if (departamento) {
        orConditions.push({ scope: PolicyScope.DEPARTAMENTO, scopeValue: departamento as string });
      }
      if (cargo) {
        orConditions.push({ scope: PolicyScope.CARGO, scopeValue: cargo as string });
      }
      if (colaboradorId) {
        orConditions.push({ scope: PolicyScope.COLABORADOR, scopeValue: colaboradorId as string });
      }

      const policies = await Policy.findAll({
        where: {
          tipo: tipo as PolicyType,
          ativo: true,
          [Op.or]: orConditions,
        },
        order: [['prioridade', 'DESC'], ['createdAt', 'DESC']],
      });

      // Retornar a política mais específica (maior prioridade)
      const applicablePolicy = policies[0] || null;

      return res.json({
        policy: applicablePolicy,
        allPolicies: policies,
      });

    } catch (error: any) {
      console.error('Erro ao buscar política aplicável:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar política aplicável', 
        message: error.message 
      });
    }
  }

  // Validar valor contra política
  async validateValue(req: Request, res: Response) {
    try {
      const { tipo, valor, colaboradorId, departamento, cargo, context } = req.body;

      if (!tipo || valor === undefined) {
        return res.status(400).json({ error: 'Tipo e valor são obrigatórios' });
      }

      // Buscar política aplicável
      const orConditionsValidate: any[] = [
        { scope: PolicyScope.GLOBAL },
      ];
      
      if (departamento) {
        orConditionsValidate.push({ scope: PolicyScope.DEPARTAMENTO, scopeValue: departamento });
      }
      if (cargo) {
        orConditionsValidate.push({ scope: PolicyScope.CARGO, scopeValue: cargo });
      }
      if (colaboradorId) {
        orConditionsValidate.push({ scope: PolicyScope.COLABORADOR, scopeValue: colaboradorId });
      }

      const policies = await Policy.findAll({
        where: {
          tipo: tipo as PolicyType,
          ativo: true,
          [Op.or]: orConditionsValidate,
        },
        order: [['prioridade', 'DESC']],
      });

      const policy = policies[0];

      if (!policy) {
        return res.json({
          valid: true,
          message: 'Nenhuma política definida',
          requiresJustification: false,
        });
      }

      let valid = true;
      let message = 'Dentro da política';
      let violations: string[] = [];

      // Validar valor máximo por diária
      if (policy.valorMaximoDiaria && context === 'diaria') {
        if (valor > parseFloat(policy.valorMaximoDiaria.toString())) {
          valid = false;
          violations.push(`Valor da diária (R$ ${valor.toFixed(2)}) excede o limite de R$ ${policy.valorMaximoDiaria}`);
        }
      }

      // Validar valor máximo total
      if (policy.valorMaximoTotal && context === 'total') {
        if (valor > parseFloat(policy.valorMaximoTotal.toString())) {
          valid = false;
          violations.push(`Valor total (R$ ${valor.toFixed(2)}) excede o limite de R$ ${policy.valorMaximoTotal}`);
        }
      }

      // Validar valor máximo por refeição
      if (policy.valorMaximoRefeicao && context === 'refeicao') {
        if (valor > parseFloat(policy.valorMaximoRefeicao.toString())) {
          valid = false;
          violations.push(`Valor da refeição (R$ ${valor.toFixed(2)}) excede o limite de R$ ${policy.valorMaximoRefeicao}`);
        }
      }

      if (!valid) {
        message = violations.join('. ');
      }

      return res.json({
        valid,
        message,
        violations,
        policy: {
          id: policy.id,
          nome: policy.nome,
          permiteExcecao: policy.permiteExcecao,
        },
        requiresJustification: !valid && policy.permiteExcecao,
      });

    } catch (error: any) {
      console.error('Erro ao validar valor:', error);
      return res.status(500).json({ 
        error: 'Erro ao validar valor', 
        message: error.message 
      });
    }
  }

  // Estatísticas de conformidade
  async complianceStats(req: Request, res: Response) {
    try {
      // Aqui você implementaria lógica para calcular:
      // - % de solicitações dentro da política
      // - % de exceções aprovadas
      // - Economia vs. sem política
      // - Violações por departamento

      return res.json({
        message: 'Estatísticas de conformidade - Em desenvolvimento',
        stats: {
          totalPolicies: await Policy.count({ where: { ativo: true } }),
          policyTypes: await Policy.count({
            where: { ativo: true },
            group: ['tipo'],
          }),
        },
      });

    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar estatísticas', 
        message: error.message 
      });
    }
  }
}

