# 🔄 Solução: Loop Infinito de Carregamento

## 🔍 Diagnóstico do Problema

O sistema carrega o header mas fica em loop infinito no dashboard.

### Causas Prováveis:
1. ❌ Erro JavaScript no dashboard.js
2. ❌ Requisição à API falhando
3. ❌ Dados do usuário corrompidos no localStorage
4. ❌ Token inválido ou expirado

---

## 🚨 PASSO 1: Verificar Console (URGENTE!)

**Pressione F12** → Vá em **"Console"**

**Procure por:**
- Erros em vermelho
- Avisos em amarelo
- Requisições falhando

**Me envie um print do console!**

---

## 🔧 PASSO 2: Limpar localStorage

### Execute no Console (F12):

```javascript
// Ver o que está armazenado
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Limpar tudo
localStorage.clear();

// Recarregar página
window.location.href = '/';
```

---

## 🔧 PASSO 3: Fazer Login Novamente

1. **Abra:** https://gestaooperacional-mocha.vercel.app/
2. **Faça login:**
   - Email: `admin@gestaoviagens.com`
   - Senha: `admin123`
3. **Com F12 aberto**, veja se:
   - Login funciona?
   - Token é salvo?
   - Redireciona para /app?

---

## 📊 PASSO 4: Verificar Requisições

**F12** → **Network** → **Recarregar página**

**Procure por:**
- Requisições para `gest-o-operacional-production.up.railway.app`
- Status code (200 = OK, 401 = Não autorizado, 500 = Erro servidor)
- Tempo de resposta

---

## 🛠️ Correção Aplicada

Adicionei proteção contra loops no código:

```javascript
// Proteção contra loops infinitos
let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

// Log de erros detalhado
window.addEventListener('error', function(e) {
    console.error('❌ Erro:', e.error);
    loadAttempts++;
    
    if (loadAttempts >= MAX_LOAD_ATTEMPTS) {
        console.error('🛑 Muitas tentativas. Parando loop.');
        alert('Erro ao carregar. Faça logout e tente novamente.');
        return false;
    }
});
```

---

## 🚀 Deploy da Correção

Vou fazer commit e push agora:

```bash
git add public/index.html
git commit -m "fix: adicionar proteção contra loop infinito"
git push origin main
```

**Aguarde 2-3 minutos para Vercel fazer redeploy**

---

## 🐛 Erros Comuns

### Erro 1: "user.role is not defined"

**Causa:** O backend retorna `role: "admin"` (minúsculo) mas o código espera `ADMIN`

**Solução:** Já adicionei suporte para ambos:
```javascript
const roleLabels = {
    'ADMIN': 'Administrador',
    'admin': 'Administrador',  // ✅ Adicionado
    // ...
};
```

---

### Erro 2: "Cannot read property of null"

**Causa:** Elementos HTML não encontrados

**Solução:** Verificar se os IDs existem:
```javascript
if (nameDisplay) {  // ✅ Proteção adicionada
    nameDisplay.textContent = user.nome;
}
```

---

### Erro 3: "CORS policy blocked"

**Causa:** Requisições bloqueadas pelo CORS

**Verificar:**
- Backend permite `.vercel.app`?
- URL da API está correta?

---

## 📝 Script de Debug

Cole no console (F12) para diagnóstico completo:

```javascript
console.log('=== DIAGNÓSTICO DO SISTEMA ===');

// 1. Verificar autenticação
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('✅ Token existe?', !!token);
console.log('✅ Token:', token ? token.substring(0, 50) + '...' : 'VAZIO');

if (user) {
    try {
        const userData = JSON.parse(user);
        console.log('✅ User:', userData);
        console.log('   - Nome:', userData.nome);
        console.log('   - Email:', userData.email);
        console.log('   - Role:', userData.role);
    } catch (e) {
        console.error('❌ Erro ao parsear user:', e);
    }
} else {
    console.log('❌ User: VAZIO');
}

// 2. Verificar configuração da API
console.log('✅ API_BASE_URL:', window.API_BASE_URL);

// 3. Testar conexão com API
fetch(window.API_BASE_URL + '/api/status')
    .then(r => r.json())
    .then(data => {
        console.log('✅ API Status:', data);
    })
    .catch(err => {
        console.error('❌ Erro ao conectar API:', err);
    });

// 4. Verificar elementos da página
console.log('✅ userNameDisplay existe?', !!document.getElementById('userNameDisplay'));
console.log('✅ userRoleDisplay existe?', !!document.getElementById('userRoleDisplay'));

console.log('=== FIM DO DIAGNÓSTICO ===');
```

---

## 🎯 Próximos Passos

1. **Execute o script de debug** no console
2. **Limpe o localStorage**
3. **Faça login novamente**
4. **Aguarde o redeploy da correção** (2-3 min)
5. **Me envie:**
   - Print do console
   - Print da aba Network
   - Descrição do que acontece

---

## 💡 Solução Temporária

Se ainda não funcionar, acesse direto pela URL de login:

```
https://gestaooperacional-mocha.vercel.app/login.html
```

E veja se o login funciona.

---

## 📞 Checklist de Debug

- [ ] Console aberto (F12)
- [ ] Executei script de diagnóstico
- [ ] Limpei localStorage
- [ ] Fiz login novamente
- [ ] Aguardei redeploy (2-3 min)
- [ ] Enviei prints do console
- [ ] Enviei prints do Network

---

🔧 **Aguarde o redeploy e teste novamente!**

