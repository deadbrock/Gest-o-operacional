import { connectDatabase } from '../config/database';
import User, { UserRole } from '../models/User';

async function createAdminUser() {
  try {
    console.log('🔧 Conectando ao banco de dados...');
    await connectDatabase();

    console.log('👤 Criando usuário administrador...');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({
      where: { email: 'admin@gestaoviagens.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe!');
      console.log('📧 Email: admin@gestaoviagens.com');
      process.exit(0);
    }

    // Criar usuário admin
    const admin = await User.create({
      nome: 'Administrador',
      email: 'admin@gestaoviagens.com',
      senha: 'admin123', // Será hasheado automaticamente
      role: UserRole.ADMIN,
      ativo: true,
    });

    console.log('\n✅ Usuário administrador criado com sucesso!');
    console.log('================================');
    console.log('📧 Email: admin@gestaoviagens.com');
    console.log('🔑 Senha: admin123');
    console.log('👑 Role: ADMIN');
    console.log('================================');
    console.log('\n⚠️  IMPORTANTE: Troque a senha após o primeiro login!\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  }
}

createAdminUser();

