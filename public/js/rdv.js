// RDV - Despesas
async function loadRDV() {
    try {
        const despesas = await api.getDespesasRDV();
        renderRDVTable(despesas);
    } catch (error) {
        console.error('Erro ao carregar despesas RDV:', error);
        alert('Erro ao carregar despesas RDV');
    }
}

function renderRDVTable(despesas) {
    const container = document.getElementById('rdvTable');
    
    if (despesas.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Nenhuma despesa RDV cadastrada</p>';
        return;
    }
    
    const tipoLabels = {
        'cafe_manha': 'Café da Manhã',
        'almoco': 'Almoço',
        'jantar': 'Jantar',
        'lanche': 'Lanche',
        'transporte': 'Transporte',
        'outros': 'Outros',
    };
    
    const tipoIcons = {
        'cafe_manha': 'cup-hot',
        'almoco': 'bowl-rice',
        'jantar': 'egg-fried',
        'lanche': 'cookie',
        'transporte': 'car-front',
        'outros': 'three-dots',
    };
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    despesas.forEach(desp => {
        const statusColors = {
            'pendente': 'warning',
            'aprovada': 'success',
            'rejeitada': 'danger',
            'paga': 'primary',
        };
        
        html += `
            <tr>
                <td>${formatDate(desp.data)}</td>
                <td>
                    <i class="bi bi-${tipoIcons[desp.tipo]}"></i> ${tipoLabels[desp.tipo]}
                </td>
                <td>${desp.descricao || '-'}</td>
                <td><strong>${formatCurrency(desp.valor)}</strong></td>
                <td>
                    <span class="status-badge bg-${statusColors[desp.status]}">${desp.status.toUpperCase()}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editRDV(${desp.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${desp.status === 'pendente' ? `
                        <button class="btn btn-sm btn-success" onclick="aprovarRDV(${desp.id})">
                            <i class="bi bi-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rejeitarRDV(${desp.id})">
                            <i class="bi bi-x"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteRDV(${desp.id})">
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

async function showModalRDV(id = null) {
    const solicitacoes = await api.getSolicitacoes({ status: 'aprovada' });
    
    const modalHTML = `
        <div class="modal fade" id="modalRDV" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-cash-stack"></i> ${id ? 'Editar' : 'Nova'} Despesa RDV
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formRDV">
                            <div class="mb-3">
                                <label class="form-label">Solicitação de Viagem *</label>
                                <select class="form-select" id="solicitacaoId" required>
                                    <option value="">Selecione...</option>
                                    ${solicitacoes.map(s => `<option value="${s.id}">#${s.id} - ${s.colaborador?.nome} - ${s.destino}</option>`).join('')}
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data *</label>
                                    <input type="date" class="form-control" id="data" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tipo *</label>
                                    <select class="form-select" id="tipo" required>
                                        <option value="cafe_manha">Café da Manhã</option>
                                        <option value="almoco">Almoço</option>
                                        <option value="jantar">Jantar</option>
                                        <option value="lanche">Lanche</option>
                                        <option value="transporte">Transporte</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor *</label>
                                    <input type="number" class="form-control" id="valor" required step="0.01" min="0">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="status">
                                        <option value="pendente">Pendente</option>
                                        <option value="aprovada">Aprovada</option>
                                        <option value="rejeitada">Rejeitada</option>
                                        <option value="paga">Paga</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Descrição</label>
                                <input type="text" class="form-control" id="descricao">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Comprovante (URL)</label>
                                <input type="text" class="form-control" id="comprovante">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Observações</label>
                                <textarea class="form-control" id="observacoes" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveRDV(${id})">
                            <i class="bi bi-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('modalRDV');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalRDV'));
    modal.show();
    
    if (id) {
        loadRDVData(id);
    }
}

async function loadRDVData(id) {
    try {
        const desp = await api.getDespesaRDV(id);
        
        document.getElementById('solicitacaoId').value = desp.solicitacaoId;
        document.getElementById('data').value = desp.data.split('T')[0];
        document.getElementById('tipo').value = desp.tipo;
        document.getElementById('valor').value = desp.valor;
        document.getElementById('status').value = desp.status;
        document.getElementById('descricao').value = desp.descricao || '';
        document.getElementById('comprovante').value = desp.comprovante || '';
        document.getElementById('observacoes').value = desp.observacoes || '';
    } catch (error) {
        console.error('Erro ao carregar dados da despesa RDV:', error);
        alert('Erro ao carregar dados da despesa RDV');
    }
}

async function saveRDV(id) {
    const data = {
        solicitacaoId: parseInt(document.getElementById('solicitacaoId').value),
        data: document.getElementById('data').value,
        tipo: document.getElementById('tipo').value,
        valor: parseFloat(document.getElementById('valor').value),
        status: document.getElementById('status').value,
        descricao: document.getElementById('descricao').value,
        comprovante: document.getElementById('comprovante').value,
        observacoes: document.getElementById('observacoes').value,
    };
    
    try {
        if (id) {
            await api.updateDespesaRDV(id, data);
        } else {
            await api.createDespesaRDV(data);
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalRDV')).hide();
        loadRDV();
        alert(id ? 'Despesa RDV atualizada com sucesso!' : 'Despesa RDV cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar despesa RDV:', error);
        alert('Erro ao salvar despesa RDV');
    }
}

async function editRDV(id) {
    await showModalRDV(id);
}

async function aprovarRDV(id) {
    try {
        await api.aprovarDespesaRDV(id);
        loadRDV();
        alert('Despesa RDV aprovada com sucesso!');
    } catch (error) {
        console.error('Erro ao aprovar despesa RDV:', error);
        alert('Erro ao aprovar despesa RDV');
    }
}

async function rejeitarRDV(id) {
    const observacoes = prompt('Motivo da rejeição:');
    if (!observacoes) return;
    
    try {
        await api.rejeitarDespesaRDV(id, observacoes);
        loadRDV();
        alert('Despesa RDV rejeitada');
    } catch (error) {
        console.error('Erro ao rejeitar despesa RDV:', error);
        alert('Erro ao rejeitar despesa RDV');
    }
}

async function deleteRDV(id) {
    if (!confirm('Deseja realmente excluir esta despesa RDV?')) {
        return;
    }
    
    try {
        await api.deleteDespesaRDV(id);
        loadRDV();
        alert('Despesa RDV excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir despesa RDV:', error);
        alert('Erro ao excluir despesa RDV');
    }
}

