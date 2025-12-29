/**
 * Configuração de URLs da API
 * Detecta automaticamente se está em desenvolvimento ou produção
 */

// Detectar ambiente
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

// URL base da API
const API_BASE_URL = isLocalhost
  ? 'http://localhost:3002'  // Desenvolvimento local
  : 'https://gest-o-operacional-production.up.railway.app';  // ✅ URL do Railway

console.log('🌐 Ambiente:', isLocalhost ? 'Desenvolvimento' : 'Produção');
console.log('🔗 API URL:', API_BASE_URL);

// Exportar para uso global
window.API_BASE_URL = API_BASE_URL;

