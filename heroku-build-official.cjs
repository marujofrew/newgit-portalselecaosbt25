// Build oficial do projeto React para Heroku
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('HEROKU BUILD OFICIAL - PROJETO REPLIT REAL');
console.log('==========================================');

// Limpar e preparar
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // 1. Preparar assets essenciais
  console.log('1. Preparando assets...');
  
  if (!fs.existsSync('client/public')) {
    fs.mkdirSync('client/public', { recursive: true });
  }
  
  // Copiar logos necessários
  const assets = [
    { src: 'azul-logo.png', dest: 'client/public/azul-logo-oficial.png' },
    { src: 'sbt_logo.png', dest: 'client/public/sbt_logo.png' }
  ];
  
  assets.forEach(asset => {
    if (fs.existsSync(asset.src)) {
      fs.copyFileSync(asset.src, asset.dest);
      console.log(`   ✅ ${asset.src} copiado`);
    }
  });

  // 2. Executar build real do Vite sem timeout
  console.log('2. Executando build Vite oficial...');
  
  // Usar comando build específico para produção
  const viteCmd = 'NODE_ENV=production npx vite build --config vite.config.ts --mode production --logLevel info';
  
  console.log(`   🔨 ${viteCmd}`);
  execSync(viteCmd, { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      VITE_BUILD_TARGET: 'heroku'
    },
    timeout: 120000 // 2 minutos
  });
  
  console.log('   ✅ Build Vite concluído com sucesso');

  // 3. Verificar se o build foi criado corretamente
  const buildFiles = [
    'dist/public/index.html',
    'dist/public/assets'
  ];
  
  let buildSuccess = true;
  buildFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`   ❌ ${file} não encontrado`);
      buildSuccess = false;
    }
  });
  
  if (!buildSuccess) {
    throw new Error('Build do frontend falhou - arquivos essenciais não encontrados');
  }

  // 4. Verificar se servidor backend existe
  console.log('3. Verificando servidor backend...');
  
  if (fs.existsSync('dist/index.js')) {
    console.log('   ✅ Servidor backend incluído no build');
  } else {
    // Criar servidor Express para servir o React
    console.log('   📝 Criando servidor Express...');
    
    const serverCode = `// Servidor Express - Portal SBT React Oficial
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Portal SBT React Oficial');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');

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

// Middleware para parse JSON
app.use(express.json());

// Servir arquivos estáticos do React build
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: false
}));

// Health checks
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Portal SBT React Oficial',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    build: 'official-replit-project'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    api: 'operational',
    service: 'Portal SBT API',
    timestamp: new Date().toISOString(),
    status: 'online'
  });
});

// API routes básicas do projeto
app.get('/api/passengers', (req, res) => {
  // Retornar dados salvos no localStorage ou array vazio
  res.json({
    passengers: [],
    message: 'Use localStorage no frontend para dados dos passageiros'
  });
});

app.post('/api/pix/create', (req, res) => {
  // Endpoint básico para PIX (implementação real requer chave API)
  res.json({
    success: true,
    qrCode: 'data:image/png;base64,placeholder',
    pixCode: '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540529.905802BR5925Portal SBT6009SAO PAULO62070503***63041D3D',
    amount: req.body.amount || '29.90',
    message: 'PIX gerado - implementação de demonstração'
  });
});

app.get('/api/pix/status/:id', (req, res) => {
  res.json({
    status: 'pending',
    id: req.params.id,
    message: 'Verificação de status PIX'
  });
});

// SPA fallback - TODAS as rotas não-API servem o React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'React app não encontrado',
      path: indexPath,
      available: fs.existsSync(path.join(__dirname, 'public'))
    });
  }
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Portal SBT React ativo!');
  console.log('URL: http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/health');
  console.log('Pasta estática:', path.join(__dirname, 'public'));
  
  // Listar arquivos disponíveis
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    console.log('Arquivos disponíveis:', files.length);
  }
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Erro do servidor:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido - encerrando...');
  server.close(() => {
    console.log('✅ Servidor encerrado gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT recebido - encerrando...');
  server.close(() => {
    console.log('✅ Servidor encerrado gracefully');
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
  console.error('Promise:', promise);
  process.exit(1);
});`;

    fs.writeFileSync('dist/index.cjs', serverCode);
    console.log('   ✅ Servidor Express criado');
  }

} catch (error) {
  console.error('❌ ERRO NO BUILD:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// 5. Verificação final
console.log('4. Verificação final...');

const requiredFiles = [
  'dist/index.cjs',
  'dist/public/index.html'
];

let allFilesExist = true;
const results = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const size = Math.round(fs.statSync(file).size / 1024);
    results.push(`✅ ${path.basename(file)}: ${size}KB`);
  } else {
    results.push(`❌ ${path.basename(file)}: AUSENTE`);
    allFilesExist = false;
  }
});

// Contar arquivos totais
let totalFiles = 0;
if (fs.existsSync('dist/public')) {
  const countFiles = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
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
console.log('📋 RESULTADO FINAL DO BUILD OFICIAL:');
console.log('='.repeat(50));
results.forEach(result => console.log(result));
console.log(`📊 Total de arquivos React: ${totalFiles}`);
console.log('='.repeat(50));

if (allFilesExist && totalFiles > 0) {
  console.log('');
  console.log('🎉 BUILD OFICIAL CONCLUÍDO COM SUCESSO!');
  console.log('');
  console.log('O projeto React oficial do Replit está pronto para deploy');
  console.log('');
  console.log('📝 COMANDOS PARA DEPLOY:');
  console.log('git add .');
  console.log('git commit -m "Deploy projeto React oficial do Replit"');
  console.log('git push heroku main');
  console.log('');
  console.log('🔍 VERIFICAR APÓS DEPLOY:');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/health');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/agendamento');
  console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/cartao-preview');
  console.log('');
} else {
  console.error('❌ BUILD FALHOU - arquivos obrigatórios não foram criados');
  process.exit(1);
}