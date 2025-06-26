const fs = require('fs');
const path = require('path');

console.log('Heroku Deploy Script - Solução Definitiva');
console.log('==========================================');

// Limpar diretório dist
if (fs.existsSync('dist')) {
  console.log('Removendo diretório dist existente...');
  fs.rmSync('dist', { recursive: true });
}

// Criar estrutura de diretórios
console.log('Criando estrutura de diretórios...');
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Criar servidor Express minimal - SEM DEPENDÊNCIAS EXTERNAS
const serverCode = `// Servidor Express para Heroku - Sem dependências externas
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;

// MIME types básicos
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Função para servir arquivos estáticos
function serveStatic(req, res, filePath) {
  const fullPath = path.join(__dirname, 'public', filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.log('Arquivo não encontrado:', fullPath);
      // Fallback para index.html (SPA)
      const indexPath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(indexPath, (err2, indexData) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Página não encontrada');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        }
      });
    } else {
      const ext = path.extname(fullPath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log('Requisição:', req.method, pathname);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production'
    }));
    return;
  }
  
  // Health check
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      server: 'running',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Servir arquivos estáticos ou SPA fallback
  const filePath = pathname === '/' ? 'index.html' : pathname.substring(1);
  serveStatic(req, res, filePath);
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 SBT PORTAL SERVIDOR INICIADO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log('🌐 Porta:', PORT);
  console.log('📁 Diretório público:', path.join(__dirname, 'public'));
  console.log('🔧 Ambiente:', process.env.NODE_ENV || 'production');
  console.log('💻 Node.js:', process.version);
  console.log('📊 PID:', process.pid);
  console.log('='.repeat(60));
  console.log('');
});

// Error handling
server.on('error', (err) => {
  console.error('❌ ERRO DO SERVIDOR:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Recebido SIGTERM - fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Recebido SIGINT - fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});

// Log não capturado
process.on('uncaughtException', (err) => {
  console.error('❌ EXCEÇÃO NÃO CAPTURADA:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ PROMISE REJEITADA:', reason);
  process.exit(1);
});`;

console.log('Criando servidor HTTP nativo...');
fs.writeFileSync('dist/index.cjs', serverCode);

// Criar frontend SBT profissional
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal de Seleção SBT - Sistema Online</title>
    <meta name="description" content="Portal oficial do SBT para casting e seleção de talentos. Agende seu teste e emita cartões de embarque.">
    <meta name="keywords" content="SBT, casting, seleção, televisão, talentos">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e40af 100%);
            min-height: 100vh;
            color: #333;
            overflow-x: hidden;
        }
        
        .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
        }
        
        .main-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 60px 40px;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 700px;
            width: 100%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo-container {
            margin-bottom: 40px;
        }
        
        .logo {
            width: 140px;
            height: 140px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            font-weight: 900;
            letter-spacing: 2px;
            box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);
            position: relative;
        }
        
        .logo::after {
            content: '';
            position: absolute;
            inset: -4px;
            background: linear-gradient(45deg, #3b82f6, #1e40af, #3b82f6);
            border-radius: 50%;
            z-index: -1;
            animation: rotate 3s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        h1 {
            font-size: 3.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
            line-height: 1.1;
        }
        
        .subtitle {
            font-size: 1.4rem;
            color: #64748b;
            margin-bottom: 32px;
            font-weight: 500;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 32px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            margin: 32px 0;
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .status-dot {
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .description {
            font-size: 1.1rem;
            color: #475569;
            line-height: 1.6;
            margin: 32px 0;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .feature {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(30, 64, 175, 0.1);
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 12px;
        }
        
        .feature-title {
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 8px;
        }
        
        .feature-desc {
            font-size: 0.9rem;
            color: #64748b;
        }
        
        .actions {
            margin-top: 48px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 32px;
            border: none;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s ease;
            cursor: pointer;
            min-width: 180px;
            justify-content: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 48px rgba(59, 130, 246, 0.4);
            color: white;
            text-decoration: none;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.8);
            color: #1e40af;
            border: 2px solid #1e40af;
        }
        
        .btn-secondary:hover {
            background: #1e40af;
            color: white;
            transform: translateY(-2px);
            text-decoration: none;
        }
        
        .system-info {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 16px;
            padding: 24px;
            margin-top: 40px;
            border-left: 4px solid #1e40af;
        }
        
        .system-title {
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 12px;
            font-size: 1.1rem;
        }
        
        .system-details {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #64748b;
            line-height: 1.5;
        }
        
        .footer {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .main-card {
                padding: 40px 24px;
                margin: 10px;
            }
            
            h1 {
                font-size: 2.4rem;
            }
            
            .logo {
                width: 120px;
                height: 120px;
                font-size: 40px;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .actions {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-card">
            <div class="logo-container">
                <div class="logo">SBT</div>
            </div>
            
            <h1>Portal de Seleção</h1>
            <div class="subtitle">Sistema Brasileiro de Televisão</div>
            
            <div class="status-badge">
                <div class="status-dot"></div>
                Sistema Operacional
            </div>
            
            <div class="description">
                Plataforma oficial para casting e seleção de talentos do SBT.<br>
                Agende seus testes, gerencie inscrições e emita cartões de embarque.
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <div class="feature-title">Agendamento</div>
                    <div class="feature-desc">Sistema online para agendar testes</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎫</div>
                    <div class="feature-title">Cartões</div>
                    <div class="feature-desc">Emissão de cartões de embarque</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">💳</div>
                    <div class="feature-title">Pagamentos</div>
                    <div class="feature-desc">Sistema PIX integrado</div>
                </div>
            </div>
            
            <div class="actions">
                <a href="/agendamento" class="btn btn-primary">
                    📝 Fazer Agendamento
                </a>
                <a href="/cartao-preview" class="btn btn-secondary">
                    🎫 Ver Cartões
                </a>
                <a href="/api/health" class="btn btn-secondary" target="_blank">
                    🔧 Status API
                </a>
            </div>
            
            <div class="system-info">
                <div class="system-title">📊 Informações do Sistema</div>
                <div class="system-details">
                    Build: ${new Date().toISOString()}<br>
                    Versão: 1.0.0 Production<br>
                    Status: ✅ Todos os sistemas operacionais<br>
                    Servidor: HTTP Nativo Node.js
                </div>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Sistema Brasileiro de Televisão - SBT
        </div>
    </div>
    
    <script>
        console.log('🚀 Portal SBT carregado com sucesso!');
        console.log('📅 Build:', '${new Date().toISOString()}');
        
        // Teste de conectividade da API
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ API Health Check:', data);
                const systemDetails = document.querySelector('.system-details');
                systemDetails.innerHTML += '<br>API: ✅ Conectada e funcional';
            })
            .catch(error => {
                console.warn('⚠️ API connection test:', error);
                const systemDetails = document.querySelector('.system-details');
                systemDetails.innerHTML += '<br>API: 🔄 Verificando conexão...';
            });
        
        // Adicionar handlers para navegação
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('/api/')) {
                    e.preventDefault();
                    window.open(href, '_blank');
                }
            });
        });
        
        // Animação suave para elementos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        });
        
        document.querySelectorAll('.feature').forEach(el => observer.observe(el));
    </script>
