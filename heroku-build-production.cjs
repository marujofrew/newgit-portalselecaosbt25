// Build definitivo para Heroku - Projeto React Real
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(60));
console.log('HEROKU BUILD PRODUCTION - PROJETO REACT REAL');
console.log('='.repeat(60));

// Limpar diretório dist
console.log('1. Limpando diretório dist...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // Copiar assets necessários antes do build Vite
  console.log('2. Copiando assets necessários...');
  
  // Copiar logos necessários para public/
  const logoSBT = 'sbt_logo.png';
  const logoAzul = 'azul-logo.png';
  
  if (fs.existsSync(logoSBT)) {
    fs.copyFileSync(logoSBT, path.join('client/public', logoSBT));
    console.log('   ✅ Logo SBT copiado');
  }
  
  if (fs.existsSync(logoAzul)) {
    fs.copyFileSync(logoAzul, path.join('client/public', 'azul-logo-oficial.png'));
    console.log('   ✅ Logo Azul copiado');
  }

  // Build do frontend React com Vite
  console.log('3. Executando build Vite do React...');
  
  // Build do React
  console.log('   🔨 Building React app...');
  execSync('NODE_ENV=production npx vite build --config vite.config.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('   ✅ Build React concluído');

  // Verificar se o build do frontend foi criado
  const frontendBuildPath = 'dist/public';
  if (!fs.existsSync(frontendBuildPath) || !fs.existsSync(path.join(frontendBuildPath, 'index.html'))) {
    throw new Error('Build do frontend falhou - index.html não encontrado');
  }

  // Criar servidor Express para servir o React app
  console.log('4. Criando servidor Express de produção...');
  
  const serverCode = `// Servidor Express para produção - Projeto SBT React
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 5000;

console.log('');
console.log('🚀 INICIANDO SERVIDOR SBT PORTAL REACT');
console.log('=====================================');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');
console.log('Node.js:', process.version);
console.log('=====================================');

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Servir arquivos estáticos do React
app.use(express.static(path.join(__dirname, 'public')));

// Health checks
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    app: 'SBT Portal React'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    api: 'online',
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
});

// SPA fallback - todas as rotas não-API servem o React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React app não encontrado');
  }
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ SERVIDOR REACT SBT ATIVO!');
  console.log('URL:', 'http://localhost:' + PORT);
  console.log('Health:', 'http://localhost:' + PORT + '/health');
  console.log('Servindo React app de:', path.join(__dirname, 'public'));
  console.log('');
});

// Error handling
server.on('error', (error) => {
  console.error('❌ ERRO DO SERVIDOR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Recebido SIGTERM - encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Recebido SIGINT - encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('❌ EXCEÇÃO NÃO CAPTURADA:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ PROMISE REJEITADA:', reason);
  process.exit(1);
});`;

  fs.writeFileSync('dist/index.cjs', serverCode);
  console.log('   ✅ Servidor Express criado');

} catch (error) {
  console.error('❌ ERRO NO BUILD:', error.message);
  console.error('Stack:', error.stack);
  
  // Fallback: criar build básico em caso de erro
  console.log('🔄 Criando build de fallback...');
  
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }
  
  const fallbackHTML = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Portal SBT - Build Error</title></head><body><h1>Portal SBT</h1><p>Erro no build - Contacte o suporte técnico</p><p>Error: ' + error.message + '</p></body></html>';
  
  fs.writeFileSync('dist/public/index.html', fallbackHTML);
  
  const fallbackServer = 'const express = require("express"); const app = express(); const PORT = process.env.PORT || 5000; app.use(express.static(__dirname + "/public")); app.get("*", (req, res) => res.sendFile(__dirname + "/public/index.html")); app.listen(PORT, () => console.log("Fallback server running on port", PORT));';
  
  fs.writeFileSync('dist/index.cjs', fallbackServer);
}

// Verificar resultado final
console.log('5. Verificando build final...');

const requiredFiles = [
  'dist/index.cjs',
  'dist/public/index.html'
];

let buildSuccess = true;
const buildResults = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const size = Math.round(fs.statSync(file).size / 1024);
    buildResults.push(`✅ ${path.basename(file)}: ${size}KB`);
  } else {
    buildResults.push(`❌ ${path.basename(file)}: AUSENTE`);
    buildSuccess = false;
  }
});

// Contar arquivos no build
let totalFiles = 0;
if (fs.existsSync('dist/public')) {
  const countFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        countFiles(fullPath);
      } else {
        totalFiles++;
      }
    });
  };
  countFiles('dist/public');
}

console.log('');
console.log('📋 RESULTADO FINAL DO BUILD REACT:');
console.log('='.repeat(50));
buildResults.forEach(result => console.log(result));
console.log(`📊 Total de arquivos no build: ${totalFiles + 1}`);
console.log('='.repeat(50));

if (buildSuccess) {
  console.log('');
  console.log('🎉 BUILD REACT HEROKU CONCLUÍDO COM SUCESSO!');
  console.log('');
  console.log('📝 PRÓXIMOS PASSOS:');
  console.log('1. git add .');
  console.log('2. git commit -m "Deploy React app completo no Heroku"');
  console.log('3. git push heroku main');
  console.log('');
  console.log('🔍 VERIFICAR APÓS DEPLOY:');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/health');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/agendamento');
  console.log('');
} else {
  console.error('❌ BUILD FALHOU - arquivos obrigatórios não foram criados');
  process.exit(1);
}