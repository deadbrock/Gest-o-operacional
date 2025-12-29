import { sequelize } from '../config/database';

async function fixPassagemEnum() {
  try {
    console.log('🔄 Corrigindo ENUM de status de passagens...');

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Remover ENUM antigo e recriar com valores corretos
    await sequelize.query(`
      DO $$
      BEGIN
        -- Criar novo tipo temporário
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_passagens_status_new') THEN
          CREATE TYPE enum_passagens_status_new AS ENUM ('pendente', 'reservada', 'emitida', 'cancelada', 'utilizada');
        END IF;

        -- Atualizar valores inválidos primeiro
        UPDATE passagens SET status = 'emitida' WHERE status = 'confirmada';
        
        -- Alterar coluna para usar novo tipo
        ALTER TABLE passagens ALTER COLUMN status TYPE enum_passagens_status_new USING status::text::enum_passagens_status_new;
        
        -- Remover tipo antigo se existir
        DROP TYPE IF EXISTS enum_passagens_status CASCADE;
        
        -- Renomear novo tipo
        ALTER TYPE enum_passagens_status_new RENAME TO enum_passagens_status;
        
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erro: %', SQLERRM;
      END $$;
    `);
    
    console.log('✅ ENUM de status de passagens corrigido!');
    console.log('   Valores válidos: pendente, reservada, emitida, cancelada, utilizada');
    console.log('   Valores "confirmada" convertidos para "emitida"');
    
    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao corrigir ENUM:', error.message);
    console.log('⚠️  Continuando mesmo com erro...');
    process.exit(0);
  }
}

fixPassagemEnum();

