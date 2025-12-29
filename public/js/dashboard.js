// Dashboard - Enhanced with loading states
async function loadDashboard() {
    try {
        // Show loading skeleton
        showLoadingSkeleton();
        
        // Add subtle delay for better UX perception
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const data = await api.getDashboard();
        
        // Animate metrics appearance
        renderMetrics(data);
        
        // Render charts with stagger animation
        setTimeout(() => renderCharts(data), 200);
        
        // Initialize tooltips
        initializeTooltips();
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showErrorState();
    }
}

// Show loading skeleton for better perceived performance
function showLoadingSkeleton() {
    const metricsContainer = document.getElementById('metricsContainer');
    
    let html = '';
    for (let i = 0; i < 8; i++) {
        html += `
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="card" style="height: 130px;">
                    <div class="card-body">
                        <div class="skeleton mb-3" style="height: 40px; width: 60%;"></div>
                        <div class="skeleton" style="height: 20px; width: 80%;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    metricsContainer.innerHTML = html;
}

// Show error state with retry option
function showErrorState() {
    const metricsContainer = document.getElementById('metricsContainer');
    
    metricsContainer.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
                <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-exclamation-triangle-fill" style="font-size: 24px;"></i>
                    <div>
                        <strong>Erro ao carregar dashboard</strong>
                        <p class="mb-0 mt-1">Não foi possível conectar ao servidor. Verifique sua conexão.</p>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="loadDashboard()">
                    <i class="bi bi-arrow-clockwise"></i> Tentar novamente
                </button>
            </div>
        </div>
    `;
}

function renderMetrics(data) {
    const metricsContainer = document.getElementById('metricsContainer');
    
    // Verificar se os dados existem
    if (!data || typeof data !== 'object') {
        console.error('Dados inválidos recebidos:', data);
        showErrorState();
        return;
    }
    
    const { custos = {}, solicitacoesPorStatus = [] } = data;
    
    // Garantir valores numéricos para custos
    const custosValidos = {
        hospedagens: parseFloat(custos.hospedagens) || 0,
        passagens: parseFloat(custos.passagens) || 0,
        despesas: parseFloat(custos.despesas) || 0,
        total: parseFloat(custos.total) || 0
    };
    
    // Contar solicitações por status
    const statusCount = {};
    if (Array.isArray(solicitacoesPorStatus)) {
        solicitacoesPorStatus.forEach(item => {
            statusCount[item.status] = parseInt(item.total) || 0;
        });
    }
    
    const metrics = [
        {
            title: formatCurrency(custosValidos.hospedagens),
            label: 'Hospedagens',
            subtitle: 'Custos com acomodação',
            icon: 'building',
            gradient: 'bg-gradient-blue',
            trend: '+12%',
            trendUp: true
        },
        {
            title: formatCurrency(custosValidos.passagens),
            label: 'Passagens',
            subtitle: 'Aéreas e terrestres',
            icon: 'ticket-perforated',
            gradient: 'bg-gradient-green',
            trend: '+8%',
            trendUp: true
        },
        {
            title: formatCurrency(custosValidos.despesas),
            label: 'Despesas RDV',
            subtitle: 'Refeições e outros',
            icon: 'cash-stack',
            gradient: 'bg-gradient-orange',
            trend: '+5%',
            trendUp: true
        },
        {
            title: formatCurrency(custosValidos.total),
            label: 'Custo Total',
            subtitle: 'Investimento em viagens',
            icon: 'wallet2',
            gradient: 'bg-gradient-purple',
            trend: '+9%',
            trendUp: true
        },
        {
            title: statusCount['pendente'] || 0,
            label: 'Pendentes',
            subtitle: 'Aguardando aprovação',
            icon: 'clock-history',
            gradient: 'bg-gradient-red',
        },
        {
            title: statusCount['aprovada'] || 0,
            label: 'Aprovadas',
            subtitle: 'Prontas para execução',
            icon: 'check-circle',
            gradient: 'bg-gradient-teal',
        },
        {
            title: statusCount['em_andamento'] || 0,
            label: 'Em Andamento',
            subtitle: 'Viagens em curso',
            icon: 'airplane',
            gradient: 'bg-gradient-pink',
        },
        {
            title: statusCount['concluida'] || 0,
            label: 'Concluídas',
            subtitle: 'Finalizadas com sucesso',
            icon: 'check-all',
            gradient: 'bg-gradient-indigo',
        },
    ];
    
    metricsContainer.innerHTML = '';
    
    // Render metrics with stagger animation
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            const col = document.createElement('div');
            col.className = 'col-xl-3 col-lg-4 col-md-6';
            col.style.opacity = '0';
            col.style.transform = 'translateY(20px)';
            
            col.innerHTML = `
                <div class="metric-card ${metric.gradient} position-relative" 
                     data-bs-toggle="tooltip" 
                     title="${metric.subtitle}"
                     role="button"
                     tabindex="0">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="flex-grow-1">
                            <h3 class="mb-0">${metric.title}</h3>
                            <p class="mb-1">${metric.label}</p>
                            ${metric.trend ? `
                                <small class="d-flex align-items-center gap-1" style="opacity: 0.9;">
                                    <i class="bi bi-${metric.trendUp ? 'arrow-up' : 'arrow-down'}"></i>
                                    ${metric.trend} vs. mês anterior
                                </small>
                            ` : ''}
                        </div>
                    </div>
                    <i class="bi bi-${metric.icon}"></i>
                    <div class="position-absolute bottom-0 start-0 end-0" 
                         style="height: 4px; background: rgba(255,255,255,0.2); overflow: hidden;">
                        <div style="height: 100%; width: 70%; background: rgba(255,255,255,0.4); 
                                    animation: pulse 2s infinite;"></div>
                    </div>
                </div>
            `;
            
            metricsContainer.appendChild(col);
            
            // Trigger animation
            requestAnimationFrame(() => {
                col.style.transition = 'all 0.5s ease';
                col.style.opacity = '1';
                col.style.transform = 'translateY(0)';
            });
            
        }, index * 100); // Stagger delay
    });
}

