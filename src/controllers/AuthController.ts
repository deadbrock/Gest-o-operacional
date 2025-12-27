import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui-2024';
const JWT_EXPIRES_IN = '7d';

export class AuthController {
  // Login
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      // Buscar usuário
      const user = await User.findOne({ 
        where: { email, ativo: true } 
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas' 
        });
      }

      // Validar senha
      const senhaValida = await user.validarSenha(senha);
      
      if (!senhaValida) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas' 
        });
      }

      // Atualizar último acesso
      await user.update({ ultimoAcesso: new Date() });

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          departamento: user.departamento 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Retornar token e dados do usuário
      return res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          departamento: user.departamento,
        },
        expiresIn: JWT_EXPIRES_IN,
      });

    } catch (error: any) {
      console.error('Erro no login:', error);
      return res.status(500).json({ 
        error: 'Erro ao fazer login', 
        message: error.message 
      });
    }
  }

  // Registro de novo usuário (apenas admin)
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha, role, colaboradorId, departamento } = req.body;

      // Validações
      if (!nome || !email || !senha) {
        return res.status(400).json({ 
          error: 'Nome, email e senha são obrigatórios' 
        });
      }

      // Verificar se email já existe
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email já cadastrado' 
        });
      }

      // Criar usuário
      const user = await User.create({
        nome,
        email,
        senha,
        role: role || UserRole.COLABORADOR,
        colaboradorId,
        departamento,
        ativo: true,
      });

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro ao registrar usuário', 
        message: error.message 
      });
    }
  }

  // Verificar token
  async me(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user?.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        departamento: user.departamento,
        ultimoAcesso: user.ultimoAcesso,
      });

    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar usuário', 
        message: error.message 
      });
    }
  }

  // Trocar senha
  async changePassword(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user?.id;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ 
          error: 'Senha atual e nova senha são obrigatórias' 
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Validar senha atual
      const senhaValida = await user.validarSenha(senhaAtual);
      
      if (!senhaValida) {
        return res.status(401).json({ 
          error: 'Senha atual incorreta' 
        });
      }

      // Atualizar senha
      await user.update({ senha: novaSenha });

      return res.json({
        message: 'Senha alterada com sucesso',
      });

    } catch (error: any) {
      console.error('Erro ao trocar senha:', error);
      return res.status(500).json({ 
        error: 'Erro ao trocar senha', 
        message: error.message 
      });
    }
  }

  // Listar usuários (apenas admin)
  async list(req: Request, res: Response) {
    try {
      const { role, ativo } = req.query;

      const where: any = {};
      
      if (role) where.role = role;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const users = await User.findAll({
        where,
        order: [['nome', 'ASC']],
      });

      return res.json(users);

    } catch (error: any) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ 
        error: 'Erro ao listar usuários', 
        message: error.message 
      });
    }
  }

  // Atualizar usuário
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, role, departamento, ativo } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.update({
        nome: nome || user.nome,
        email: email || user.email,
        role: role || user.role,
        departamento: departamento !== undefined ? departamento : user.departamento,
        ativo: ativo !== undefined ? ativo : user.ativo,
      });

      return res.json({
        message: 'Usuário atualizado com sucesso',
        user,
      });

    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar usuário', 
        message: error.message 
      });
    }
  }

  // Deletar usuário
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Soft delete (desativar)
      await user.update({ ativo: false });

      return res.json({
        message: 'Usuário desativado com sucesso',
      });

    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro ao deletar usuário', 
        message: error.message 
      });
    }
  }
}

