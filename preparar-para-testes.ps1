# Script para Preparar o Sistema para Testes
# Execute com: powershell -ExecutionPolicy Bypass -File preparar-para-testes.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Preparando Sistema para Testes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Compilar o projeto
Write-Host "📦 Passo 1: Compilando o projeto..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Compilação concluída!" -ForegroundColor Green
Write-Host ""

# 2. Configurar banco de dados
Write-Host "🗄️  Passo 2: Configurando banco de dados..." -ForegroundColor Yellow
if (Test-Path "database.sqlite") {
    Write-Host "⚠️  Banco de dados já existe." -ForegroundColor Yellow
    $resposta = Read-Host "Deseja recriar? (S/N)"
    if ($resposta -eq "S" -or $resposta -eq "s") {
        Remove-Item "database.sqlite"
        npm run setup
    }
} else {
    npm run setup
}
Write-Host "✅ Banco de dados configurado!" -ForegroundColor Green
Write-Host ""

# 3. Obter IP local
Write-Host "🌐 Passo 3: Obtendo endereço IP..." -ForegroundColor Yellow
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -like "192.168.*"})[0].IPAddress
if ($null -eq $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"})[0].IPAddress
}
Write-Host "📍 Seu IP Local: $ip" -ForegroundColor Green
Write-Host ""

# 4. Verificar firewall
Write-Host "🔥 Passo 4: Verificando Firewall..." -ForegroundColor Yellow
$regra = Get-NetFirewallRule -DisplayName "Sistema Gestão Operacional" -ErrorAction SilentlyContinue
if ($null -eq $regra) {
    Write-Host "⚠️  Regra de firewall não encontrada." -ForegroundColor Yellow
    Write-Host "💡 Criando regra de firewall..." -ForegroundColor Cyan
    
    try {
        New-NetFirewallRule -DisplayName "Sistema Gestão Operacional" `
                            -Direction Inbound `
                            -LocalPort 3002 `
                            -Protocol TCP `
                            -Action Allow `
                            -Profile Any
        Write-Host "✅ Firewall configurado!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Não foi possível configurar firewall automaticamente." -ForegroundColor Yellow
        Write-Host "👉 Execute este script como Administrador ou configure manualmente." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Firewall já configurado!" -ForegroundColor Green
}
Write-Host ""

# 5. Gerar instruções para usuários
Write-Host "📝 Passo 5: Gerando instruções..." -ForegroundColor Yellow

$instrucoes = @"
========================================
  INSTRUÇÕES PARA ACESSO AO SISTEMA
========================================

🌐 URL DE ACESSO:
   http://$ip:3002

👤 CREDENCIAIS DE TESTE:
   Usuário: admin
   Senha: [A senha que você definiu durante o setup]

✅ NAVEGADORES SUPORTADOS:
   - Google Chrome (recomendado)
   - Microsoft Edge
   - Firefox
   - Safari

📱 COMO ACESSAR:
   1. Abra o navegador
   2. Digite a URL acima
   3. Faça login com as credenciais fornecidas

⚠️ IMPORTANTE:
   - Certifique-se de estar na mesma rede Wi-Fi
   - O computador host deve estar ligado
   - Em caso de problemas, verifique se o firewall está configurado

🐛 REPORTAR PROBLEMAS:
   - Descreva o erro encontrado
   - Informe qual navegador está usando
   - Se possível, tire um print da tela

========================================
"@

$instrucoes | Out-File -FilePath "INSTRUCOES_PARA_USUARIOS.txt" -Encoding UTF8
Write-Host "✅ Instruções salvas em: INSTRUCOES_PARA_USUARIOS.txt" -ForegroundColor Green
Write-Host ""

# 6. Exibir resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ SISTEMA PRONTO PARA TESTES!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Seu IP: $ip" -ForegroundColor White
Write-Host "🌐 URL: http://$ip:3002" -ForegroundColor White
Write-Host ""
Write-Host "▶️  Para iniciar o servidor, execute:" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "📄 Envie o arquivo INSTRUCOES_PARA_USUARIOS.txt aos testadores" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Perguntar se deseja iniciar o servidor agora
Write-Host ""
$iniciar = Read-Host "Deseja iniciar o servidor agora? (S/N)"
if ($iniciar -eq "S" -or $iniciar -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    Write-Host "⚠️  Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host ""
    npm start
}

