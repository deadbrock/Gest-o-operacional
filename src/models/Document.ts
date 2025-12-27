import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum DocumentType {
  COMPROVANTE_HOSPEDAGEM = 'comprovante_hospedagem',
  VOUCHER_PASSAGEM = 'voucher_passagem',
  NOTA_FISCAL = 'nota_fiscal',
  COMPROVANTE_PAGAMENTO = 'comprovante_pagamento',
  RECIBO = 'recibo',
  CONTRATO = 'contrato',
  OUTRO = 'outro'
}

export enum EntityType {
  SOLICITACAO_VIAGEM = 'solicitacao_viagem',
  HOSPEDAGEM = 'hospedagem',
  PASSAGEM = 'passagem',
  DESPESA_RDV = 'despesa_rdv',
  SOLICITACAO_ALIMENTACAO = 'solicitacao_alimentacao'
}

interface DocumentAttributes {
  id: number;
  nome: string;
  nomeOriginal: string;
  tipo: DocumentType;
  mimeType: string;
  tamanho: number;
  caminho: string;
  url?: string;
  
  // Relacionamento polimórfico
  entityType: EntityType;
  entityId: number;
  
  uploadedBy: number;
  descricao?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

interface DocumentCreationAttributes 
  extends Optional<DocumentAttributes, 'id' | 'url' | 'descricao'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> 
  implements DocumentAttributes {
  public id!: number;
  public nome!: string;
  public nomeOriginal!: string;
  public tipo!: DocumentType;
  public mimeType!: string;
  public tamanho!: number;
  public caminho!: string;
  public url?: string;
  
  public entityType!: EntityType;
  public entityId!: number;
  
  public uploadedBy!: number;
  public descricao?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomeOriginal: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(DocumentType)),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Tamanho em bytes',
    },
    caminho: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Caminho físico do arquivo',
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL pública do arquivo',
    },
    entityType: {
      type: DataTypes.ENUM(...Object.values(EntityType)),
      allowNull: false,
      comment: 'Tipo da entidade relacionada',
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID da entidade relacionada',
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Usuário que fez o upload',
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
      {
        fields: ['entityType', 'entityId'],
      },
      {
        fields: ['uploadedBy'],
      },
      {
        fields: ['tipo'],
      },
    ],
  }
);

export default Document;

