import { connectDatabase } from '../config/database';
import Policy, { PolicyType, PolicyScope } from '../models/Policy';

async function seedPolicies() {
  try {
    console.log('🔧 Conectando ao banco de dados...');
    await connectDatabase();

    console.log('📋 Criando políticas padrão...');

    const policies = [
      // Política Global de Hospedagem
      {
        nome: 'Política Global de Hospedagem',
        descricao: 'Limites padrão para hospedagem de todos os colaboradores',
        tipo: PolicyType.HOSPEDAGEM,
        scope: PolicyScope.GLOBAL,
        valorMaximoDiaria: 300.00,
        categoriaHotelMaxima: 4,
        permiteAirbnb: false,
        permiteExcecao: true,
        ativo: true,
        prioridade: 1,
      },
      // Política Global de Passagem Aérea
      {
        nome: 'Política Global de Passagem Aérea',
        descricao: 'Limites padrão para passagens aéreas',
        tipo: PolicyType.PASSAGEM_AEREA,
        scope: PolicyScope.GLOBAL,
        valorMaximoTotal: 1500.00,
        classVooPermitida: 'economica',
        antecedenciaMinimaDias: 7,
        permiteExcecao: true,
        ativo: true,
        prioridade: 1,
      },
      // Política Global de Alimentação
      {
        nome: 'Política Global de Alimentação',
        descricao: 'Limites padrão para despesas de alimentação',
        tipo: PolicyType.ALIMENTACAO,
        scope: PolicyScope.GLOBAL,
        valorMaximoRefeicao: 80.00,
        permiteExcecao: true,
        ativo: true,
        prioridade: 1,
      },
      // Política para Diretoria - Hospedagem
      {
        nome: 'Política de Hospedagem - Diretoria',
        descricao: 'Limites especiais para diretores',
        tipo: PolicyType.HOSPEDAGEM,
        scope: PolicyScope.CARGO,
        scopeValue: 'Diretor',
        valorMaximoDiaria: 600.00,
        categoriaHotelMaxima: 5,
        permiteAirbnb: true,
        permiteExcecao: true,
        ativo: true,
        prioridade: 3,
      },
      // Política para Diretoria - Passagem Aérea
      {
        nome: 'Política de Passagem - Diretoria',
        descricao: 'Limites especiais para passagens de diretores',
        tipo: PolicyType.PASSAGEM_AEREA,
        scope: PolicyScope.CARGO,
        scopeValue: 'Diretor',
        valorMaximoTotal: 3000.00,
        classVooPermitida: 'executiva',
        antecedenciaMinimaDias: 3,
        permiteExcecao: true,
        ativo: true,
        prioridade: 3,
      },
      // Política para Gerentes - Hospedagem
      {
        nome: 'Política de Hospedagem - Gerentes',
        descricao: 'Limites para gerentes',
        tipo: PolicyType.HOSPEDAGEM,
        scope: PolicyScope.CARGO,
        scopeValue: 'Gerente',
        valorMaximoDiaria: 400.00,
        categoriaHotelMaxima: 4,
        permiteAirbnb: false,
        permiteExcecao: true,
        ativo: true,
        prioridade: 2,
      },
      // Política de Transporte
      {
        nome: 'Política Global de Transporte',
        descricao: 'Limites para despesas de transporte local',
        tipo: PolicyType.TRANSPORTE,
        scope: PolicyScope.GLOBAL,
        valorMaximoDiaria: 100.00,
        observacoes: 'Inclui táxi, Uber, transporte público',
        permiteExcecao: true,
        ativo: true,
        prioridade: 1,
      },
    ];

    for (const policyData of policies) {
      const existing = await Policy.findOne({
        where: { 
          nome: policyData.nome,
        }
      });

      if (existing) {
        console.log(`⚠️  Política "${policyData.nome}" já existe. Pulando...`);
        continue;
      }

      await Policy.create(policyData);
      console.log(`✅ Política "${policyData.nome}" criada`);
    }

    console.log('\n🎉 Políticas criadas com sucesso!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao criar políticas:', error);
    process.exit(1);
  }
}

seedPolicies();

