import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum PolicyType {
  HOSPEDAGEM = 'hospedagem',
  PASSAGEM_AEREA = 'passagem_aerea',
  PASSAGEM_TERRESTRE = 'passagem_terrestre',
  ALIMENTACAO = 'alimentacao',
  TRANSPORTE = 'transporte',
  OUTROS = 'outros'
}

export enum PolicyScope {
  GLOBAL = 'global',
  DEPARTAMENTO = 'departamento',
  CARGO = 'cargo',
  COLABORADOR = 'colaborador'
}

interface PolicyAttributes {
  id: number;
  nome: string;
  descricao?: string;
  tipo: PolicyType;
  scope: PolicyScope;
  scopeValue?: string; // Nome do departamento, cargo ou colaboradorId
  
  // Limites financeiros
  valorMaximoDiaria?: number;
  valorMaximoTotal?: number;
  valorMaximoRefeicao?: number;
  
  // Regras específicas
  classVooPermitida?: string; // economica, executiva, primeira_classe
  antecedenciaMinimaDias?: number;
  requiredApprovalLevel?: string; // gestor, diretor, vp
  
  // Regras de hospedagem
  categoriaHotelMaxima?: number; // 1-5 estrelas
  permiteAirbnb?: boolean;
  
  // Observações e exceções
  observacoes?: string;
  permiteExcecao?: boolean;
  
  ativo: boolean;
  prioridade: number; // Quanto maior, mais prioritária
  
  createdBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PolicyCreationAttributes 
  extends Optional<PolicyAttributes, 'id' | 'descricao' | 'scopeValue' | 'valorMaximoDiaria' | 'valorMaximoTotal' | 'valorMaximoRefeicao' | 'classVooPermitida' | 'antecedenciaMinimaDias' | 'requiredApprovalLevel' | 'categoriaHotelMaxima' | 'permiteAirbnb' | 'observacoes' | 'permiteExcecao' | 'ativo' | 'prioridade' | 'createdBy'> {}

class Policy extends Model<PolicyAttributes, PolicyCreationAttributes> 
  implements PolicyAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public tipo!: PolicyType;
  public scope!: PolicyScope;
  public scopeValue?: string;
  
  public valorMaximoDiaria?: number;
  public valorMaximoTotal?: number;
  public valorMaximoRefeicao?: number;
  
  public classVooPermitida?: string;
  public antecedenciaMinimaDias?: number;
  public requiredApprovalLevel?: string;
  
  public categoriaHotelMaxima?: number;
  public permiteAirbnb?: boolean;
  
  public observacoes?: string;
  public permiteExcecao?: boolean;
  
  public ativo!: boolean;
  public prioridade!: number;
  
  public createdBy?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Policy.init(
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(PolicyType)),
      allowNull: false,
    },
    scope: {
      type: DataTypes.ENUM(...Object.values(PolicyScope)),
      allowNull: false,
    },
    scopeValue: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Valor do escopo (departamento, cargo, colaboradorId)',
    },
    valorMaximoDiaria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor máximo por diária',
    },
    valorMaximoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor máximo total da despesa',
    },
    valorMaximoRefeicao: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor máximo por refeição',
    },
    classVooPermitida: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'economica, executiva, primeira_classe',
    },
    antecedenciaMinimaDias: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Dias mínimos de antecedência para solicitar',
    },
    requiredApprovalLevel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Nível de aprovação necessário',
    },
    categoriaHotelMaxima: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Categoria máxima de hotel (1-5 estrelas)',
    },
    permiteAirbnb: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    permiteExcecao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Permite exceção com justificativa',
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    prioridade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Quanto maior, mais prioritária. Ordem: colaborador > cargo > departamento > global',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'policies',
    timestamps: true,
    indexes: [
      {
        fields: ['tipo'],
      },
      {
        fields: ['scope', 'scopeValue'],
      },
      {
        fields: ['ativo'],
      },
    ],
  }
);

export default Policy;

