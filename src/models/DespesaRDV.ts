import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import SolicitacaoViagem from './SolicitacaoViagem';

interface DespesaRDVAttributes {
  id: number;
  solicitacaoId: number;
  data: Date;
  tipo: 'cafe_manha' | 'almoco' | 'jantar' | 'lanche' | 'transporte' | 'outros';
  descricao?: string;
  valor: number;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'paga';
  comprovante?: string;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DespesaRDVCreationAttributes extends Optional<DespesaRDVAttributes, 'id' | 'descricao' | 'status' | 'comprovante' | 'observacoes'> {}

class DespesaRDV extends Model<DespesaRDVAttributes, DespesaRDVCreationAttributes> implements DespesaRDVAttributes {
  public id!: number;
  public solicitacaoId!: number;
  public data!: Date;
  public tipo!: 'cafe_manha' | 'almoco' | 'jantar' | 'lanche' | 'transporte' | 'outros';
  public descricao?: string;
  public valor!: number;
  public status!: 'pendente' | 'aprovada' | 'rejeitada' | 'paga';
  public comprovante?: string;
  public observacoes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DespesaRDV.init(
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
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('cafe_manha', 'almoco', 'jantar', 'lanche', 'transporte', 'outros'),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada', 'paga'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    comprovante: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'despesas_rdv',
    timestamps: true,
  }
);

DespesaRDV.belongsTo(SolicitacaoViagem, { foreignKey: 'solicitacaoId', as: 'solicitacao' });
SolicitacaoViagem.hasMany(DespesaRDV, { foreignKey: 'solicitacaoId', as: 'despesasRDV' });

export default DespesaRDV;

