// Passagens
async function loadPassagens() {
    try {
        const passagens = await api.getPassagens();
        renderPassagensTable(passagens);
    } catch (error) {
        console.error('Erro ao carregar passagens:', error);
        alert('Erro ao carregar passagens');
    }
}

function renderPassagensTable(passagens) {
    const container = document.getElementById('passagensTable');
    
    if (passagens.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Nenhuma passagem cadastrada</p>';
        return;
    }
    
    const tipoIcons = {
        'aerea': 'airplane',
        'onibus': 'bus-front',
        'trem': 'train-front',
        'outro': 'geo-alt',
    };
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Companhia</th>
                        <th>Origem → Destino</th>
                        <th>Data Ida</th>
                        <th>Data Volta</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    passagens.forEach(pass => {
        html += `
            <tr>
                <td>
                    <i class="bi bi-${tipoIcons[pass.tipo]}"></i> ${pass.tipo.toUpperCase()}
                </td>
                <td>${pass.companhia}</td>
                <td><strong>${pass.origem} → ${pass.destino}</strong></td>
                <td>${formatDate(pass.dataIda)}</td>
                <td>${pass.dataVolta ? formatDate(pass.dataVolta) : '-'}</td>
                <td><strong>${formatCurrency(pass.valorTotal)}</strong></td>
                <td>
                    <span class="status-badge bg-info">${pass.status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editPassagem(${pass.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePassagem(${pass.id})">
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

async function showModalPassagem(id = null) {
    const solicitacoes = await api.getSolicitacoes({ status: 'aprovada' });
    
    const modalHTML = `
        <div class="modal fade" id="modalPassagem" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-ticket-perforated"></i> ${id ? 'Editar' : 'Nova'} Passagem
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formPassagem">
                            <div class="mb-3">
                                <label class="form-label">Solicitação de Viagem *</label>
                                <select class="form-select" id="solicitacaoId" required>
                                    <option value="">Selecione...</option>
                                    ${solicitacoes.map(s => `<option value="${s.id}">#${s.id} - ${s.colaborador?.nome} - ${s.destino}</option>`).join('')}
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tipo *</label>
                                    <select class="form-select" id="tipo" required>
                                        <option value="aerea">Aérea</option>
                                        <option value="onibus">Ônibus</option>
                                        <option value="trem">Trem</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Companhia *</label>
                                    <input type="text" class="form-control" id="companhia" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Origem *</label>
                                    <input type="text" class="form-control" id="origem" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Destino *</label>
                                    <input type="text" class="form-control" id="destino" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Ida *</label>
                                    <input type="date" class="form-control" id="dataIda" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Volta</label>
                                    <input type="date" class="form-control" id="dataVolta">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor Ida *</label>
                                    <input type="number" class="form-control" id="valorIda" required step="0.01" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor Volta</label>
                                    <input type="number" class="form-control" id="valorVolta" step="0.01" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor Total *</label>
                                    <input type="number" class="form-control" id="valorTotal" required step="0.01" min="0">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Número Voo/Poltrona</label>
                                    <input type="text" class="form-control" id="numeroVoo">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Localizador</label>
                                    <input type="text" class="form-control" id="localizador">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="status">
                                        <option value="pendente">Pendente</option>
                                        <option value="reservada">Reservada</option>
                                        <option value="emitida">Emitida</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="utilizada">Utilizada</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Observações</label>
                                <textarea class="form-control" id="observacoes" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="savePassagem(${id})">
                            <i class="bi bi-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('modalPassagem');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalPassagem'));
    modal.show();
    
    // Auto-calcular valor total
    document.getElementById('valorIda').addEventListener('input', calcularValorTotalPassagem);
    document.getElementById('valorVolta').addEventListener('input', calcularValorTotalPassagem);
    
    if (id) {
        loadPassagemData(id);
    }
}

function calcularValorTotalPassagem() {
    const valorIda = parseFloat(document.getElementById('valorIda').value) || 0;
    const valorVolta = parseFloat(document.getElementById('valorVolta').value) || 0;
    const valorTotal = valorIda + valorVolta;
    document.getElementById('valorTotal').value = valorTotal.toFixed(2);
}

async function loadPassagemData(id) {
    try {
        const pass = await api.getPassagem(id);
        
        document.getElementById('solicitacaoId').value = pass.solicitacaoId;
        document.getElementById('tipo').value = pass.tipo;
        document.getElementById('companhia').value = pass.companhia;
        document.getElementById('origem').value = pass.origem;
        document.getElementById('destino').value = pass.destino;
        document.getElementById('dataIda').value = pass.dataIda.split('T')[0];
        if (pass.dataVolta) {
            document.getElementById('dataVolta').value = pass.dataVolta.split('T')[0];
        }
        document.getElementById('valorIda').value = pass.valorIda;
        if (pass.valorVolta) {
            document.getElementById('valorVolta').value = pass.valorVolta;
        }
        document.getElementById('valorTotal').value = pass.valorTotal;
        document.getElementById('numeroVoo').value = pass.numeroVoo || '';
        document.getElementById('localizador').value = pass.localizador || '';
        document.getElementById('status').value = pass.status;
        document.getElementById('observacoes').value = pass.observacoes || '';
    } catch (error) {
        console.error('Erro ao carregar dados da passagem:', error);
        alert('Erro ao carregar dados da passagem');
    }
}

async function savePassagem(id) {
    const data = {
        solicitacaoId: parseInt(document.getElementById('solicitacaoId').value),
        tipo: document.getElementById('tipo').value,
        companhia: document.getElementById('companhia').value,
        origem: document.getElementById('origem').value,
        destino: document.getElementById('destino').value,
        dataIda: document.getElementById('dataIda').value,
        dataVolta: document.getElementById('dataVolta').value || null,
        valorIda: parseFloat(document.getElementById('valorIda').value),
        valorVolta: document.getElementById('valorVolta').value ? parseFloat(document.getElementById('valorVolta').value) : null,
        valorTotal: parseFloat(document.getElementById('valorTotal').value),
        numeroVoo: document.getElementById('numeroVoo').value,
        localizador: document.getElementById('localizador').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value,
    };
    
    try {
        if (id) {
            await api.updatePassagem(id, data);
        } else {
            await api.createPassagem(data);
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalPassagem')).hide();
        loadPassagens();
        alert(id ? 'Passagem atualizada com sucesso!' : 'Passagem cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar passagem:', error);
        alert('Erro ao salvar passagem');
    }
}

async function editPassagem(id) {
    await showModalPassagem(id);
}

async function deletePassagem(id) {
    if (!confirm('Deseja realmente excluir esta passagem?')) {
        return;
    }
    
    try {
        await api.deletePassagem(id);
        loadPassagens();
        alert('Passagem excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir passagem:', error);
        alert('Erro ao excluir passagem');
    }
}

