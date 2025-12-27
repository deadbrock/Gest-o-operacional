// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Gestão de Viagens Corporativas - Iniciado');
    
    // Show welcome animation
    showWelcomeAnimation();
    
    // Carregar dashboard inicial
    loadDashboard();
    
    // Configurar event listeners para as tabs
    setupTabListeners();
    
    // Initialize tooltips globally
    initializeTooltips();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Welcome animation for better first impression
function showWelcomeAnimation() {
    const container = document.querySelector('.main-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            delay: { show: 500, hide: 100 },
            trigger: 'hover focus'
        });
    });
}

// Keyboard shortcuts for better accessibility
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + 1-7 to switch tabs
        if (e.altKey && e.key >= '1' && e.key <= '7') {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
            if (tabs[tabIndex]) {
                tabs[tabIndex].click();
            }
        }
        
        // Alt + R to refresh current tab
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            refreshCurrentTab();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                bootstrap.Modal.getInstance(modal)?.hide();
            });
        }
    });
}

function setupTabListeners() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target');
            
            switch(targetId) {
                case '#dashboard':
                    loadDashboard();
                    break;
                case '#solicitacoes':
                    loadSolicitacoes();
                    break;
                case '#colaboradores':
                    loadColaboradores();
                    break;
                case '#hospedagens':
                    loadHospedagens();
                    break;
                case '#passagens':
                    loadPassagens();
                    break;
                case '#rdv':
                    loadRDV();
                    break;
                case '#alimentacao':
                    loadAlimentacao();
                    break;
                case '#relatorios':
                    loadRelatorios();
                    break;
            }
        });
    });
}

// Função global de refresh
function refreshCurrentTab() {
    const activeTab = document.querySelector('.tab-pane.active');
    
    if (activeTab) {
        switch(activeTab.id) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'solicitacoes':
                loadSolicitacoes();
                break;
            case 'colaboradores':
                loadColaboradores();
                break;
            case 'hospedagens':
                loadHospedagens();
                break;
            case 'passagens':
                loadPassagens();
                break;
            case 'rdv':
                loadRDV();
                break;
            case 'alimentacao':
                loadAlimentacao();
                break;
            case 'relatorios':
                loadRelatorios();
                break;
        }
    }
}

// Tratamento global de erros
window.addEventListener('error', function(event) {
    console.error('Erro global capturado:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejection não tratada:', event.reason);
});

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const icons = {
        success: 'check-circle-fill',
        error: 'exclamation-triangle-fill',
        warning: 'exclamation-circle-fill',
        info: 'info-circle-fill'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        z-index: 9999;
        border-left: 4px solid ${colors[type]};
    `;
    
    toast.innerHTML = `
        <i class="bi bi-${icons[type]}" style="font-size: 24px; color: ${colors[type]};"></i>
        <span style="flex: 1; font-weight: 500;">${message}</span>
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: none; cursor: pointer; opacity: 0.5; font-size: 20px;">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    return container;
}

// Export all data functionality
async function exportarDados() {
    try {
        showToast('Preparando exportação...', 'info');
        
        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao exportar dados', 'error');
    }
}

// Loading overlay
function showLoadingOverlay(message = 'Carregando...') {
    let overlay = document.getElementById('loadingOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            backdrop-filter: blur(4px);
        `;
        
        overlay.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 mb-0 fw-bold">${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Confirm dialog with better UX
function showConfirmDialog(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;
    
    dialog.innerHTML = `
        <div style="background: white; padding: 32px; border-radius: 16px; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
            <div class="text-center mb-4">
                <i class="bi bi-question-circle text-warning" style="font-size: 48px;"></i>
            </div>
            <h5 class="text-center mb-3">Confirmar ação?</h5>
            <p class="text-center text-muted mb-4">${message}</p>
            <div class="d-flex gap-2">
                <button class="btn btn-secondary flex-fill" id="cancelBtn">
                    <i class="bi bi-x"></i> Cancelar
                </button>
                <button class="btn btn-primary flex-fill" id="confirmBtn">
                    <i class="bi bi-check"></i> Confirmar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    dialog.querySelector('#confirmBtn').onclick = () => {
        dialog.remove();
        if (onConfirm) onConfirm();
    };
    
    dialog.querySelector('#cancelBtn').onclick = () => {
        dialog.remove();
        if (onCancel) onCancel();
    };
    
    // Close on backdrop click
    dialog.onclick = (e) => {
        if (e.target === dialog) {
            dialog.remove();
            if (onCancel) onCancel();
        }
    };
}

// Mensagem de boas-vindas
console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   Sistema de Gestão de Viagens Corporativas              ║
║   Versão 1.0.0 - Enhanced UX Edition                     ║
║                                                            ║
║   Desenvolvido para controle de:                          ║
║   • Hospedagens                                           ║
║   • Passagens Aéreas e Terrestres                         ║
║   • Despesas RDV (Refeições e Despesas de Viagem)        ║
║                                                            ║
║   Atalhos de teclado:                                     ║
║   • Alt + 1-7: Alternar entre abas                       ║
║   • Alt + R: Atualizar aba atual                         ║
║   • Esc: Fechar modais                                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

