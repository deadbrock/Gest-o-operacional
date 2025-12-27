import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcrypt';

export enum UserRole {
  COLABORADOR = 'colaborador',
  GESTOR = 'gestor',
  FINANCEIRO = 'financeiro',
  ADMIN = 'admin'
}

interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  colaboradorId?: number;
  departamento?: string;
  ativo: boolean;
  ultimoAcesso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'ativo' | 'colaboradorId' | 'departamento' | 'ultimoAcesso'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public role!: UserRole;
  public colaboradorId?: number;
  public departamento?: string;
  public ativo!: boolean;
  public ultimoAcesso?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para validar senha
  async validarSenha(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha);
  }

  // Método para verificar permissão
  hasPermission(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.COLABORADOR]: 1,
      [UserRole.GESTOR]: 2,
      [UserRole.FINANCEIRO]: 3,
      [UserRole.ADMIN]: 4,
    };
    
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }

  // Retornar user sem senha
  toJSON() {
    const values: any = { ...this.get() };
    delete values.senha;
    return values;
  }
}

User.init(
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
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.COLABORADOR,
    },
    colaboradorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'colaboradores',
        key: 'id',
      },
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ultimoAcesso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.senha) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
    },
  }
);

export default User;