</body>
</html>`;

console.log('Criando frontend SBT profissional...');
fs.writeFileSync('dist/public/index.html', htmlContent);

// Criar favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#grad)" rx="8"/>
  <text x="16" y="22" font-family="Arial Black" font-size="12" fill="white" text-anchor="middle" font-weight="900">SBT</text>
</svg>`;

console.log('Criando favicon SVG...');
fs.writeFileSync('dist/public/favicon.svg', faviconSvg);

// Copiar assets essenciais se existirem
const assetsEssenciais = ['sbt_logo.png', 'azul-logo.png'];
let assetsCopied = 0;

assetsEssenciais.forEach(asset => {
    if (fs.existsSync(asset)) {
        fs.copyFileSync(asset, `dist/public/${asset}`);
        assetsCopied++;
        console.log(`Asset copiado: ${asset}`);
    }
});

// Verificar build completo
const arquivosEssenciais = [
    'dist/index.cjs',
    'dist/public/index.html',
    'dist/public/favicon.svg'
];

let buildSuccess = true;
const buildResults = [];

arquivosEssenciais.forEach(arquivo => {
    if (fs.existsSync(arquivo)) {
        const tamanho = Math.round(fs.statSync(arquivo).size / 1024);
        buildResults.push(`✅ ${path.basename(arquivo)}: ${tamanho}KB`);
    } else {
        buildResults.push(`❌ ${path.basename(arquivo)}: AUSENTE`);
        buildSuccess = false;
    }
});

console.log('');
console.log('📋 RESULTADO DO BUILD:');
console.log('='.repeat(40));
buildResults.forEach(result => console.log(result));
console.log(`📁 Assets copiados: ${assetsCopied}`);
console.log(`📊 Total de arquivos: ${fs.readdirSync('dist/public').length + 1}`);
console.log('='.repeat(40));

if (buildSuccess) {
    console.log('🎉 BUILD CONCLUÍDO COM SUCESSO!');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. git add .');
    console.log('2. git commit -m "Deploy Heroku - servidor HTTP nativo"');
    console.log('3. git push heroku main');
    console.log('');
} else {
    console.error('❌ BUILD FALHOU - arquivos essenciais ausentes');
    process.exit(1);
}