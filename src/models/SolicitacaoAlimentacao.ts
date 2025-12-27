import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import SolicitacaoViagem from './SolicitacaoViagem';
import Colaborador from './Colaborador';

interface SolicitacaoAlimentacaoAttributes {
  id: number;
  solicitacaoViagemId: number;
  colaboradorId: number;
  dataInicio: Date;
  dataFim: Date;
  numeroDias: number;
  
  // Quantidade de refeições
  qtdCafeManha: number;
  qtdAlmoco: number;
  qtdJantar: number;
  qtdLanche: number;
  
  // Valores unitários
  valorCafeManha: number;
  valorAlmoco: number;
  valorJantar: number;
  valorLanche: number;
  
  // Totais
  totalCafeManha: number;
  totalAlmoco: number;
  totalJantar: number;
  totalLanche: number;
  valorTotal: number;
  
  // Controle
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'paga' | 'cancelada';
  justificativa?: string;
  aprovadoPor?: string;
  dataAprovacao?: Date;
  observacoes?: string;
  
  // Pagamento
  formaPagamento?: 'adiantamento' | 'reembolso' | 'cartao_corporativo';
  dataPagamento?: Date;
  comprovantePagamento?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

interface SolicitacaoAlimentacaoCreationAttributes 
  extends Optional<SolicitacaoAlimentacaoAttributes, 
    'id' | 'status' | 'justificativa' | 'aprovadoPor' | 'dataAprovacao' | 
    'observacoes' | 'formaPagamento' | 'dataPagamento' | 'comprovantePagamento'> {}

class SolicitacaoAlimentacao extends Model<SolicitacaoAlimentacaoAttributes, SolicitacaoAlimentacaoCreationAttributes> 
  implements SolicitacaoAlimentacaoAttributes {
  public id!: number;
  public solicitacaoViagemId!: number;
  public colaboradorId!: number;
  public dataInicio!: Date;
  public dataFim!: Date;
  public numeroDias!: number;
  
  public qtdCafeManha!: number;
  public qtdAlmoco!: number;
  public qtdJantar!: number;
  public qtdLanche!: number;
  
  public valorCafeManha!: number;
  public valorAlmoco!: number;
  public valorJantar!: number;
  public valorLanche!: number;
  
  public totalCafeManha!: number;
  public totalAlmoco!: number;
  public totalJantar!: number;
  public totalLanche!: number;
  public valorTotal!: number;
  
  public status!: 'pendente' | 'aprovada' | 'rejeitada' | 'paga' | 'cancelada';
  public justificativa?: string;
  public aprovadoPor?: string;
  public dataAprovacao?: Date;
  public observacoes?: string;
  
  public formaPagamento?: 'adiantamento' | 'reembolso' | 'cartao_corporativo';
  public dataPagamento?: Date;
  public comprovantePagamento?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SolicitacaoAlimentacao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    solicitacaoViagemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'solicitacoes_viagem',
        key: 'id',
      },
    },
    colaboradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaboradores',
        key: 'id',
      },
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numeroDias: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qtdCafeManha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qtdAlmoco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qtdJantar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qtdLanche: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    valorCafeManha: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 25.00,
    },
    valorAlmoco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 45.00,
    },
    valorJantar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 45.00,
    },
    valorLanche: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 15.00,
    },
    totalCafeManha: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalAlmoco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalJantar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalLanche: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada', 'paga', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    justificativa: {
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
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    formaPagamento: {
      type: DataTypes.ENUM('adiantamento', 'reembolso', 'cartao_corporativo'),
      allowNull: true,
    },
    dataPagamento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    comprovantePagamento: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'solicitacoes_alimentacao',
    timestamps: true,
    hooks: {
      beforeSave: (solicitacao) => {
        // Calcular totais automaticamente
        solicitacao.totalCafeManha = solicitacao.qtdCafeManha * parseFloat(solicitacao.valorCafeManha.toString());
        solicitacao.totalAlmoco = solicitacao.qtdAlmoco * parseFloat(solicitacao.valorAlmoco.toString());
        solicitacao.totalJantar = solicitacao.qtdJantar * parseFloat(solicitacao.valorJantar.toString());
        solicitacao.totalLanche = solicitacao.qtdLanche * parseFloat(solicitacao.valorLanche.toString());
        
        solicitacao.valorTotal = 
          solicitacao.totalCafeManha + 
          solicitacao.totalAlmoco + 
          solicitacao.totalJantar + 
          solicitacao.totalLanche;
      },
    },
  }
);

SolicitacaoAlimentacao.belongsTo(SolicitacaoViagem, { foreignKey: 'solicitacaoViagemId', as: 'solicitacaoViagem' });
SolicitacaoAlimentacao.belongsTo(Colaborador, { foreignKey: 'colaboradorId', as: 'colaborador' });

SolicitacaoViagem.hasMany(SolicitacaoAlimentacao, { foreignKey: 'solicitacaoViagemId', as: 'solicitacoesAlimentacao' });
Colaborador.hasMany(SolicitacaoAlimentacao, { foreignKey: 'colaboradorId', as: 'solicitacoesAlimentacao' });

export default SolicitacaoAlimentacao;

