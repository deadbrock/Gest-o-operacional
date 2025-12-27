import { Sequelize } from 'sequelize';
import path from 'path';

const databasePath = process.env.DATABASE_PATH || './database.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(databasePath),
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  }
});

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

