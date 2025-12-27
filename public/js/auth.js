// Sistema de Autenticação

// Função para obter token
function getToken() {
    return localStorage.getItem('token');
}

// Função para obter usuário logado
function getLoggedUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Função para verificar se está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Função para verificar autenticação na página
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Função para fazer requisições autenticadas
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Adicionar token ao header
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };
    
    try {
        const response = await fetch(url, options);
        
        // Se token inválido, redirecionar para login
        if (response.status === 401) {
            logout();
            return;
        }
        
        return response;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Função para exibir informações do usuário
function displayUserInfo() {
    const user = getLoggedUser();
    
    if (!user) return;
    
    // Atualizar elementos na página
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    const userRoleElements = document.querySelectorAll('.user-role');
    
    userNameElements.forEach(el => el.textContent = user.nome);
    userEmailElements.forEach(el => el.textContent = user.email);
    userRoleElements.forEach(el => el.textContent = getRoleLabel(user.role));
}

// Função para obter label do role
function getRoleLabel(role) {
    const roles = {
        'admin': 'Administrador',
        'financeiro': 'Financeiro',
        'gestor': 'Gestor',
        'colaborador': 'Colaborador',
    };
    return roles[role] || role;
}

// Função para verificar permissão
function hasPermission(requiredRole) {
    const user = getLoggedUser();
    if (!user) return false;
    
    const roleHierarchy = {
        'colaborador': 1,
        'gestor': 2,
        'financeiro': 3,
        'admin': 4,
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// Função para mostrar/ocultar elementos baseado em permissão
function applyPermissions() {
    const user = getLoggedUser();
    if (!user) return;
    
    // Elementos que requerem permissões específicas
    document.querySelectorAll('[data-require-role]').forEach(element => {
        const requiredRole = element.getAttribute('data-require-role');
        
        if (!hasPermission(requiredRole)) {
            element.style.display = 'none';
        }
    });
}

// Interceptar fetch global para adicionar autenticação
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    // Se a URL é da API e não é login/register
    if (url.includes('/api/') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        const token = getToken();
        
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            };
        }
    }
    
    return originalFetch(url, options).then(async response => {
        // Se 401, fazer logout
        if (response.status === 401 && !url.includes('/auth/login')) {
            logout();
        }
        return response;
    });
};

// Verificar autenticação ao carregar a página (exceto na página de login)
if (!window.location.pathname.includes('login.html')) {
    if (isAuthenticated()) {
        displayUserInfo();
        applyPermissions();
    } else {
        requireAuth();
    }
}

