import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import SolicitacaoViagem from './SolicitacaoViagem';

interface PassagemAttributes {
  id: number;
  solicitacaoId: number;
  tipo: 'aerea' | 'onibus' | 'trem' | 'outro';
  companhia: string;
  origem: string;
  destino: string;
  dataIda: Date;
  dataVolta?: Date;
  valorIda: number;
  valorVolta?: number;
  valorTotal: number;
  numeroVoo?: string;
  numeroPoltrona?: string;
  status: 'pendente' | 'reservada' | 'emitida' | 'cancelada' | 'utilizada';
  localizador?: string;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PassagemCreationAttributes extends Optional<PassagemAttributes, 'id' | 'dataVolta' | 'valorVolta' | 'numeroVoo' | 'numeroPoltrona' | 'status' | 'localizador' | 'observacoes'> {}

class Passagem extends Model<PassagemAttributes, PassagemCreationAttributes> implements PassagemAttributes {
  public id!: number;
  public solicitacaoId!: number;
  public tipo!: 'aerea' | 'onibus' | 'trem' | 'outro';
  public companhia!: string;
  public origem!: string;
  public destino!: string;
  public dataIda!: Date;
  public dataVolta?: Date;
  public valorIda!: number;
  public valorVolta?: number;
  public valorTotal!: number;
  public numeroVoo?: string;
  public numeroPoltrona?: string;
  public status!: 'pendente' | 'reservada' | 'emitida' | 'cancelada' | 'utilizada';
  public localizador?: string;
  public observacoes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Passagem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    solicitacaoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'solicitacoes_viagem',
        key: 'id',
      },
    },
    tipo: {
      type: DataTypes.ENUM('aerea', 'onibus', 'trem', 'outro'),
      allowNull: false,
    },
    companhia: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    origem: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dataIda: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataVolta: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valorIda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valorVolta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    numeroVoo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    numeroPoltrona: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'reservada', 'emitida', 'cancelada', 'utilizada'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    localizador: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'passagens',
    timestamps: true,
  }
);

Passagem.belongsTo(SolicitacaoViagem, { foreignKey: 'solicitacaoId', as: 'solicitacao' });
SolicitacaoViagem.hasMany(Passagem, { foreignKey: 'solicitacaoId', as: 'passagens' });

export default Passagem;

