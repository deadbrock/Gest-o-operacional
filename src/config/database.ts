import { Sequelize } from 'sequelize';
import path from 'path';

// Detectar ambiente: Railway (PostgreSQL) ou Local (SQLite)
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL; // Railway fornece automaticamente

let sequelize: Sequelize;

if (databaseUrl) {
  // Produção: PostgreSQL (Railway)
  console.log('🔵 Usando PostgreSQL (Produção)');
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Railway usa SSL
      }
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Desenvolvimento: SQLite (Local)
  console.log('🟡 Usando SQLite (Desenvolvimento)');
  const databasePath = process.env.DATABASE_PATH || './database.sqlite';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(databasePath),
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    }
  });
}

export { sequelize };

export const connectDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    
    if (force) {
      // Modo de desenvolvimento: recria todas as tabelas
      await sequelize.sync({ force: true });
      console.log('✅ Banco de dados recriado do zero!');
    } else {
      // Modo normal: apenas cria tabelas que não existem
      await sequelize.sync();
      console.log('✅ Modelos sincronizados com o banco de dados!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

