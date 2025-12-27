import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui-2024';

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  departamento?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware de autenticação
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        message: 'É necessário estar autenticado para acessar este recurso' 
      });
    }

    // Formato: Bearer TOKEN
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O formato do token deve ser: Bearer {token}' 
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O token deve iniciar com Bearer' 
      });
    }

    // Verificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          error: 'Token inválido ou expirado',
          message: 'Faça login novamente' 
        });
      }

      req.user = decoded as JwtPayload;
      return next();
    });

  } catch (error) {
    return res.status(401).json({ 
      error: 'Erro na autenticação',
      message: 'Token inválido' 
    });
  }
};

// Middleware de autorização por role
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Não autenticado',
        message: 'Faça login primeiro' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: `Esta ação requer permissão de: ${allowedRoles.join(', ')}` 
      });
    }

    return next();
  };
};

// Middleware para verificar se é admin
export const isAdmin = authorize(UserRole.ADMIN);

// Middleware para verificar se é gestor ou acima
export const isGestorOrAbove = authorize(
  UserRole.GESTOR, 
  UserRole.FINANCEIRO, 
  UserRole.ADMIN
);

// Middleware para verificar se é financeiro ou admin
export const isFinanceiroOrAbove = authorize(
  UserRole.FINANCEIRO, 
  UserRole.ADMIN
);

// Middleware para verificar se o usuário pode acessar dados do departamento
export const canAccessDepartment = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Admin e financeiro podem acessar todos os departamentos
  if ([UserRole.ADMIN, UserRole.FINANCEIRO].includes(req.user.role)) {
    return next();
  }

  // Gestor pode acessar apenas seu departamento
  const { departamento } = req.query;
  
  if (req.user.role === UserRole.GESTOR) {
    if (departamento && departamento !== req.user.departamento) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: 'Você só pode acessar dados do seu departamento' 
      });
    }
  }

  return next();
};

