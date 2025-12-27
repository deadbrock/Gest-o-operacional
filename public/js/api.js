// Configuração da API
const API_URL = 'http://localhost:3002/api';

// Funções auxiliares
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
};

const formatDateTime = (date) => {
    return new Date(date).toLocaleString('pt-BR');
};

// API Client
const api = {
    // Colaboradores
    async getColaboradores(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/colaboradores?${queryString}`);
        return await response.json();
    },
    
    async getColaborador(id) {
        const response = await fetch(`${API_URL}/colaboradores/${id}`);
        return await response.json();
    },
    
    async createColaborador(data) {
        const response = await fetch(`${API_URL}/colaboradores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updateColaborador(id, data) {
        const response = await fetch(`${API_URL}/colaboradores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deleteColaborador(id) {
        await fetch(`${API_URL}/colaboradores/${id}`, {
            method: 'DELETE',
        });
    },
    
    async getDepartamentos() {
        const response = await fetch(`${API_URL}/colaboradores/departamentos`);
        return await response.json();
    },
    
    // Solicitações de Viagem
    async getSolicitacoes(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/solicitacoes?${queryString}`);
        return await response.json();
    },
    
    async getSolicitacao(id) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}`);
        return await response.json();
    },
    
    async createSolicitacao(data) {
        const response = await fetch(`${API_URL}/solicitacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updateSolicitacao(id, data) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deleteSolicitacao(id) {
        await fetch(`${API_URL}/solicitacoes/${id}`, {
            method: 'DELETE',
        });
    },
    
    async aprovarSolicitacao(id, aprovadoPor) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}/aprovar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aprovadoPor }),
        });
        return await response.json();
    },
    
    async rejeitarSolicitacao(id, observacoes) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}/rejeitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observacoes }),
        });
        return await response.json();
    },
    
    async calcularCustoTotal(id) {
        const response = await fetch(`${API_URL}/solicitacoes/${id}/custo-total`);
        return await response.json();
    },
    
    // Hospedagens
    async getHospedagens(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/hospedagens?${queryString}`);
        return await response.json();
    },
    
    async getHospedagem(id) {
        const response = await fetch(`${API_URL}/hospedagens/${id}`);
        return await response.json();
    },
    
    async createHospedagem(data) {
        const response = await fetch(`${API_URL}/hospedagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updateHospedagem(id, data) {
        const response = await fetch(`${API_URL}/hospedagens/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deleteHospedagem(id) {
        await fetch(`${API_URL}/hospedagens/${id}`, {
            method: 'DELETE',
        });
    },
    
    // Passagens
    async getPassagens(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/passagens?${queryString}`);
        return await response.json();
    },
    
    async getPassagem(id) {
        const response = await fetch(`${API_URL}/passagens/${id}`);
        return await response.json();
    },
    
    async createPassagem(data) {
        const response = await fetch(`${API_URL}/passagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updatePassagem(id, data) {
        const response = await fetch(`${API_URL}/passagens/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deletePassagem(id) {
        await fetch(`${API_URL}/passagens/${id}`, {
            method: 'DELETE',
        });
    },
    
    // Despesas RDV
    async getDespesasRDV(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/despesas-rdv?${queryString}`);
        return await response.json();
    },
    
    async getDespesaRDV(id) {
        const response = await fetch(`${API_URL}/despesas-rdv/${id}`);
        return await response.json();
    },
    
    async createDespesaRDV(data) {
        const response = await fetch(`${API_URL}/despesas-rdv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updateDespesaRDV(id, data) {
        const response = await fetch(`${API_URL}/despesas-rdv/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deleteDespesaRDV(id) {
        await fetch(`${API_URL}/despesas-rdv/${id}`, {
            method: 'DELETE',
        });
    },
    
    async aprovarDespesaRDV(id) {
        const response = await fetch(`${API_URL}/despesas-rdv/${id}/aprovar`, {
            method: 'POST',
        });
        return await response.json();
    },
    
    async rejeitarDespesaRDV(id, observacoes) {
        const response = await fetch(`${API_URL}/despesas-rdv/${id}/rejeitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observacoes }),
        });
        return await response.json();
    },
    
    // Solicitações de Alimentação
    async getSolicitacoesAlimentacao(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao?${queryString}`);
        return await response.json();
    },
    
    async getSolicitacaoAlimentacao(id) {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/${id}`);
        return await response.json();
    },
    
    async createSolicitacaoAlimentacao(data) {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async updateSolicitacaoAlimentacao(id, data) {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    
    async deleteSolicitacaoAlimentacao(id) {
        await fetch(`${API_URL}/solicitacoes-alimentacao/${id}`, {
            method: 'DELETE',
        });
    },
    
    async aprovarSolicitacaoAlimentacao(id, aprovadoPor, observacoes = '') {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/${id}/aprovar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aprovadoPor, observacoes }),
        });
        return await response.json();
    },
    
    async rejeitarSolicitacaoAlimentacao(id, observacoes) {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/${id}/rejeitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observacoes }),
        });
        return await response.json();
    },
    
    async pagarSolicitacaoAlimentacao(id, formaPagamento, comprovante = '') {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/${id}/pagar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formaPagamento, comprovantePagamento: comprovante }),
        });
        return await response.json();
    },
    
    async calcularAlimentacaoAutomatica(solicitacaoViagemId) {
        const response = await fetch(`${API_URL}/solicitacoes-alimentacao/calcular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ solicitacaoViagemId }),
        });
        return await response.json();
    },
    
    // Relatórios
    async getDashboard(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/relatorios/dashboard?${queryString}`);
        return await response.json();
    },
    
    async getCustosDetalhados(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/relatorios/custos-detalhados?${queryString}`);
        return await response.json();
    },
};

