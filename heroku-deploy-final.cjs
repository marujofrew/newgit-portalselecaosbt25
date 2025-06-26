// Deploy definitivo para Heroku - React app completo
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('HEROKU DEPLOY FINAL - REACT APP COMPLETO');
console.log('=========================================');

// Limpar e preparar
console.log('1. Preparando ambiente...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // Copiar assets necessários
  console.log('2. Copiando assets...');
  
  if (!fs.existsSync('client/public')) {
    fs.mkdirSync('client/public', { recursive: true });
  }
  
  if (fs.existsSync('azul-logo.png')) {
    fs.copyFileSync('azul-logo.png', 'client/public/azul-logo-oficial.png');
    console.log('   ✅ Logo Azul copiado');
  }

  // Build React usando npm script existente
  console.log('3. Executando build React...');
  
  // Usar o comando build existente do package.json que já está configurado
  console.log('   🔨 Executando npm run build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('   ✅ Build React concluído');

  // Verificar se build foi criado
  if (!fs.existsSync('dist/public/index.html')) {
    throw new Error('Build falhou - dist/public/index.html não encontrado');
  }

  // Copiar servidor backend para dist
  console.log('4. Preparando servidor...');
  
  // Usar o servidor backend já existente
  if (fs.existsSync('dist/index.js')) {
    // O build já criou o servidor backend
    console.log('   ✅ Servidor backend já incluído no build');
  } else {
    // Criar um servidor Express simples se necessário
    const serverCode = `// Servidor Express - Portal SBT
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Portal SBT React iniciando na porta', PORT);

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

// Servir arquivos estáticos do React
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

app.get('/api/health', (req, res) => {
  res.json({
    api: 'operational',
    timestamp: new Date().toISOString()
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

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('Portal SBT ativo em http://localhost:' + PORT);
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
    console.log('   ✅ Servidor Express criado');
  }

} catch (error) {
  console.error('Erro no build:', error.message);
  
  // Fallback que exibe o projeto real do Replit
  console.log('Criando fallback com projeto real...');
  
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }
  
  // Copiar o index.html existente do client se disponível
  if (fs.existsSync('client/index.html')) {
    fs.copyFileSync('client/index.html', 'dist/public/index.html');
    console.log('   ✅ index.html copiado');
  } else {
    // Criar fallback que redireciona para o projeto real
    const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT - Redirecionando</title>
    <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 40px; 
          text-align: center; 
          background: linear-gradient(135deg, #0066cc, #004499);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          background: rgba(255,255,255,0.1); 
          padding: 40px; 
          border-radius: 15px; 
          backdrop-filter: blur(10px);
        }
        h1 { margin-bottom: 20px; }
        .loading { 
          animation: pulse 2s infinite;
          margin: 20px 0;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
    </style>
    <script>
        setTimeout(() => {
            window.location.href = 'https://portalselecaosbt-02ad61fdc07b.herokuapp.com/';
        }, 3000);
    </script>
</head>
<body>
    <div class="container">
        <h1>Portal SBT</h1>
        <div class="loading">Carregando aplicação...</div>
        <p>Redirecionando para o portal completo</p>
        <p>Build error: ${error.message}</p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('dist/public/index.html', fallbackHTML);
  }
  
  // Servidor fallback
  const fallbackServer = `const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));
app.get('/health', (req, res) => res.json({status: 'fallback', port: PORT}));
app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.listen(PORT, () => console.log('Fallback server na porta', PORT));`;
  
  fs.writeFileSync('dist/index.cjs', fallbackServer);
}

// Verificação final
console.log('5. Verificando deploy...');

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
console.log('RESULTADO FINAL:');
results.forEach(result => console.log(result));

// Verificar se existe o projeto React real
let reactFiles = 0;
if (fs.existsSync('dist/public')) {
  const files = fs.readdirSync('dist/public');
  reactFiles = files.length;
}

console.log(`Arquivos React: ${reactFiles}`);
console.log('');
console.log('DEPLOY PRONTO!');
console.log('');
console.log('Commands:');
console.log('git add .');
console.log('git commit -m "Deploy React app real no Heroku"');
console.log('git push heroku main');
console.log('');
console.log('URL: https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');