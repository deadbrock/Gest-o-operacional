import { sequelize } from '../config/database';

async function addPagamentoColunas() {
  try {
    console.log('🔄 Adicionando colunas de pagamento...');

    // Adicionar colunas na tabela solicitacoes_viagem
    await sequelize.query(`
      ALTER TABLE solicitacoes_viagem 
      ADD COLUMN IF NOT EXISTS "statusPagamento" VARCHAR(20) DEFAULT 'pendente';
    `);
    console.log('✅ Coluna statusPagamento adicionada');

    await sequelize.query(`
      ALTER TABLE solicitacoes_viagem 
      ADD COLUMN IF NOT EXISTS "dataSolicitacaoPagamento" TIMESTAMP;
    `);
    console.log('✅ Coluna dataSolicitacaoPagamento adicionada');

    await sequelize.query(`
      ALTER TABLE solicitacoes_viagem 
      ADD COLUMN IF NOT EXISTS "dataPagamento" TIMESTAMP;
    `);
    console.log('✅ Coluna dataPagamento adicionada');

    await sequelize.query(`
      ALTER TABLE solicitacoes_viagem 
      ADD COLUMN IF NOT EXISTS "metodoPagamento" VARCHAR(100);
    `);
    console.log('✅ Coluna metodoPagamento adicionada');

    await sequelize.query(`
      ALTER TABLE solicitacoes_viagem 
      ADD COLUMN IF NOT EXISTS "observacoesPagamento" TEXT;
    `);
    console.log('✅ Coluna observacoesPagamento adicionada');

    console.log('🎉 Colunas de pagamento adicionadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao adicionar colunas:', error);
    process.exit(1);
  }
}

addPagamentoColunas();

