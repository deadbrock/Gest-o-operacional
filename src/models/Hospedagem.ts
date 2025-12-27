import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import SolicitacaoViagem from './SolicitacaoViagem';

interface HospedagemAttributes {
  id: number;
  solicitacaoId: number;
  nomeHotel: string;
  cidade: string;
  estado: string;
  dataCheckin: Date;
  dataCheckout: Date;
  numeroDiarias: number;
  valorDiaria: number;
  valorTotal: number;
  incluiCafeManha: boolean;
  status: 'pendente' | 'reservada' | 'confirmada' | 'cancelada' | 'concluida';
  numeroReserva?: string;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HospedagemCreationAttributes extends Optional<HospedagemAttributes, 'id' | 'status' | 'numeroReserva' | 'observacoes'> {}

class Hospedagem extends Model<HospedagemAttributes, HospedagemCreationAttributes> implements HospedagemAttributes {
  public id!: number;
  public solicitacaoId!: number;
  public nomeHotel!: string;
  public cidade!: string;
  public estado!: string;
  public dataCheckin!: Date;
  public dataCheckout!: Date;
  public numeroDiarias!: number;
  public valorDiaria!: number;
  public valorTotal!: number;
  public incluiCafeManha!: boolean;
  public status!: 'pendente' | 'reservada' | 'confirmada' | 'cancelada' | 'concluida';
  public numeroReserva?: string;
  public observacoes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Hospedagem.init(
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
    nomeHotel: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    dataCheckin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataCheckout: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numeroDiarias: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valorDiaria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    incluiCafeManha: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'reservada', 'confirmada', 'cancelada', 'concluida'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    numeroReserva: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'hospedagens',
    timestamps: true,
  }
);

Hospedagem.belongsTo(SolicitacaoViagem, { foreignKey: 'solicitacaoId', as: 'solicitacao' });
SolicitacaoViagem.hasMany(Hospedagem, { foreignKey: 'solicitacaoId', as: 'hospedagens' });

export default Hospedagem;

