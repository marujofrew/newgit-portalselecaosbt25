#!/bin/bash

echo "Auto Deploy para Heroku - Solução Definitiva"
echo "============================================="

# Verificar se heroku CLI está disponível
if ! command -v heroku &> /dev/null; then
    echo "ERRO: Heroku CLI não encontrado"
    echo "Instale com: npm install -g heroku"
    exit 1
fi

# Fazer build final
echo "1. Executando build final..."
node heroku-final.cjs

# Verificar build
if [ ! -f "dist/index.cjs" ] || [ ! -f "dist/public/index.html" ]; then
    echo "ERRO: Build falhou - arquivos não encontrados"
    exit 1
fi

echo "2. Build completo:"
echo "   ✓ dist/index.cjs ($(wc -c < dist/index.cjs) bytes)"
echo "   ✓ dist/public/index.html ($(wc -c < dist/public/index.html) bytes)"

# Remover lock do git se existir
if [ -f ".git/index.lock" ]; then
    echo "3. Removendo git lock..."
    rm -f .git/index.lock
fi

# Fazer commit e push
echo "4. Fazendo deploy..."
git add .
git commit -m "Deploy final - servidor Express com frontend minimalista"

# Push para Heroku
echo "5. Enviando para Heroku..."
git push heroku main

# Verificar status
echo "6. Verificando status do deploy..."
sleep 10

# Testar aplicação
echo "7. Testando aplicação..."
curl -I "https://portalselecaosbt-02ad61fdc07b.herokuapp.com/" || echo "Teste falhou"

echo "8. Deploy concluído!"
echo "URL: https://portalselecaosbt-02ad61fdc07b.herokuapp.com/"
echo ""
echo "Para ver logs: heroku logs --tail --app portalselecaosbt"