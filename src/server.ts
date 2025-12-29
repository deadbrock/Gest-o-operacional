import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/database';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configuração de CORS para permitir frontend no Vercel
const allowedOrigins = [
  'http://localhost:3002',
  'http://localhost:3000',
  'http://127.0.0.1:3002',
  process.env.FRONTEND_URL,  // URL do Vercel (configurar no Railway)
].filter(Boolean);  // Remove undefined

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origem (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Permitir qualquer subdomínio do Vercel em desenvolvimento
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Verificar lista de origens permitidas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROTAS CUSTOMIZADAS (ANTES DO STATIC)
// ============================================

// Rota principal - Sempre inicia pelo login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Rota para o app principal
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rotas da API
app.use('/api', routes);

// ============================================
// ARQUIVOS ESTÁTICOS (DEPOIS DAS ROTAS)
// ============================================

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '../public'), {
  index: false // NÃO servir index.html automaticamente
}));

// Servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

