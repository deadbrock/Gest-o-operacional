// Demo Data Generator for better UX on first load
async function checkAndPopulateDemoData() {
    try {
        const colaboradores = await api.getColaboradores();
        
        // If no data exists, offer to populate demo data
        if (colaboradores.length === 0) {
            showDemoDataPrompt();
        }
    } catch (error) {
        console.log('Could not check for demo data');
    }
}

function showDemoDataPrompt() {
    const promptDiv = document.createElement('div');
    promptDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 500px;
        text-align: center;
    `;
    
    promptDiv.innerHTML = `
        <div class="mb-4">
            <i class="bi bi-database-add text-primary" style="font-size: 64px;"></i>
        </div>
        <h4 class="mb-3">Bem-vindo ao Sistema!</h4>
        <p class="text-muted mb-4">
            Parece que você está começando. Gostaria de popular o sistema com dados de demonstração 
            para explorar as funcionalidades?
        </p>
        <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-outline-secondary" onclick="dismissDemoPrompt()">
                Não, obrigado
            </button>
            <button class="btn btn-primary" onclick="populateDemoData()">
                <i class="bi bi-magic"></i> Sim, popular dados
            </button>
        </div>
    `;
    
    const backdrop = document.createElement('div');
    backdrop.id = 'demoBackdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
        backdrop-filter: blur(4px);
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(promptDiv);
    promptDiv.id = 'demoPrompt';
}

function dismissDemoPrompt() {
    document.getElementById('demoPrompt')?.remove();
    document.getElementById('demoBackdrop')?.remove();
}

async function populateDemoData() {
    dismissDemoPrompt();
    showLoadingOverlay('Criando dados de demonstração...');
    
    try {
        // Create demo collaborators
        const colaboradores = [
            {
                nome: 'João Silva',
                email: 'joao.silva@empresa.com.br',
                cpf: '123.456.789-00',
                matricula: 'EMP001',
                cargo: 'Gerente de Vendas',
                departamento: 'Comercial',
                telefone: '(11) 98765-4321',
                ativo: true
            },
            {
                nome: 'Maria Santos',
                email: 'maria.santos@empresa.com.br',
                cpf: '987.654.321-00',
                matricula: 'EMP002',
                cargo: 'Analista de Marketing',
                departamento: 'Marketing',
                telefone: '(11) 98765-1234',
                ativo: true
            },
            {
                nome: 'Carlos Oliveira',
                email: 'carlos.oliveira@empresa.com.br',
                cpf: '456.789.123-00',
                matricula: 'EMP003',
                cargo: 'Diretor Comercial',
                departamento: 'Comercial',
                telefone: '(11) 98765-5678',
                ativo: true
            },
            {
                nome: 'Ana Costa',
                email: 'ana.costa@empresa.com.br',
                cpf: '321.654.987-00',
                matricula: 'EMP004',
                cargo: 'Coordenadora de RH',
                departamento: 'Recursos Humanos',
                telefone: '(11) 98765-8765',
                ativo: true
            },
            {
                nome: 'Pedro Almeida',
                email: 'pedro.almeida@empresa.com.br',
                cpf: '654.321.987-00',
                matricula: 'EMP005',
                cargo: 'Engenheiro de Projetos',
                departamento: 'Engenharia',
                telefone: '(11) 98765-4567',
                ativo: true
            }
        ];
        
        // Create collaborators
        const createdColaboradores = [];
        for (const colab of colaboradores) {
            const created = await api.createColaborador(colab);
            createdColaboradores.push(created);
            await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
        }
        
        // Create demo travel requests
        const hoje = new Date();
        const proximaSemana = new Date(hoje);
        proximaSemana.setDate(hoje.getDate() + 7);
        const proximoMes = new Date(hoje);
        proximoMes.setDate(hoje.getDate() + 30);
        
        const solicitacoes = [
            {
                colaboradorId: createdColaboradores[0].id,
                destino: 'São Paulo - SP',
                motivo: 'Reunião com cliente estratégico e apresentação de novos produtos',
                dataInicio: proximaSemana.toISOString().split('T')[0],
                dataFim: new Date(proximaSemana.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                centroCusto: 'CC-001',
                projeto: 'Expansão Regional',
                status: 'pendente'
            },
            {
                colaboradorId: createdColaboradores[1].id,
                destino: 'Rio de Janeiro - RJ',
                motivo: 'Evento de marketing e networking com parceiros',
                dataInicio: proximoMes.toISOString().split('T')[0],
                dataFim: new Date(proximoMes.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                centroCusto: 'CC-002',
                projeto: 'Marketing Digital',
                status: 'aprovada'
            },
            {
                colaboradorId: createdColaboradores[2].id,
                destino: 'Brasília - DF',
                motivo: 'Reunião estratégica com stakeholders e apresentação de resultados',
                dataInicio: new Date(hoje.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                dataFim: new Date(hoje.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                centroCusto: 'CC-001',
                status: 'aprovada'
            }
        ];
        
        for (const sol of solicitacoes) {
            await api.createSolicitacao(sol);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        hideLoadingOverlay();
        showToast('Dados de demonstração criados com sucesso! 🎉', 'success', 5000);
        
        // Reload dashboard
        setTimeout(() => {
            loadDashboard();
            refreshCurrentTab();
        }, 1000);
        
    } catch (error) {
        hideLoadingOverlay();
        console.error('Erro ao popular dados demo:', error);
        showToast('Erro ao criar dados de demonstração', 'error');
    }
}

// Check for demo data on load
setTimeout(() => {
    checkAndPopulateDemoData();
}, 2000);


