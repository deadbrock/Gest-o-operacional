import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/database';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api', routes);

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.error('❌ Falha ao conectar ao banco de dados. Encerrando...');
      process.exit(1);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log('   Sistema de Gestão de Viagens Corporativas');
      console.log('   ========================================');
      console.log(`   🌐 Servidor rodando na porta ${PORT}`);
      console.log(`   📊 Dashboard: http://localhost:${PORT}`);
      console.log(`   🔌 API: http://localhost:${PORT}/api`);
      console.log(`   📝 Status: http://localhost:${PORT}/api/status`);
      console.log('   ========================================\n');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

