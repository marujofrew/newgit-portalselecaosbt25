# Deploy Heroku - Instruções Definitivas

## Problema Identificado
O erro MODULE_NOT_FOUND indica que o arquivo `dist/index.cjs` não está sendo encontrado no Heroku, mesmo estando presente no build local.

## Solução Implementada
Criado servidor HTTP nativo sem dependências externas em `heroku-deploy.cjs`:
- ✅ Servidor HTTP usando apenas módulos nativos do Node.js
- ✅ Sem dependências do Express ou outras bibliotecas
- ✅ Frontend SBT profissional de 12KB
- ✅ Testado localmente na porta 3005

## Comandos para Deploy Manual

Execute estes comandos no seu terminal local (fora do Replit):

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# 2. Fazer build
node heroku-deploy.cjs

# 3. Verificar arquivos
ls -la dist/
ls -la dist/public/

# 4. Commit e push
git add .
git commit -m "Deploy final - servidor HTTP nativo sem dependências"
git push heroku main

# 5. Verificar logs
heroku logs --tail --app portalselecaosbt
```

## Arquivos Criados
- `dist/index.cjs` - Servidor HTTP nativo (4KB)
- `dist/public/index.html` - Frontend SBT (12KB)  
- `dist/public/favicon.svg` - Ícone SVG
- `dist/public/azul-logo.png` - Logo da Azul

## Teste Local
Para testar localmente antes do deploy:
```bash
NODE_ENV=production PORT=3000 node dist/index.cjs
```

## URLs de Verificação
Após deploy bem-sucedido:
- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/
- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/health
- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/api/health

## Logs Esperados
Você deve ver no Heroku:
```
🚀 SBT PORTAL SERVIDOR INICIADO COM SUCESSO!
🌐 Porta: [porta_heroku]
📁 Diretório público: /app/dist/public
```

Se aparecer "Application Error", execute:
```bash
heroku ps:restart --app portalselecaosbt
heroku ps:scale web=1 --app portalselecaosbt
```