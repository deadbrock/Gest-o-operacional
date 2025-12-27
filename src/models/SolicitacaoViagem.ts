import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Colaborador from './Colaborador';

interface SolicitacaoViagemAttributes {
  id: number;
  colaboradorId: number;
  destino: string;
  motivo: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'em_andamento' | 'concluida' | 'cancelada';
  centroCusto: string;
  projeto?: string;
  observacoes?: string;
  aprovadoPor?: string;
  dataAprovacao?: Date;
  custoTotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SolicitacaoViagemCreationAttributes extends Optional<SolicitacaoViagemAttributes, 'id' | 'status' | 'projeto' | 'observacoes' | 'aprovadoPor' | 'dataAprovacao' | 'custoTotal'> {}

class SolicitacaoViagem extends Model<SolicitacaoViagemAttributes, SolicitacaoViagemCreationAttributes> implements SolicitacaoViagemAttributes {
  public id!: number;
  public colaboradorId!: number;
  public destino!: string;
  public motivo!: string;
  public dataInicio!: Date;
  public dataFim!: Date;
  public status!: 'pendente' | 'aprovada' | 'rejeitada' | 'em_andamento' | 'concluida' | 'cancelada';
  public centroCusto!: string;
  public projeto?: string;
  public observacoes?: string;
  public aprovadoPor?: string;
  public dataAprovacao?: Date;
  public custoTotal?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SolicitacaoViagem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    colaboradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaboradores',
        key: 'id',
      },
    },
    destino: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada', 'em_andamento', 'concluida', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    centroCusto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    projeto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aprovadoPor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dataAprovacao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    custoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'solicitacoes_viagem',
    timestamps: true,
  }
);

SolicitacaoViagem.belongsTo(Colaborador, { foreignKey: 'colaboradorId', as: 'colaborador' });
Colaborador.hasMany(SolicitacaoViagem, { foreignKey: 'colaboradorId', as: 'viagens' });

export default SolicitacaoViagem;

