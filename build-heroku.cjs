// Build script para Heroku - Executa automaticamente no deploy
const fs = require('fs');

console.log('Heroku Build - Iniciando...');

// Limpar diretório dist
if (fs.existsSync('dist')) {
  console.log('Limpando diretório dist...');
  fs.rmSync('dist', { recursive: true });
}

// Criar estrutura
console.log('Criando estrutura de diretórios...');
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Servidor HTTP nativo - sem dependências
const serverCode = `// Servidor para Heroku
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

console.log('Iniciando servidor SBT Portal...');

const server = http.createServer((req, res) => {
  const url = req.url;
  console.log('Request:', req.method, url);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check
  if (url === '/health' || url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0'
    }));
    return;
  }
  
  // Servir arquivos estáticos
  let filePath = url === '/' ? '/index.html' : url;
  const fullPath = path.join(__dirname, 'public', filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // Fallback para SPA
      const indexPath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(indexPath, (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        }
      });
    } else {
      const ext = path.extname(fullPath);
      let contentType = 'text/plain';
      
      switch (ext) {
        case '.html': contentType = 'text/html'; break;
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('====================================');
  console.log('✅ SBT PORTAL ATIVO NO HEROKU!');
  console.log('====================================');
  console.log('Porta:', PORT);
  console.log('Ambiente:', process.env.NODE_ENV || 'production');
  console.log('Node.js:', process.version);
  console.log('PID:', process.pid);
  console.log('====================================');
  console.log('');
});

// Error handling
server.on('error', (error) => {
  console.error('Erro do servidor:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM - fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Exceção não capturada:', error);
  process.exit(1);
});`;

fs.writeFileSync('dist/index.cjs', serverCode);

// Frontend SBT
const frontendCode = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT - Sistema de Casting</title>
    <meta name="description" content="Portal oficial do SBT para casting e seleção de talentos">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 20px;
        }
        
        .main-container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 60px 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #ffffff, #e2e8f0);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 900;
            color: #1e40af;
            box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
        }
        
        h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 16px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .subtitle {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        .status {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 700;
            margin: 30px 0;
            display: inline-block;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        
        .description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 30px 0;
            opacity: 0.95;
        }
        
        .buttons {
            margin-top: 40px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }
        
        .btn {
            background: rgba(255, 255, 255, 0.9);
            color: #1e40af;
            padding: 16px 32px;
            border: none;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s ease;
            min-width: 160px;
            display: inline-block;
        }
        
        .btn:hover {
            background: white;
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
            color: #1e40af;
            text-decoration: none;
        }
        
        .btn-outline {
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.8);
        }
        
        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-color: white;
        }
        
        .system-info {
            margin-top: 40px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .main-container { padding: 40px 30px; }
            h1 { font-size: 2.5rem; }
            .buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 280px; }
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="logo">SBT</div>
        
        <h1>Portal SBT</h1>
        <div class="subtitle">Sistema Brasileiro de Televisão</div>
        
        <div class="status">🟢 Sistema Online</div>
        
        <div class="description">
            Portal oficial para casting e seleção de talentos.<br>
            Faça seu agendamento e gerencie cartões de embarque.
        </div>
        
        <div class="buttons">
            <a href="/agendamento" class="btn">📝 Fazer Agendamento</a>
            <a href="/cartao-preview" class="btn">🎫 Cartões de Embarque</a>
            <a href="/health" class="btn btn-outline" target="_blank">🔧 Status do Sistema</a>
        </div>
        
        <div class="system-info">
            <strong>Informações do Sistema</strong><br>
            Deploy: ${new Date().toISOString()}<br>
            Versão: 1.0.0 Production<br>
            Servidor: HTTP Nativo Node.js
        </div>
    </div>
    
    <script>
        console.log('Portal SBT carregado com sucesso!');
        
        // Teste de conectividade
        fetch('/health')
            .then(response => response.json())
            .then(data => {
                console.log('Health check OK:', data);
                document.querySelector('.system-info').innerHTML += '<br>API: ✅ Funcionando';
            })
            .catch(error => {
                console.log('Health check:', error);
                document.querySelector('.system-info').innerHTML += '<br>API: 🔄 Carregando...';
            });
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', frontendCode);

// Verificar build
const serverExists = fs.existsSync('dist/index.cjs');
const htmlExists = fs.existsSync('dist/public/index.html');

if (serverExists && htmlExists) {
  const serverSize = Math.round(fs.statSync('dist/index.cjs').size / 1024);
  const htmlSize = Math.round(fs.statSync('dist/public/index.html').size / 1024);
  
  console.log('');
  console.log('✅ BUILD HEROKU CONCLUÍDO!');
  console.log('==========================');
  console.log(`📦 Servidor: ${serverSize}KB`);
  console.log(`🌐 Frontend: ${htmlSize}KB`);
  console.log('🚀 Pronto para deploy!');
  console.log('');
} else {
  console.error('❌ Build falhou - arquivos não criados');
  process.exit(1);
}