// Hospedagens
async function loadHospedagens() {
    try {
        const hospedagens = await api.getHospedagens();
        renderHospedagensTable(hospedagens);
    } catch (error) {
        console.error('Erro ao carregar hospedagens:', error);
        alert('Erro ao carregar hospedagens');
    }
}

function renderHospedagensTable(hospedagens) {
    const container = document.getElementById('hospedagensTable');
    
    if (hospedagens.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Nenhuma hospedagem cadastrada</p>';
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Hotel</th>
                        <th>Cidade</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Diárias</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    hospedagens.forEach(hosp => {
        html += `
            <tr>
                <td><strong>${hosp.nomeHotel}</strong></td>
                <td>${hosp.cidade}/${hosp.estado}</td>
                <td>${formatDate(hosp.dataCheckin)}</td>
                <td>${formatDate(hosp.dataCheckout)}</td>
                <td>${hosp.numeroDiarias}</td>
                <td><strong>${formatCurrency(hosp.valorTotal)}</strong></td>
                <td>
                    <span class="status-badge bg-info">${hosp.status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editHospedagem(${hosp.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHospedagem(${hosp.id})">
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

async function showModalHospedagem(id = null) {
    const solicitacoes = await api.getSolicitacoes({ status: 'aprovada' });
    
    const modalHTML = `
        <div class="modal fade" id="modalHospedagem" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-building"></i> ${id ? 'Editar' : 'Nova'} Hospedagem
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formHospedagem">
                            <div class="mb-3">
                                <label class="form-label">Solicitação de Viagem *</label>
                                <select class="form-select" id="solicitacaoId" required>
                                    <option value="">Selecione...</option>
                                    ${solicitacoes.map(s => `<option value="${s.id}">#${s.id} - ${s.colaborador?.nome} - ${s.destino}</option>`).join('')}
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label class="form-label">Nome do Hotel *</label>
                                    <input type="text" class="form-control" id="nomeHotel" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Número da Reserva</label>
                                    <input type="text" class="form-control" id="numeroReserva">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label class="form-label">Cidade *</label>
                                    <input type="text" class="form-control" id="cidade" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Estado *</label>
                                    <input type="text" class="form-control" id="estado" maxlength="2" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Check-in *</label>
                                    <input type="date" class="form-control" id="dataCheckin" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Check-out *</label>
                                    <input type="date" class="form-control" id="dataCheckout" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Número de Diárias *</label>
                                    <input type="number" class="form-control" id="numeroDiarias" required min="1">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor da Diária *</label>
                                    <input type="number" class="form-control" id="valorDiaria" required step="0.01" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor Total *</label>
                                    <input type="number" class="form-control" id="valorTotal" required step="0.01" min="0">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Inclui Café da Manhã?</label>
                                    <select class="form-select" id="incluiCafeManha">
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="status">
                                        <option value="pendente">Pendente</option>
                                        <option value="reservada">Reservada</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="concluida">Concluída</option>
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
                        <button type="button" class="btn btn-primary" onclick="saveHospedagem(${id})">
                            <i class="bi bi-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('modalHospedagem');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalHospedagem'));
    modal.show();
    
    // Auto-calcular valor total
    document.getElementById('numeroDiarias').addEventListener('input', calcularValorTotal);
    document.getElementById('valorDiaria').addEventListener('input', calcularValorTotal);
    
    if (id) {
        loadHospedagemData(id);
    }
}

function calcularValorTotal() {
    const diarias = parseFloat(document.getElementById('numeroDiarias').value) || 0;
    const valorDiaria = parseFloat(document.getElementById('valorDiaria').value) || 0;
    const valorTotal = diarias * valorDiaria;
    document.getElementById('valorTotal').value = valorTotal.toFixed(2);
}

async function loadHospedagemData(id) {
    try {
        const hosp = await api.getHospedagem(id);
        
        document.getElementById('solicitacaoId').value = hosp.solicitacaoId;
        document.getElementById('nomeHotel').value = hosp.nomeHotel;
        document.getElementById('numeroReserva').value = hosp.numeroReserva || '';
        document.getElementById('cidade').value = hosp.cidade;
        document.getElementById('estado').value = hosp.estado;
        document.getElementById('dataCheckin').value = hosp.dataCheckin.split('T')[0];
        document.getElementById('dataCheckout').value = hosp.dataCheckout.split('T')[0];
        document.getElementById('numeroDiarias').value = hosp.numeroDiarias;
        document.getElementById('valorDiaria').value = hosp.valorDiaria;
        document.getElementById('valorTotal').value = hosp.valorTotal;
        document.getElementById('incluiCafeManha').value = hosp.incluiCafeManha.toString();
        document.getElementById('status').value = hosp.status;
        document.getElementById('observacoes').value = hosp.observacoes || '';
    } catch (error) {
        console.error('Erro ao carregar dados da hospedagem:', error);
        alert('Erro ao carregar dados da hospedagem');
    }
}

async function saveHospedagem(id) {
    // Validar campos obrigatórios
    const solicitacaoIdValue = document.getElementById('solicitacaoId').value;
    const nomeHotel = document.getElementById('nomeHotel').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const dataCheckin = document.getElementById('dataCheckin').value;
    const dataCheckout = document.getElementById('dataCheckout').value;
    const numeroDiarias = document.getElementById('numeroDiarias').value;
    const valorDiaria = document.getElementById('valorDiaria').value;
    const valorTotal = document.getElementById('valorTotal').value;
    
    // Verificar se solicitação foi selecionada
    if (!solicitacaoIdValue || solicitacaoIdValue === '') {
        alert('⚠️ Por favor, selecione uma Solicitação de Viagem!');
        document.getElementById('solicitacaoId').focus();
        return;
    }
    
    // Verificar outros campos obrigatórios
    if (!nomeHotel || !cidade || !estado || !dataCheckin || !dataCheckout || !numeroDiarias || !valorDiaria || !valorTotal) {
        alert('⚠️ Por favor, preencha todos os campos obrigatórios (*)');
        return;
    }
    
    const data = {
        solicitacaoId: parseInt(solicitacaoIdValue),
        nomeHotel: nomeHotel.trim(),
        numeroReserva: document.getElementById('numeroReserva').value.trim() || null,
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        dataCheckin: dataCheckin,
        dataCheckout: dataCheckout,
        numeroDiarias: parseInt(numeroDiarias),
        valorDiaria: parseFloat(valorDiaria),
        valorTotal: parseFloat(valorTotal),
        incluiCafeManha: document.getElementById('incluiCafeManha').value === 'true',
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value.trim() || null,
    };
    
    // Validar se solicitacaoId é um número válido
    if (isNaN(data.solicitacaoId)) {
        alert('⚠️ ID da solicitação inválido!');
        return;
    }
    
    // Validar valores numéricos
    if (isNaN(data.numeroDiarias) || data.numeroDiarias < 1) {
        alert('⚠️ Número de diárias inválido!');
        return;
    }
    
    if (isNaN(data.valorDiaria) || data.valorDiaria < 0) {
        alert('⚠️ Valor da diária inválido!');
        return;
    }
    
    if (isNaN(data.valorTotal) || data.valorTotal < 0) {
        alert('⚠️ Valor total inválido!');
        return;
    }
    
    try {
        if (id) {
            await api.updateHospedagem(id, data);
        } else {
            await api.createHospedagem(data);
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalHospedagem')).hide();
        loadHospedagens();
        alert(id ? '✅ Hospedagem atualizada com sucesso!' : '✅ Hospedagem cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar hospedagem:', error);
        alert('❌ Erro ao salvar hospedagem: ' + (error.message || 'Erro desconhecido'));
    }
}

async function editHospedagem(id) {
    await showModalHospedagem(id);
}

async function deleteHospedagem(id) {
    if (!confirm('Deseja realmente excluir esta hospedagem?')) {
        return;
    }
    
    try {
        await api.deleteHospedagem(id);
        loadHospedagens();
        alert('Hospedagem excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir hospedagem:', error);
        alert('Erro ao excluir hospedagem');
    }
}

