// Colaboradores
async function loadColaboradores() {
    try {
        const colaboradores = await api.getColaboradores();
        renderColaboradoresTable(colaboradores);
    } catch (error) {
        console.error('Erro ao carregar colaboradores:', error);
        alert('Erro ao carregar colaboradores');
    }
}

function renderColaboradoresTable(colaboradores) {
    const container = document.getElementById('colaboradoresTable');
    
    if (colaboradores.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-people" style="font-size: 80px; color: var(--gray-300);"></i>
                </div>
                <h5 class="text-muted mb-3">Nenhum colaborador cadastrado</h5>
                <p class="text-muted mb-4">Comece adicionando seu primeiro colaborador ao sistema</p>
                <button class="btn btn-primary btn-custom" onclick="showModalColaborador()">
                    <i class="bi bi-plus-circle"></i> Adicionar Primeiro Colaborador
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Cargo</th>
                        <th>Departamento</th>
                        <th>Matrícula</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    colaboradores.forEach(colab => {
        html += `
            <tr>
                <td><strong>${colab.nome}</strong></td>
                <td>${colab.email}</td>
                <td>${colab.cpf}</td>
                <td>${colab.cargo}</td>
                <td>${colab.departamento}</td>
                <td>${colab.matricula}</td>
                <td>
                    <span class="status-badge ${colab.ativo ? 'bg-success' : 'bg-danger'}">
                        ${colab.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editColaborador(${colab.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteColaborador(${colab.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function showModalColaborador(id = null) {
    const modalHTML = `
        <div class="modal fade" id="modalColaborador" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-person-plus"></i> ${id ? 'Editar' : 'Novo'} Colaborador
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formColaborador">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nome *</label>
                                    <input type="text" class="form-control" id="nome" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">CPF *</label>
                                    <input type="text" class="form-control" id="cpf" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Matrícula *</label>
                                    <input type="text" class="form-control" id="matricula" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Cargo *</label>
                                    <input type="text" class="form-control" id="cargo" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Departamento *</label>
                                    <input type="text" class="form-control" id="departamento" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Telefone</label>
                                    <input type="text" class="form-control" id="telefone">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="ativo">
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveColaborador(${id})">
                            <i class="bi bi-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior se existir
    const oldModal = document.getElementById('modalColaborador');
    if (oldModal) oldModal.remove();
    
    // Adicionar novo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalColaborador'));
    modal.show();
    
    // Se for edição, carregar dados
    if (id) {
        loadColaboradorData(id);
    }
}

async function loadColaboradorData(id) {
    try {
        const colab = await api.getColaborador(id);
        
        document.getElementById('nome').value = colab.nome;
        document.getElementById('email').value = colab.email;
        document.getElementById('cpf').value = colab.cpf;
        document.getElementById('matricula').value = colab.matricula;
        document.getElementById('cargo').value = colab.cargo;
        document.getElementById('departamento').value = colab.departamento;
        document.getElementById('telefone').value = colab.telefone || '';
        document.getElementById('ativo').value = colab.ativo.toString();
    } catch (error) {
        console.error('Erro ao carregar dados do colaborador:', error);
        alert('Erro ao carregar dados do colaborador');
    }
}

async function saveColaborador(id) {
    const data = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        matricula: document.getElementById('matricula').value,
        cargo: document.getElementById('cargo').value,
        departamento: document.getElementById('departamento').value,
        telefone: document.getElementById('telefone').value,
        ativo: document.getElementById('ativo').value === 'true',
    };
    
    try {
        showLoadingOverlay(id ? 'Atualizando colaborador...' : 'Cadastrando colaborador...');
        
        if (id) {
            await api.updateColaborador(id, data);
        } else {
            await api.createColaborador(data);
        }
        
        hideLoadingOverlay();
        bootstrap.Modal.getInstance(document.getElementById('modalColaborador')).hide();
        loadColaboradores();
        showToast(
            id ? 'Colaborador atualizado com sucesso!' : 'Colaborador cadastrado com sucesso!', 
            'success'
        );
    } catch (error) {
        hideLoadingOverlay();
        console.error('Erro ao salvar colaborador:', error);
        showToast('Erro ao salvar colaborador. Verifique os dados e tente novamente.', 'error');
    }
}

async function editColaborador(id) {
    showModalColaborador(id);
}

async function deleteColaborador(id) {
    showConfirmDialog(
        'Esta ação não pode ser desfeita. O colaborador será permanentemente removido do sistema.',
        async () => {
            try {
                showLoadingOverlay('Excluindo colaborador...');
                await api.deleteColaborador(id);
                hideLoadingOverlay();
                loadColaboradores();
                showToast('Colaborador excluído com sucesso!', 'success');
            } catch (error) {
                hideLoadingOverlay();
                console.error('Erro ao excluir colaborador:', error);
                showToast('Erro ao excluir colaborador. Tente novamente.', 'error');
            }
        }
    );
}

