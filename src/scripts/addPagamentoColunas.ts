import { sequelize } from '../config/database';

async function addPagamentoColunas() {
  try {
    console.log('🔄 Verificando e adicionando colunas de pagamento...');

    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Adicionar colunas na tabela solicitacoes_viagem
    // Usando ADD COLUMN IF NOT EXISTS para não dar erro se já existir
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='solicitacoes_viagem' AND column_name='statusPagamento'
        ) THEN
          ALTER TABLE solicitacoes_viagem 
          ADD COLUMN "statusPagamento" VARCHAR(20) DEFAULT 'pendente';
        END IF;
      END $$;
    `);
    console.log('✅ Coluna statusPagamento verificada/adicionada');

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='solicitacoes_viagem' AND column_name='dataSolicitacaoPagamento'
        ) THEN
          ALTER TABLE solicitacoes_viagem 
          ADD COLUMN "dataSolicitacaoPagamento" TIMESTAMP;
        END IF;
      END $$;
    `);
    console.log('✅ Coluna dataSolicitacaoPagamento verificada/adicionada');

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='solicitacoes_viagem' AND column_name='dataPagamento'
        ) THEN
          ALTER TABLE solicitacoes_viagem 
          ADD COLUMN "dataPagamento" TIMESTAMP;
        END IF;
      END $$;
    `);
    console.log('✅ Coluna dataPagamento verificada/adicionada');

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='solicitacoes_viagem' AND column_name='metodoPagamento'
        ) THEN
          ALTER TABLE solicitacoes_viagem 
          ADD COLUMN "metodoPagamento" VARCHAR(100);
        END IF;
      END $$;
    `);
    console.log('✅ Coluna metodoPagamento verificada/adicionada');

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='solicitacoes_viagem' AND column_name='observacoesPagamento'
        ) THEN
          ALTER TABLE solicitacoes_viagem 
          ADD COLUMN "observacoesPagamento" TEXT;
        END IF;
      END $$;
    `);
    console.log('✅ Coluna observacoesPagamento verificada/adicionada');

    console.log('🎉 Migration concluída com sucesso!');
    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao executar migration:', error.message);
    // Não fazer exit(1) para não interromper o start do servidor
    console.log('⚠️  Continuando mesmo com erro na migration...');
    process.exit(0);
  }
}

addPagamentoColunas();

