// Solicitações de Alimentação
async function loadAlimentacao() {
    try {
        const solicitacoes = await api.getSolicitacoesAlimentacao();
        renderAlimentacaoStats(solicitacoes);
        renderAlimentacaoTable(solicitacoes);
    } catch (error) {
        console.error('Erro ao carregar solicitações de alimentação:', error);
        showToast('Erro ao carregar solicitações de alimentação', 'error');
    }
}

function renderAlimentacaoStats(solicitacoes) {
    const container = document.getElementById('alimentacaoStats');
    
    // Calcular estatísticas
    const stats = {
        pendentes: solicitacoes.filter(s => s.status === 'pendente').length,
        aprovadas: solicitacoes.filter(s => s.status === 'aprovada').length,
        pagas: solicitacoes.filter(s => s.status === 'paga').length,
        valorTotal: solicitacoes.reduce((sum, s) => sum + parseFloat(s.valorTotal || 0), 0),
        valorPendente: solicitacoes
            .filter(s => s.status === 'pendente')
            .reduce((sum, s) => sum + parseFloat(s.valorTotal || 0), 0),
        valorAprovado: solicitacoes
            .filter(s => s.status === 'aprovada')
            .reduce((sum, s) => sum + parseFloat(s.valorTotal || 0), 0),
    };
    
    container.innerHTML = `
        <div class="col-md-3">
            <div class="card border-warning">
                <div class="card-body text-center">
                    <i class="bi bi-clock-history text-warning" style="font-size: 2rem;"></i>
                    <h4 class="mt-2 mb-0">${stats.pendentes}</h4>
                    <p class="text-muted mb-1">Pendentes</p>
                    <small class="text-muted">${formatCurrency(stats.valorPendente)}</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-success">
                <div class="card-body text-center">
                    <i class="bi bi-check-circle text-success" style="font-size: 2rem;"></i>
                    <h4 class="mt-2 mb-0">${stats.aprovadas}</h4>
                    <p class="text-muted mb-1">Aprovadas</p>
                    <small class="text-muted">${formatCurrency(stats.valorAprovado)}</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-primary">
                <div class="card-body text-center">
                    <i class="bi bi-cash-coin text-primary" style="font-size: 2rem;"></i>
                    <h4 class="mt-2 mb-0">${stats.pagas}</h4>
                    <p class="text-muted mb-1">Pagas</p>
                    <small class="text-muted">Pagamentos realizados</small>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-info">
                <div class="card-body text-center">
                    <i class="bi bi-wallet2 text-info" style="font-size: 2rem;"></i>
                    <h4 class="mt-2 mb-0">${formatCurrency(stats.valorTotal)}</h4>
                    <p class="text-muted mb-1">Total Geral</p>
                    <small class="text-muted">Todas solicitações</small>
                </div>
            </div>
        </div>
    `;
}

