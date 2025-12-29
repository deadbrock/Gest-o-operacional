import { Request, Response } from 'express';
import Document, { DocumentType, EntityType } from '../models/Document';
import { sequelize } from '../config/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos permitidos
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas: PDF, DOC, DOCX, XLS, XLSX, JPEG, PNG, GIF'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export class DocumentController {
  // Upload de documento
  async uploadDocument(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      const { entityType, entityId, tipo, descricao } = req.body;
      // @ts-ignore
      const uploadedBy = req.user?.id;

      if (!entityType || !entityId || !tipo) {
        // Deletar arquivo uploadado
        fs.unlinkSync(req.file.path);
        
        return res.status(400).json({ 
          error: 'entityType, entityId e tipo são obrigatórios' 
        });
      }

      // Criar registro no banco
      const document = await Document.create({
        nome: req.file.filename,
        nomeOriginal: req.file.originalname,
        tipo: tipo as DocumentType,
        mimeType: req.file.mimetype,
        tamanho: req.file.size,
        caminho: req.file.path,
        url: `/uploads/${req.file.filename}`,
        entityType: entityType as EntityType,
        entityId: parseInt(entityId),
        uploadedBy: uploadedBy || 1, // Default para admin se não houver usuário
        descricao,
      });

      return res.status(201).json({
        message: 'Arquivo enviado com sucesso',
        document,
      });

    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      
      // Deletar arquivo em caso de erro
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao deletar arquivo:', unlinkError);
        }
      }
      
      return res.status(500).json({ 
        error: 'Erro ao fazer upload do arquivo', 
        message: error.message 
      });
    }
  }

  // Listar documentos
  async list(req: Request, res: Response) {
    try {
      const { entityType, entityId, tipo } = req.query;

      const where: any = {};
      
      if (entityType) where.entityType = entityType;
      if (entityId) where.entityId = entityId;
      if (tipo) where.tipo = tipo;

      const documents = await Document.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });

      return res.json(documents);

    } catch (error: any) {
      console.error('Erro ao listar documentos:', error);
      return res.status(500).json({ 
        error: 'Erro ao listar documentos', 
        message: error.message 
      });
    }
  }

  // Buscar por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      return res.json(document);

    } catch (error: any) {
      console.error('Erro ao buscar documento:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar documento', 
        message: error.message 
      });
    }
  }

  // Download de documento
  async download(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      // Verificar se arquivo existe
      if (!fs.existsSync(document.caminho)) {
        return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
      }

      // Fazer download
      return res.download(document.caminho, document.nomeOriginal);

    } catch (error: any) {
      console.error('Erro ao fazer download:', error);
      return res.status(500).json({ 
        error: 'Erro ao fazer download do arquivo', 
        message: error.message 
      });
    }
  }

  // Deletar documento
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      // Deletar arquivo físico
      if (fs.existsSync(document.caminho)) {
        fs.unlinkSync(document.caminho);
      }

      // Deletar registro do banco
      await document.destroy();

      return res.json({
        message: 'Documento deletado com sucesso',
      });

    } catch (error: any) {
      console.error('Erro ao deletar documento:', error);
      return res.status(500).json({ 
        error: 'Erro ao deletar documento', 
        message: error.message 
      });
    }
  }

  // Atualizar descrição/tipo
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tipo, descricao } = req.body;

      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      await document.update({
        tipo: tipo || document.tipo,
        descricao: descricao !== undefined ? descricao : document.descricao,
      });

      return res.json({
        message: 'Documento atualizado com sucesso',
        document,
      });

    } catch (error: any) {
      console.error('Erro ao atualizar documento:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar documento', 
        message: error.message 
      });
    }
  }

  // Estatísticas de documentos
  async stats(req: Request, res: Response) {
    try {
      const totalDocuments = await Document.count();
      
      const documentsByType = await Document.findAll({
        attributes: [
          'tipo',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.col('tamanho')), 'totalSize'],
        ],
        group: ['tipo'],
        raw: true,
      });

      const documentsByEntity = await Document.findAll({
        attributes: [
          'entityType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        ],
        group: ['entityType'],
        raw: true,
      });

      const totalSize = await Document.sum('tamanho');

      return res.json({
        totalDocuments,
        totalSize: totalSize || 0,
        totalSizeFormatted: formatBytes(totalSize || 0),
        documentsByType,
        documentsByEntity,
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

// Função auxiliar para formatar bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

