import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ColaboradorAttributes {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  departamento: string;
  matricula: string;
  telefone?: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ColaboradorCreationAttributes extends Optional<ColaboradorAttributes, 'id' | 'ativo' | 'telefone'> {}

class Colaborador extends Model<ColaboradorAttributes, ColaboradorCreationAttributes> implements ColaboradorAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public cpf!: string;
  public cargo!: string;
  public departamento!: string;
  public matricula!: string;
  public telefone?: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Colaborador.init(
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'colaboradores',
    timestamps: true,
  }
);

export default Colaborador;