function renderAlimentacaoTable(solicitacoes) {
    const container = document.getElementById('alimentacaoTable');
    
    if (solicitacoes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-cup-hot" style="font-size: 80px; color: var(--gray-300);"></i>
                </div>
                <h5 class="text-muted mb-3">Nenhuma solicitação de alimentação cadastrada</h5>
                <p class="text-muted mb-4">Crie sua primeira solicitação vinculada a uma viagem</p>
                <button class="btn btn-primary btn-custom" onclick="showModalAlimentacao()">
                    <i class="bi bi-plus-circle"></i> Criar Primeira Solicitação
                </button>
            </div>
        `;
        return;
    }
    
    const statusColors = {
        'pendente': 'warning',
        'aprovada': 'success',
        'rejeitada': 'danger',
        'paga': 'primary',
        'cancelada': 'secondary',
    };
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Colaborador</th>
                        <th>Viagem</th>
                        <th>Período</th>
                        <th>Dias</th>
                        <th>Refeições</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    solicitacoes.forEach(sol => {
        const totalRefeicoes = sol.qtdCafeManha + sol.qtdAlmoco + sol.qtdJantar + sol.qtdLanche;
        
        html += `
            <tr>
                <td><strong>#${sol.id}</strong></td>
                <td>
                    <strong>${sol.colaborador?.nome || 'N/A'}</strong><br>
                    <small class="text-muted">${sol.colaborador?.departamento || ''}</small>
                </td>
                <td>
                    <small>${sol.solicitacaoViagem?.destino || 'N/A'}</small>
                </td>
                <td>
                    <small>${formatDate(sol.dataInicio)}<br>até ${formatDate(sol.dataFim)}</small>
                </td>
                <td class="text-center">
                    <span class="badge bg-secondary">${sol.numeroDias}</span>
                </td>
                <td>
                    <div class="d-flex gap-1" style="font-size: 0.8rem;">
                        ${sol.qtdCafeManha > 0 ? `<span class="badge bg-info" title="Café">☕ ${sol.qtdCafeManha}</span>` : ''}
                        ${sol.qtdAlmoco > 0 ? `<span class="badge bg-warning" title="Almoço">🍽️ ${sol.qtdAlmoco}</span>` : ''}
                        ${sol.qtdJantar > 0 ? `<span class="badge bg-danger" title="Jantar">🌙 ${sol.qtdJantar}</span>` : ''}
                        ${sol.qtdLanche > 0 ? `<span class="badge bg-success" title="Lanche">🥐 ${sol.qtdLanche}</span>` : ''}
                    </div>
                </td>
                <td><strong class="text-primary">${formatCurrency(sol.valorTotal)}</strong></td>
                <td>
                    <span class="status-badge bg-${statusColors[sol.status]}">
                        ${sol.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-info" onclick="viewAlimentacao(${sol.id})" 
                                data-bs-toggle="tooltip" title="Visualizar">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${sol.status === 'pendente' ? `
                            <button class="btn btn-primary" onclick="editAlimentacao(${sol.id})"
                                    data-bs-toggle="tooltip" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-success" onclick="aprovarAlimentacao(${sol.id})"
                                    data-bs-toggle="tooltip" title="Aprovar">
                                <i class="bi bi-check"></i>
                            </button>
                            <button class="btn btn-danger" onclick="rejeitarAlimentacao(${sol.id})"
                                    data-bs-toggle="tooltip" title="Rejeitar">
                                <i class="bi bi-x"></i>
                            </button>
                        ` : ''}
                        ${sol.status === 'aprovada' ? `
                            <button class="btn btn-success" onclick="pagarAlimentacao(${sol.id})"
                                    data-bs-toggle="tooltip" title="Marcar como paga">
                                <i class="bi bi-cash"></i>
                            </button>
                        ` : ''}
                    </div>
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
    
    // Reinitialize tooltips
    initializeTooltips();
}

async function showModalAlimentacao(id = null) {
    const solicitacoesViagem = await api.getSolicitacoes({ status: 'aprovada' });
    const colaboradores = await api.getColaboradores({ ativo: true });
    
    const modalHTML = `
        <div class="modal fade" id="modalAlimentacao" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-cup-hot-fill"></i> ${id ? 'Editar' : 'Nova'} Solicitação de Alimentação
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAlimentacao">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Solicitação de Viagem *</label>
                                    <select class="form-select" id="solicitacaoViagemId" required onchange="calcularValoresAutomaticos()">
                                        <option value="">Selecione uma viagem aprovada...</option>
                                        ${solicitacoesViagem.map(s => `
                                            <option value="${s.id}" 
                                                    data-colaborador-id="${s.colaboradorId}"
                                                    data-data-inicio="${s.dataInicio}"
                                                    data-data-fim="${s.dataFim}">
                                                #${s.id} - ${s.colaborador?.nome} - ${s.destino}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <small class="text-muted">As datas e colaborador serão preenchidos automaticamente</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Colaborador</label>
                                    <input type="text" class="form-control" id="colaboradorNome" readonly>
                                    <input type="hidden" id="colaboradorId">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Data Início</label>
                                    <input type="date" class="form-control" id="dataInicio" readonly>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Data Fim</label>
                                    <input type="date" class="form-control" id="dataFim" readonly>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Número de Dias</label>
                                    <input type="number" class="form-control" id="numeroDias" readonly>
                                </div>
                            </div>
                            
                            <hr class="my-4">
                            <h6 class="mb-3"><i class="bi bi-calculator"></i> Cálculo de Refeições</h6>
                            
                            <!-- Café da Manhã -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-3">
                                            <label class="form-label">☕ Café da Manhã</label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Quantidade</label>
                                            <input type="number" class="form-control" id="qtdCafeManha" min="0" value="0" onchange="calcularTotais()">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Valor Unitário</label>
                                            <div class="input-group">
                                                <span class="input-group-text">R$</span>
                                                <input type="number" class="form-control" id="valorCafeManha" step="0.01" value="25.00" onchange="calcularTotais()">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Total</label>
                                            <input type="text" class="form-control fw-bold" id="totalCafeManha" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Almoço -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-3">
                                            <label class="form-label">🍽️ Almoço</label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Quantidade</label>
                                            <input type="number" class="form-control" id="qtdAlmoco" min="0" value="0" onchange="calcularTotais()">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Valor Unitário</label>
                                            <div class="input-group">
                                                <span class="input-group-text">R$</span>
                                                <input type="number" class="form-control" id="valorAlmoco" step="0.01" value="45.00" onchange="calcularTotais()">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Total</label>
                                            <input type="text" class="form-control fw-bold" id="totalAlmoco" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Jantar -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-3">
                                            <label class="form-label">🌙 Jantar</label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Quantidade</label>
                                            <input type="number" class="form-control" id="qtdJantar" min="0" value="0" onchange="calcularTotais()">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Valor Unitário</label>
                                            <div class="input-group">
                                                <span class="input-group-text">R$</span>
                                                <input type="number" class="form-control" id="valorJantar" step="0.01" value="45.00" onchange="calcularTotais()">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Total</label>
                                            <input type="text" class="form-control fw-bold" id="totalJantar" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Lanche -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-3">
                                            <label class="form-label">🥐 Lanche/Outros</label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Quantidade</label>
                                            <input type="number" class="form-control" id="qtdLanche" min="0" value="0" onchange="calcularTotais()">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Valor Unitário</label>
                                            <div class="input-group">
                                                <span class="input-group-text">R$</span>
                                                <input type="number" class="form-control" id="valorLanche" step="0.01" value="15.00" onchange="calcularTotais()">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Total</label>
                                            <input type="text" class="form-control fw-bold" id="totalLanche" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-info d-flex justify-content-between align-items-center">
                                <strong><i class="bi bi-info-circle"></i> VALOR TOTAL DA SOLICITAÇÃO</strong>
                                <h3 class="mb-0 text-primary" id="valorTotalSolicitacao">R$ 0,00</h3>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Justificativa</label>
                                    <textarea class="form-control" id="justificativa" rows="2" 
                                              placeholder="Descreva o motivo e necessidade das despesas de alimentação"></textarea>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Forma de Pagamento</label>
                                    <select class="form-select" id="formaPagamento">
                                        <option value="adiantamento">Adiantamento</option>
                                        <option value="reembolso">Reembolso</option>
                                        <option value="cartao_corporativo">Cartão Corporativo</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Observações</label>
                                    <textarea class="form-control" id="observacoes" rows="2"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveAlimentacao(${id})">
                            <i class="bi bi-save"></i> Salvar Solicitação
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('modalAlimentacao');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('modalAlimentacao'));
    modal.show();
    
    if (id) {
        loadAlimentacaoData(id);
    }
}

async function calcularValoresAutomaticos() {
    const select = document.getElementById('solicitacaoViagemId');
    const option = select.options[select.selectedIndex];
    
    if (!option.value) return;
    
    const colaboradorId = option.dataset.colaboradorId;
    const dataInicio = option.dataset.dataInicio;
    const dataFim = option.dataset.dataFim;
    
    // Preencher colaborador
    const colaborador = await api.getColaborador(colaboradorId);
    document.getElementById('colaboradorId').value = colaboradorId;
    document.getElementById('colaboradorNome').value = colaborador.nome;
    
    // Preencher datas
    document.getElementById('dataInicio').value = dataInicio.split('T')[0];
    document.getElementById('dataFim').value = dataFim.split('T')[0];
    
    // Calcular dias
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = Math.abs(fim - inicio);
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('numeroDias').value = dias;
    
    // Sugerir quantidades (todas as refeições por padrão)
    document.getElementById('qtdCafeManha').value = dias;
    document.getElementById('qtdAlmoco').value = dias;
    document.getElementById('qtdJantar').value = dias;
    document.getElementById('qtdLanche').value = Math.floor(dias / 2);
    
    calcularTotais();
}

function calcularTotais() {
    const qtdCafe = parseInt(document.getElementById('qtdCafeManha').value) || 0;
    const valorCafe = parseFloat(document.getElementById('valorCafeManha').value) || 0;
    const totalCafe = qtdCafe * valorCafe;
    
    const qtdAlmoco = parseInt(document.getElementById('qtdAlmoco').value) || 0;
    const valorAlmoco = parseFloat(document.getElementById('valorAlmoco').value) || 0;
    const totalAlmoco = qtdAlmoco * valorAlmoco;
    
    const qtdJantar = parseInt(document.getElementById('qtdJantar').value) || 0;
    const valorJantar = parseFloat(document.getElementById('valorJantar').value) || 0;
    const totalJantar = qtdJantar * valorJantar;
    
    const qtdLanche = parseInt(document.getElementById('qtdLanche').value) || 0;
    const valorLanche = parseFloat(document.getElementById('valorLanche').value) || 0;
    const totalLanche = qtdLanche * valorLanche;
    
    document.getElementById('totalCafeManha').value = formatCurrency(totalCafe);
    document.getElementById('totalAlmoco').value = formatCurrency(totalAlmoco);
    document.getElementById('totalJantar').value = formatCurrency(totalJantar);
    document.getElementById('totalLanche').value = formatCurrency(totalLanche);
    
    const total = totalCafe + totalAlmoco + totalJantar + totalLanche;
    document.getElementById('valorTotalSolicitacao').textContent = formatCurrency(total);
}

async function saveAlimentacao(id) {
    const data = {
        solicitacaoViagemId: parseInt(document.getElementById('solicitacaoViagemId').value),
        colaboradorId: parseInt(document.getElementById('colaboradorId').value),
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        numeroDias: parseInt(document.getElementById('numeroDias').value),
        qtdCafeManha: parseInt(document.getElementById('qtdCafeManha').value) || 0,
        qtdAlmoco: parseInt(document.getElementById('qtdAlmoco').value) || 0,
        qtdJantar: parseInt(document.getElementById('qtdJantar').value) || 0,
        qtdLanche: parseInt(document.getElementById('qtdLanche').value) || 0,
        valorCafeManha: parseFloat(document.getElementById('valorCafeManha').value),
        valorAlmoco: parseFloat(document.getElementById('valorAlmoco').value),
        valorJantar: parseFloat(document.getElementById('valorJantar').value),
        valorLanche: parseFloat(document.getElementById('valorLanche').value),
        justificativa: document.getElementById('justificativa').value,
        formaPagamento: document.getElementById('formaPagamento').value,
        observacoes: document.getElementById('observacoes').value,
    };
    
    try {
        showLoadingOverlay(id ? 'Atualizando solicitação...' : 'Criando solicitação...');
        
        if (id) {
            await api.updateSolicitacaoAlimentacao(id, data);
        } else {
            await api.createSolicitacaoAlimentacao(data);
        }
        
        hideLoadingOverlay();
        bootstrap.Modal.getInstance(document.getElementById('modalAlimentacao')).hide();
        loadAlimentacao();
        showToast(
            id ? 'Solicitação atualizada com sucesso!' : 'Solicitação criada com sucesso!',
            'success'
        );
    } catch (error) {
        hideLoadingOverlay();
        console.error('Erro ao salvar solicitação:', error);
        showToast('Erro ao salvar solicitação. Verifique os dados e tente novamente.', 'error');
    }
}

async function aprovarAlimentacao(id) {
    const aprovadoPor = prompt('Nome do aprovador:');
    if (!aprovadoPor) return;
    
    try {
        showLoadingOverlay('Aprovando solicitação...');
        await api.aprovarSolicitacaoAlimentacao(id, aprovadoPor);
        hideLoadingOverlay();
        loadAlimentacao();
        showToast('Solicitação aprovada com sucesso!', 'success');
    } catch (error) {
        hideLoadingOverlay();
        console.error('Erro ao aprovar:', error);
        showToast('Erro ao aprovar solicitação', 'error');
    }
}

async function rejeitarAlimentacao(id) {
    const observacoes = prompt('Motivo da rejeição:');
    if (!observacoes) return;
    
    try {
        showLoadingOverlay('Rejeitando solicitação...');
        await api.rejeitarSolicitacaoAlimentacao(id, observacoes);
        hideLoadingOverlay();
        loadAlimentacao();
        showToast('Solicitação rejeitada', 'info');
    } catch (error) {
        hideLoadingOverlay();
        console.error('Erro ao rejeitar:', error);
        showToast('Erro ao rejeitar solicitação', 'error');
    }
}

async function pagarAlimentacao(id) {
    showConfirmDialog(
        'Confirmar o pagamento desta solicitação?',
        async () => {
            const formaPagamento = prompt('Forma de pagamento (adiantamento/reembolso/cartao_corporativo):') || 'reembolso';
            
            try {
                showLoadingOverlay('Processando pagamento...');
                await api.pagarSolicitacaoAlimentacao(id, formaPagamento);
                hideLoadingOverlay();
                loadAlimentacao();
                showToast('Pagamento registrado com sucesso!', 'success');
            } catch (error) {
                hideLoadingOverlay();
                console.error('Erro ao registrar pagamento:', error);
                showToast('Erro ao registrar pagamento', 'error');
            }
        }
    );
}

async function viewAlimentacao(id) {
    try {
        const sol = await api.getSolicitacaoAlimentacao(id);
        
        const modalHTML = `
            <div class="modal fade" id="modalViewAlimentacao" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-eye"></i> Detalhes da Solicitação #${sol.id}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6><i class="bi bi-person"></i> Colaborador</h6>
                                    <p><strong>${sol.colaborador?.nome}</strong><br>
                                    ${sol.colaborador?.departamento}</p>
                                </div>
                                <div class="col-md-6">
                                    <h6><i class="bi bi-geo-alt"></i> Viagem</h6>
                                    <p><strong>${sol.solicitacaoViagem?.destino || 'N/A'}</strong><br>
                                    ${sol.solicitacaoViagem?.motivo || ''}</p>
                                </div>
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <h6><i class="bi bi-calendar"></i> Período</h6>
                                    <p>${formatDate(sol.dataInicio)} até ${formatDate(sol.dataFim)}<br>
                                    <strong>${sol.numeroDias} dias</strong></p>
                                </div>
                                <div class="col-md-4">
                                    <h6><i class="bi bi-credit-card"></i> Forma de Pagamento</h6>
                                    <p><strong>${sol.formaPagamento || 'N/A'}</strong></p>
                                </div>
                                <div class="col-md-4">
                                    <h6><i class="bi bi-flag"></i> Status</h6>
                                    <p><span class="status-badge bg-primary">${sol.status.toUpperCase()}</span></p>
                                </div>
                            </div>
                            
                            <h6 class="mb-3"><i class="bi bi-list-check"></i> Detalhamento das Refeições</h6>
                            <table class="table table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th>Refeição</th>
                                        <th class="text-center">Quantidade</th>
                                        <th class="text-end">Valor Unitário</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>☕ Café da Manhã</td>
                                        <td class="text-center">${sol.qtdCafeManha}</td>
                                        <td class="text-end">${formatCurrency(sol.valorCafeManha)}</td>
                                        <td class="text-end"><strong>${formatCurrency(sol.totalCafeManha)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>🍽️ Almoço</td>
                                        <td class="text-center">${sol.qtdAlmoco}</td>
                                        <td class="text-end">${formatCurrency(sol.valorAlmoco)}</td>
                                        <td class="text-end"><strong>${formatCurrency(sol.totalAlmoco)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>🌙 Jantar</td>
                                        <td class="text-center">${sol.qtdJantar}</td>
                                        <td class="text-end">${formatCurrency(sol.valorJantar)}</td>
                                        <td class="text-end"><strong>${formatCurrency(sol.totalJantar)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>🥐 Lanche/Outros</td>
                                        <td class="text-center">${sol.qtdLanche}</td>
                                        <td class="text-end">${formatCurrency(sol.valorLanche)}</td>
                                        <td class="text-end"><strong>${formatCurrency(sol.totalLanche)}</strong></td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light">
                                    <tr>
                                        <th colspan="3" class="text-end">VALOR TOTAL:</th>
                                        <th class="text-end text-primary"><h5 class="mb-0">${formatCurrency(sol.valorTotal)}</h5></th>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            ${sol.justificativa ? `
                                <div class="mt-3">
                                    <h6><i class="bi bi-chat-text"></i> Justificativa</h6>
                                    <p class="text-muted">${sol.justificativa}</p>
                                </div>
                            ` : ''}
                            
                            ${sol.observacoes ? `
                                <div class="mt-3">
                                    <h6><i class="bi bi-sticky"></i> Observações</h6>
                                    <p class="text-muted">${sol.observacoes}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const oldModal = document.getElementById('modalViewAlimentacao');
        if (oldModal) oldModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('modalViewAlimentacao'));
        modal.show();
    } catch (error) {
        console.error('Erro ao visualizar solicitação:', error);
        showToast('Erro ao visualizar solicitação', 'error');
    }
}

