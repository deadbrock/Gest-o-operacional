import { connectDatabase } from '../config/database';

async function initDatabase() {
  try {
    console.log('🔧 Inicializando banco de dados...');
    console.log('⚠️  ATENÇÃO: Isso irá recriar todas as tabelas!');
    
    // Conectar e forçar recriação
    await connectDatabase(true);
    
    console.log('\n✅ Banco de dados inicializado com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. npm run create-admin    - Criar usuário administrador');
    console.log('   2. npm run seed-policies   - Popular políticas padrão');
    console.log('   3. npm run dev             - Iniciar servidor\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

initDatabase();

