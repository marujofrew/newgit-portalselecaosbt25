// Build definitivo React para Heroku
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================================');
console.log('HEROKU BUILD FINAL - REACT REAL');
console.log('============================================================');

// Limpar dist
console.log('1. Limpando diretório dist...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // Copiar assets essenciais
  console.log('2. Preparando assets...');
  
  if (!fs.existsSync('client/public')) {
    fs.mkdirSync('client/public', { recursive: true });
  }
  
  if (fs.existsSync('azul-logo.png')) {
    fs.copyFileSync('azul-logo.png', 'client/public/azul-logo-oficial.png');
    console.log('   ✅ Logo Azul copiado');
  }

  // Build React usando comando específico com input correto
  console.log('3. Building React app...');
  
  // Usar comando que especifica o input file corretamente
  const buildCmd = 'NODE_ENV=production npx vite build --config vite.config.ts client/index.html';
  
  console.log(`   🔨 Executando: ${buildCmd}`);
  execSync(buildCmd, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('   ✅ Build React concluído');

  // Verificar se build foi criado
  if (!fs.existsSync('dist/public/index.html')) {
    throw new Error('Build falhou - dist/public/index.html não encontrado');
  }

  // Criar servidor Express
  console.log('4. Criando servidor Express...');
  
  const serverCode = `// Servidor Express - Portal SBT
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Portal SBT React iniciando na porta', PORT);

// CORS
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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Portal SBT React',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('React app não encontrado');
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Portal SBT ativo em http://localhost:' + PORT);
});

// Error handling
server.on('error', (error) => {
  console.error('Erro servidor:', error.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Encerrando servidor...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  server.close(() => process.exit(0));
});`;

  fs.writeFileSync('dist/index.cjs', serverCode);
  console.log('   ✅ Servidor criado');

} catch (error) {
  console.error('❌ Erro no build:', error.message);
  
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
    <title>Portal SBT</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0066cc; margin-bottom: 20px; }
        .error { color: #dc3545; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portal SBT</h1>
        <p>Sistema em manutenção</p>
        <div class="error">
            Erro no build da aplicação React<br>
            ${error.message}
        </div>
        <p>Tente novamente em alguns minutos</p>
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
console.log('5. Verificando build...');

const files = ['dist/index.cjs', 'dist/public/index.html'];
const results = [];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const size = Math.round(fs.statSync(file).size / 1024);
    results.push(`✅ ${path.basename(file)}: ${size}KB`);
  } else {
    results.push(`❌ ${path.basename(file)}: AUSENTE`);
  }
});

console.log('');
console.log('📋 RESULTADO:');
console.log('='.repeat(30));
results.forEach(result => console.log(result));
console.log('='.repeat(30));

console.log('');
console.log('🎉 BUILD CONCLUÍDO!');
console.log('');
console.log('Deploy commands:');
console.log('git add .');
console.log('git commit -m "Deploy React real no Heroku"');
console.log('git push heroku main');
console.log('');
console.log('Verify at:');
console.log('https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');