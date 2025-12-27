// Relatórios
async function loadRelatorios() {
    try {
        const data = await api.getCustosDetalhados();
        renderRelatoriosContent(data);
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        alert('Erro ao carregar relatórios');
    }
}

function renderRelatoriosContent(data) {
    const container = document.getElementById('relatoriosContent');
    
    let html = `
        <div class="card mb-4">
            <div class="card-body">
                <h5><i class="bi bi-funnel"></i> Filtros</h5>
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">Data Início</label>
                        <input type="date" class="form-control" id="filtroDataInicio">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Data Fim</label>
                        <input type="date" class="form-control" id="filtroDataFim">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Departamento</label>
                        <select class="form-select" id="filtroDepartamento">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button class="btn btn-primary w-100" onclick="aplicarFiltrosRelatorio()">
                            <i class="bi bi-search"></i> Filtrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-primary">${data.quantidade}</h3>
                        <p class="mb-0">Total de Viagens</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-success">${formatCurrency(data.totais.hospedagens)}</h3>
                        <p class="mb-0">Hospedagens</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-info">${formatCurrency(data.totais.passagens)}</h3>
                        <p class="mb-0">Passagens</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-warning">${formatCurrency(data.totais.despesas)}</h3>
                        <p class="mb-0">RDV</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-table"></i> Detalhamento de Custos</h5>
                <button class="btn btn-success btn-sm" onclick="exportarRelatorio()">
                    <i class="bi bi-file-earmark-excel"></i> Exportar Excel
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="tabelaRelatorios">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Colaborador</th>
                                <th>Departamento</th>
                                <th>Destino</th>
                                <th>Período</th>
                                <th>Hospedagens</th>
                                <th>Passagens</th>
                                <th>RDV</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    data.viagens.forEach(viagem => {
        html += `
            <tr>
                <td><strong>#${viagem.id}</strong></td>
                <td>${viagem.colaborador}</td>
                <td>${viagem.departamento}</td>
                <td>${viagem.destino}</td>
                <td>${formatDate(viagem.dataInicio)} - ${formatDate(viagem.dataFim)}</td>
                <td>${formatCurrency(viagem.custos.hospedagens)}</td>
                <td>${formatCurrency(viagem.custos.passagens)}</td>
                <td>${formatCurrency(viagem.custos.despesas)}</td>
                <td><strong>${formatCurrency(viagem.custos.total)}</strong></td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <th colspan="5" class="text-end">TOTAL GERAL:</th>
                                <th>${formatCurrency(data.totais.hospedagens)}</th>
                                <th>${formatCurrency(data.totais.passagens)}</th>
                                <th>${formatCurrency(data.totais.despesas)}</th>
                                <th><strong>${formatCurrency(data.totais.total)}</strong></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Carregar departamentos para filtro
    loadDepartamentosFilter();
}

async function loadDepartamentosFilter() {
    try {
        const departamentos = await api.getDepartamentos();
        const select = document.getElementById('filtroDepartamento');
        
        departamentos.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar departamentos:', error);
    }
}

async function aplicarFiltrosRelatorio() {
    const dataInicio = document.getElementById('filtroDataInicio').value;
    const dataFim = document.getElementById('filtroDataFim').value;
    const departamento = document.getElementById('filtroDepartamento').value;
    
    const params = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    if (departamento) params.departamento = departamento;
    
    try {
        const data = await api.getCustosDetalhados(params);
        renderRelatoriosContent(data);
    } catch (error) {
        console.error('Erro ao filtrar relatórios:', error);
        alert('Erro ao filtrar relatórios');
    }
}

function exportarRelatorio() {
    // Converter tabela para CSV
    const table = document.getElementById('tabelaRelatorios');
    let csv = [];
    
    for (let row of table.rows) {
        let csvRow = [];
        for (let cell of row.cells) {
            csvRow.push(cell.textContent);
        }
        csv.push(csvRow.join(';'));
    }
    
    const csvString = csv.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio_viagens_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    alert('Relatório exportado com sucesso!');
}

