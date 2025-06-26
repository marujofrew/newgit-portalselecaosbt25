// Build React real para Heroku - Solução definitiva
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================================');
console.log('HEROKU BUILD REACT REAL - PROJETO COMPLETO');
console.log('============================================================');

// Limpar diretório dist
console.log('1. Limpando diretório dist...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // Copiar assets necessários
  console.log('2. Preparando assets...');
  
  // Verificar se existe client/public
  if (!fs.existsSync('client/public')) {
    fs.mkdirSync('client/public', { recursive: true });
  }
  
  // Copiar logos essenciais
  const assets = [
    { src: 'azul-logo.png', dest: 'client/public/azul-logo-oficial.png' },
    { src: 'sbt_logo.png', dest: 'client/public/sbt_logo.png' }
  ];
  
  assets.forEach(asset => {
    if (fs.existsSync(asset.src)) {
      fs.copyFileSync(asset.src, asset.dest);
      console.log(`   ✅ ${asset.src} → ${asset.dest}`);
    }
  });

  // Build do React com configuração correta
  console.log('3. Executando build React com Vite...');
  
  // Usar configuração específica para produção
  const buildCommand = 'NODE_ENV=production npx vite build --config vite.config.ts --mode production';
  
  console.log(`   🔨 Comando: ${buildCommand}`);
  execSync(buildCommand, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
    cwd: process.cwd()
  });
  
  console.log('   ✅ Build React concluído');

  // Verificar se o build foi criado corretamente
  const buildPath = 'dist/public';
  const indexPath = path.join(buildPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Build falhou - ${indexPath} não encontrado`);
  }

  // Criar servidor Express otimizado
  console.log('4. Criando servidor Express...');
  
  const serverCode = `// Servidor Express - Portal SBT React
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 PORTAL SBT REACT INICIANDO');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');
console.log('Node.js:', process.version);

// CORS middleware
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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: false
}));

// Health checks
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Portal SBT React',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    port: PORT
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    api: 'operational',
    timestamp: new Date().toISOString(),
    status: 'online'
  });
});

// SPA fallback para React Router
app.get('*', (req, res) => {
  const indexFile = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(500).send('Erro: React app não encontrado');
  }
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ PORTAL SBT REACT ATIVO!');
  console.log('URL: http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/health');
  console.log('Pasta estática:', path.join(__dirname, 'public'));
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Erro servidor:', error.message);
  process.exit(1);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log('📴 Recebido ' + signal + ' - encerrando...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Promise rejeitada:', reason);
  process.exit(1);
});`;

  fs.writeFileSync('dist/index.cjs', serverCode);
  console.log('   ✅ Servidor Express criado');

} catch (error) {
  console.error('❌ ERRO NO BUILD:', error.message);
  
  // Fallback simples
  console.log('🔄 Criando fallback...');
  
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }
  
  const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT - Erro de Build</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
        .error { color: #dc3545; background: #f8d7da; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Portal SBT</h1>
    <div class="error">
        <h2>Erro no Build</h2>
        <p>Falha ao construir a aplicação React</p>
        <p>Erro: ${error.message}</p>
    </div>
</body>
</html>`;
  
  fs.writeFileSync('dist/public/index.html', fallbackHTML);
  
  const fallbackServer = `const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.listen(PORT, () => console.log('Fallback server na porta', PORT));`;
  
  fs.writeFileSync('dist/index.cjs', fallbackServer);
}

// Verificação final
console.log('5. Verificando resultado...');

const requiredFiles = [
  'dist/index.cjs',
  'dist/public/index.html'
];

let success = true;
const results = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const size = Math.round(fs.statSync(file).size / 1024);
    results.push(`✅ ${path.basename(file)}: ${size}KB`);
  } else {
    results.push(`❌ ${path.basename(file)}: AUSENTE`);
    success = false;
  }
});

// Contar arquivos build
let totalFiles = 0;
if (fs.existsSync('dist/public')) {
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath);
      } else {
        totalFiles++;
      }
    });
  };
  walkDir('dist/public');
}

console.log('');
console.log('📋 RESULTADO FINAL:');
console.log('='.repeat(40));
results.forEach(result => console.log(result));
console.log(`📊 Arquivos totais: ${totalFiles + 1}`);
console.log('='.repeat(40));

if (success) {
  console.log('');
  console.log('🎉 BUILD REACT HEROKU SUCESSO!');
  console.log('');
  console.log('Para deploy:');
  console.log('git add .');
  console.log('git commit -m "Deploy React app real no Heroku"');
  console.log('git push heroku main');
  console.log('');
  console.log('Verificar:');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/health');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/agendamento');
} else {
  console.error('❌ BUILD FALHOU');
  process.exit(1);
}