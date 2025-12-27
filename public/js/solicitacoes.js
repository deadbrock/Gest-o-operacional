// Solicitações de Viagem
async function loadSolicitacoes() {
    try {
        const solicitacoes = await api.getSolicitacoes();
        renderSolicitacoesTable(solicitacoes);
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        alert('Erro ao carregar solicitações');
    }
}

function renderSolicitacoesTable(solicitacoes) {
    const container = document.getElementById('solicitacoesTable');
    
    if (solicitacoes.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Nenhuma solicitação cadastrada</p>';
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Colaborador</th>
                        <th>Destino</th>
                        <th>Período</th>
                        <th>Status</th>
                        <th>Custo Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    solicitacoes.forEach(sol => {
        const statusColors = {
            'pendente': 'warning',
            'aprovada': 'success',
            'rejeitada': 'danger',
            'em_andamento': 'info',
            'concluida': 'primary',
            'cancelada': 'secondary',
        };
        
        html += `
            <tr>
                <td><strong>#${sol.id}</strong></td>
                <td>${sol.colaborador?.nome || 'N/A'}</td>
                <td>${sol.destino}</td>
                <td>${formatDate(sol.dataInicio)} - ${formatDate(sol.dataFim)}</td>
                <td>
                    <span class="status-badge bg-${statusColors[sol.status]}">
                        ${sol.status.replace('_', ' ').toUpperCase()}
                    </span>
                </td>
                <td><strong>${formatCurrency(sol.custoTotal || 0)}</strong></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewSolicitacao(${sol.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editSolicitacao(${sol.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${sol.status === 'pendente' ? `
                        <button class="btn btn-sm btn-success" onclick="aprovarSolicitacao(${sol.id})">
                            <i class="bi bi-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rejeitarSolicitacao(${sol.id})">
                            <i class="bi bi-x"></i>
                        </button>
                    ` : ''}
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

async function showModalSolicitacao(id = null) {
    // Carregar colaboradores para o select
    const colaboradores = await api.getColaboradores({ ativo: true });
    
    const modalHTML = `
        <div class="modal fade" id="modalSolicitacao" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-file-text-fill"></i> ${id ? 'Editar' : 'Nova'} Solicitação de Viagem
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formSolicitacao">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Colaborador *</label>
                                    <select class="form-select" id="colaboradorId" required>
                                        <option value="">Selecione...</option>
                                        ${colaboradores.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Destino *</label>
                                    <input type="text" class="form-control" id="destino" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Início *</label>
                                    <input type="date" class="form-control" id="dataInicio" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Fim *</label>
                                    <input type="date" class="form-control" id="dataFim" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Centro de Custo *</label>
                                    <input type="text" class="form-control" id="centroCusto" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Projeto</label>
                                    <input type="text" class="form-control" id="projeto">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Motivo da Viagem *</label>
                                <textarea class="form-control" id="motivo" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Observações</label>
                                <textarea class="form-control" id="observacoes" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveSolicitacao(${id})">
                            <i class="bi bi-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('modalSolicitacao');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalSolicitacao'));
    modal.show();
    
    if (id) {
        loadSolicitacaoData(id);
    }
}

async function loadSolicitacaoData(id) {
    try {
        const sol = await api.getSolicitacao(id);
        
        document.getElementById('colaboradorId').value = sol.colaboradorId;
        document.getElementById('destino').value = sol.destino;
        document.getElementById('dataInicio').value = sol.dataInicio.split('T')[0];
        document.getElementById('dataFim').value = sol.dataFim.split('T')[0];
        document.getElementById('centroCusto').value = sol.centroCusto;
        document.getElementById('projeto').value = sol.projeto || '';
        document.getElementById('motivo').value = sol.motivo;
        document.getElementById('observacoes').value = sol.observacoes || '';
    } catch (error) {
        console.error('Erro ao carregar dados da solicitação:', error);
        alert('Erro ao carregar dados da solicitação');
    }
}

async function saveSolicitacao(id) {
    const data = {
        colaboradorId: parseInt(document.getElementById('colaboradorId').value),
        destino: document.getElementById('destino').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        centroCusto: document.getElementById('centroCusto').value,
        projeto: document.getElementById('projeto').value,
        motivo: document.getElementById('motivo').value,
        observacoes: document.getElementById('observacoes').value,
    };
    
    try {
        if (id) {
            await api.updateSolicitacao(id, data);
        } else {
            await api.createSolicitacao(data);
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalSolicitacao')).hide();
        loadSolicitacoes();
        alert(id ? 'Solicitação atualizada com sucesso!' : 'Solicitação cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar solicitação:', error);
        alert('Erro ao salvar solicitação');
    }
}

async function viewSolicitacao(id) {
    try {
        const sol = await api.getSolicitacao(id);
        
        const modalHTML = `
            <div class="modal fade" id="modalViewSolicitacao" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-eye"></i> Detalhes da Solicitação #${sol.id}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6><i class="bi bi-person"></i> Colaborador</h6>
                                    <p><strong>${sol.colaborador?.nome}</strong><br>
                                    ${sol.colaborador?.cargo} - ${sol.colaborador?.departamento}</p>
                                </div>
                                <div class="col-md-6">
                                    <h6><i class="bi bi-geo-alt"></i> Destino</h6>
                                    <p><strong>${sol.destino}</strong></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <h6><i class="bi bi-calendar"></i> Período</h6>
                                    <p>${formatDate(sol.dataInicio)} até ${formatDate(sol.dataFim)}</p>
                                </div>
                                <div class="col-md-6">
                                    <h6><i class="bi bi-wallet2"></i> Custo Total</h6>
                                    <p><strong class="text-primary">${formatCurrency(sol.custoTotal || 0)}</strong></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <h6><i class="bi bi-card-text"></i> Motivo</h6>
                                    <p>${sol.motivo}</p>
                                </div>
                            </div>
                            <hr>
                            <h6><i class="bi bi-list-ul"></i> Itens da Viagem</h6>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5 class="text-primary">${sol.hospedagens?.length || 0}</h5>
                                            <p class="mb-0">Hospedagens</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5 class="text-success">${sol.passagens?.length || 0}</h5>
                                            <p class="mb-0">Passagens</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h5 class="text-warning">${sol.despesasRDV?.length || 0}</h5>
                                            <p class="mb-0">Despesas RDV</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const oldModal = document.getElementById('modalViewSolicitacao');
        if (oldModal) oldModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('modalViewSolicitacao'));
        modal.show();
    } catch (error) {
        console.error('Erro ao visualizar solicitação:', error);
        alert('Erro ao visualizar solicitação');
    }
}

async function editSolicitacao(id) {
    await showModalSolicitacao(id);
}

async function aprovarSolicitacao(id) {
    const aprovadoPor = prompt('Nome do aprovador:');
    if (!aprovadoPor) return;
    
    try {
        await api.aprovarSolicitacao(id, aprovadoPor);
        loadSolicitacoes();
        alert('Solicitação aprovada com sucesso!');
    } catch (error) {
        console.error('Erro ao aprovar solicitação:', error);
        alert('Erro ao aprovar solicitação');
    }
}

async function rejeitarSolicitacao(id) {
    const observacoes = prompt('Motivo da rejeição:');
    if (!observacoes) return;
    
    try {
        await api.rejeitarSolicitacao(id, observacoes);
        loadSolicitacoes();
        alert('Solicitação rejeitada');
    } catch (error) {
        console.error('Erro ao rejeitar solicitação:', error);
        alert('Erro ao rejeitar solicitação');
    }
}

