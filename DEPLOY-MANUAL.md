# Deploy Manual no Heroku - Solução Definitiva

## Problema Atual
- Aplicação retorna HTTP 503 (Service Unavailable)
- Build pode estar falhando ou servidor não está iniciando

## Solução Implementada

### 1. Build Script Funcionando
- `heroku-final.cjs` - Script de build testado e funcional
- Cria servidor Express mínimo em `dist/index.cjs`
- Frontend de teste em `dist/public/index.html`

### 2. Deploy Manual

Execute estes comandos EXATAMENTE nesta ordem:

```bash
# 1. Fazer build local para testar
node heroku-final.cjs

# 2. Verificar se build funcionou
ls -la dist/
ls -la dist/public/

# 3. Adicionar ao git
git add .

# 4. Fazer commit
git commit -m "Fix Heroku deploy - use heroku-final.cjs build"

# 5. Deploy no Heroku
git push heroku main

# 6. Verificar logs imediatamente
heroku logs --tail --app portalselecaosbt
```

### 3. Se Ainda Não Funcionar

Execute estes comandos para forçar rebuild:

```bash
# Forçar rebuild completo
heroku builds:cache:purge --app portalselecaosbt
git commit --allow-empty -m "Force rebuild"
git push heroku main

# Verificar se dyno está ativo
heroku ps --app portalselecaosbt

# Escalar dyno se necessário
heroku ps:scale web=1 --app portalselecaosbt
```

### 4. Debug Adicional

Se o problema persistir:

```bash
# Ver variáveis de ambiente
heroku config --app portalselecaosbt

# Ver logs de build
heroku logs --tail --app portalselecaosbt | grep -i error

# Testar URL diretamente
curl -I https://portalselecaosbt-02ad61fdc07b.herokuapp.com/
```

## Arquivos Importantes

- `heroku-final.cjs` - Build script funcional
- `Procfile` - Configurado para `web: node dist/index.cjs`
- `dist/index.cjs` - Servidor Express mínimo
- `dist/public/index.html` - Frontend de teste

## Expectativa de Funcionamento

Após o deploy correto, você deve ver:
1. Logs: "SBT Portal running on port XXXX"
2. URL https://portalselecaosbt-02ad61fdc07b.herokuapp.com/ carregando
3. Página com "Portal de Seleção SBT - Sistema Online"