function renderCharts(data) {
    const chartsContainer = document.getElementById('dashboardCharts');
    
    chartsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-pie-chart"></i> Solicitações por Status</h5>
                        <div class="chart-container">
                            <canvas id="chartStatus"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-bar-chart"></i> Custos por Categoria</h5>
                        <div class="chart-container">
                            <canvas id="chartCustos"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-people"></i> Top 5 Colaboradores</h5>
                        <div id="topColaboradores"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-building"></i> Hospedagens por Status</h5>
                        <div class="chart-container">
                            <canvas id="chartHospedagens"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Gráfico de Solicitações por Status
    const ctxStatus = document.getElementById('chartStatus')?.getContext('2d');
    if (ctxStatus && data.solicitacoesPorStatus && Array.isArray(data.solicitacoesPorStatus) && data.solicitacoesPorStatus.length > 0) {
        new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: data.solicitacoesPorStatus.map(s => s.status),
                datasets: [{
                    data: data.solicitacoesPorStatus.map(s => parseInt(s.total) || 0),
                    backgroundColor: [
                        '#667eea',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#14b8a6',
                    ],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        });
    }
    
    // Gráfico de Custos
    const ctxCustos = document.getElementById('chartCustos')?.getContext('2d');
    const custosGrafico = {
        hospedagens: parseFloat(data.custos?.hospedagens) || 0,
        passagens: parseFloat(data.custos?.passagens) || 0,
        despesas: parseFloat(data.custos?.despesas) || 0
    };
    
    if (ctxCustos && (custosGrafico.hospedagens > 0 || custosGrafico.passagens > 0 || custosGrafico.despesas > 0)) {
        new Chart(ctxCustos, {
            type: 'bar',
            data: {
                labels: ['Hospedagens', 'Passagens', 'RDV'],
                datasets: [{
                    label: 'Custos',
                    data: [
                        custosGrafico.hospedagens, 
                        custosGrafico.passagens, 
                        custosGrafico.despesas
                    ],
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b'],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            },
                        },
                    },
                },
            },
        });
    }
    
    // Top Colaboradores
    let topColabHTML = '<p class="text-center text-muted py-3">Nenhum dado disponível</p>';
    
    if (data.topColaboradores && Array.isArray(data.topColaboradores) && data.topColaboradores.length > 0) {
        topColabHTML = data.topColaboradores.map((item, index) => {
            const totalViagens = item.dataValues?.totalViagens || item.totalViagens || 0;
            const custoTotal = item.dataValues?.custoTotal || item.custoTotal || 0;
            const nomeColaborador = item.colaborador?.nome || 'N/A';
            const departamento = item.colaborador?.departamento || 'N/A';
            
            return `
                <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div>
                        <strong>${index + 1}. ${nomeColaborador}</strong>
                        <br>
                        <small class="text-muted">${departamento}</small>
                    </div>
                    <div class="text-end">
                        <strong>${totalViagens} viagens</strong>
                        <br>
                        <small class="text-muted">${formatCurrency(custoTotal)}</small>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    const topColabElement = document.getElementById('topColaboradores');
    if (topColabElement) {
        topColabElement.innerHTML = topColabHTML;
    }
    
    // Gráfico de Hospedagens
    if (data.hospedagensPorStatus && data.hospedagensPorStatus.length > 0) {
        const ctxHospedagens = document.getElementById('chartHospedagens').getContext('2d');
        new Chart(ctxHospedagens, {
            type: 'pie',
            data: {
                labels: data.hospedagensPorStatus.map(h => h.status),
                datasets: [{
                    data: data.hospedagensPorStatus.map(h => h.total),
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        });
    }
}