async function editAlimentacao(id) {
    await showModalAlimentacao(id);
    loadAlimentacaoData(id);
}

async function loadAlimentacaoData(id) {
    try {
        const sol = await api.getSolicitacaoAlimentacao(id);
        
        document.getElementById('solicitacaoViagemId').value = sol.solicitacaoViagemId;
        document.getElementById('colaboradorId').value = sol.colaboradorId;
        document.getElementById('colaboradorNome').value = sol.colaborador?.nome || '';
        document.getElementById('dataInicio').value = sol.dataInicio.split('T')[0];
        document.getElementById('dataFim').value = sol.dataFim.split('T')[0];
        document.getElementById('numeroDias').value = sol.numeroDias;
        
        document.getElementById('qtdCafeManha').value = sol.qtdCafeManha;
        document.getElementById('qtdAlmoco').value = sol.qtdAlmoco;
        document.getElementById('qtdJantar').value = sol.qtdJantar;
        document.getElementById('qtdLanche').value = sol.qtdLanche;
        
        document.getElementById('valorCafeManha').value = sol.valorCafeManha;
        document.getElementById('valorAlmoco').value = sol.valorAlmoco;
        document.getElementById('valorJantar').value = sol.valorJantar;
        document.getElementById('valorLanche').value = sol.valorLanche;
        
        document.getElementById('justificativa').value = sol.justificativa || '';
        document.getElementById('formaPagamento').value = sol.formaPagamento || 'adiantamento';
        document.getElementById('observacoes').value = sol.observacoes || '';
        
        calcularTotais();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados da solicitação', 'error');
    }
}

