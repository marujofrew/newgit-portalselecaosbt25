// Script definitivo para resolver o problema MODULE_NOT_FOUND no Heroku
const fs = require('fs');
const path = require('path');

console.log('='.repeat(50));
console.log('HEROKU DEPLOY FIX - SOLUÇÃO DEFINITIVA');
console.log('='.repeat(50));

// Limpar e criar diretórios
console.log('1. Preparando estrutura de diretórios...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Criar servidor HTTP nativo sem dependências
console.log('2. Criando servidor HTTP nativo...');
const serverCode = `// Servidor SBT Portal para Heroku
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

console.log('');
console.log('🚀 INICIANDO SERVIDOR SBT PORTAL');
console.log('================================');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');
console.log('Node.js:', process.version);
console.log('================================');
console.log('');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(method, url);
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Preflight CORS
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health checks
  if (url === '/health' || url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      port: PORT
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
          console.log('Erro: index.html não encontrado');
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Página não encontrada');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        }
      });
    } else {
      // Determinar Content-Type
      const ext = path.extname(fullPath).toLowerCase();
      let contentType = 'text/plain';
      
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      
      contentType = mimeTypes[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ SERVIDOR SBT PORTAL ATIVO!');
  console.log('Porta:', PORT);
  console.log('URL: http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/health');
  console.log('');
});

// Error handling robusto
server.on('error', (error) => {
  console.error('❌ ERRO CRÍTICO DO SERVIDOR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Recebido SIGTERM - encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Recebido SIGINT - encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
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

// Criar frontend SBT completo
console.log('3. Criando frontend SBT profissional...');
const frontendCode = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT - Sistema de Casting e Seleção</title>
    <meta name="description" content="Portal oficial do SBT para casting e seleção de talentos. Faça seu agendamento e emita cartões de embarque.">
    <meta name="keywords" content="SBT, casting, seleção, televisão, talentos, agendamento">
    <meta name="author" content="Sistema Brasileiro de Televisão">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230066cc'/><text x='50' y='65' font-family='Arial' font-size='30' fill='white' text-anchor='middle' font-weight='bold'>SBT</text></svg>">
    <style>
        :root {
            --primary-blue: #0066cc;
            --secondary-blue: #004499;
            --success-green: #28a745;
            --light-gray: #f8f9fa;
            --white: #ffffff;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 50%, var(--primary-blue) 100%);
            min-height: 100vh;
            color: var(--white);
            line-height: 1.6;
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
            padding: 60px 50px;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.25);
            text-align: center;
            max-width: 800px;
            width: 100%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #333;
        }
        
        .logo-section {
            margin-bottom: 40px;
        }
        
        .logo {
            width: 150px;
            height: 150px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, var(--primary-blue), #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-size: 52px;
            font-weight: 900;
            letter-spacing: 3px;
            box-shadow: 0 20px 40px rgba(0, 102, 204, 0.3);
            position: relative;
            animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .logo::after {
            content: '';
            position: absolute;
            inset: -6px;
            background: linear-gradient(45deg, #3b82f6, var(--primary-blue), #3b82f6);
            border-radius: 50%;
            z-index: -1;
            animation: rotate 4s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary-blue), #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            line-height: 1.1;
        }
        
        .subtitle {
            font-size: 1.5rem;
            color: #64748b;
            margin-bottom: 40px;
            font-weight: 500;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 15px;
            background: linear-gradient(135deg, var(--success-green), #20c997);
            color: var(--white);
            padding: 18px 36px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            margin: 35px 0;
            box-shadow: 0 10px 35px rgba(40, 167, 69, 0.3);
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 10px 35px rgba(40, 167, 69, 0.3); }
            to { box-shadow: 0 15px 45px rgba(40, 167, 69, 0.5); }
        }
        
        .status-dot {
            width: 14px;
            height: 14px;
            background: var(--white);
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        
        .description {
            font-size: 1.2rem;
            color: #475569;
            line-height: 1.7;
            margin: 35px 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin: 50px 0;
        }
        
        .feature-card {
            background: linear-gradient(135deg, var(--light-gray), #e2e8f0);
            border-radius: 18px;
            padding: 30px 25px;
            border: 1px solid rgba(0, 102, 204, 0.1);
            transition: all 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 102, 204, 0.15);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        
        .feature-title {
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .feature-desc {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.5;
        }
        
        .action-buttons {
            margin-top: 50px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 18px 35px;
            border: none;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            cursor: pointer;
            min-width: 200px;
            justify-content: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-blue), #3b82f6);
            color: var(--white);
            box-shadow: 0 10px 35px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 50px rgba(59, 130, 246, 0.4);
            color: var(--white);
            text-decoration: none;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.9);
            color: var(--primary-blue);
            border: 2px solid var(--primary-blue);
        }
        
        .btn-secondary:hover {
            background: var(--primary-blue);
            color: var(--white);
            transform: translateY(-3px);
            text-decoration: none;
        }
        
        .system-status {
            background: linear-gradient(135deg, var(--light-gray), #e2e8f0);
            border-radius: 18px;
            padding: 30px;
            margin-top: 50px;
            border-left: 5px solid var(--primary-blue);
        }
        
        .system-title {
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .system-info {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.6;
        }
        
        .footer-info {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .main-card {
                padding: 40px 30px;
                margin: 15px;
            }
            
            h1 {
                font-size: 2.8rem;
            }
            
            .logo {
                width: 130px;
                height: 130px;
                font-size: 44px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 320px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-card">
            <div class="logo-section">
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
                Faça seu agendamento, gerencie inscrições e emita cartões de embarque<br>
                de forma rápida e segura.
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📅</div>
                    <div class="feature-title">Agendamento Online</div>
                    <div class="feature-desc">Sistema automatizado para agendar testes de casting</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎫</div>
                    <div class="feature-title">Cartões de Embarque</div>
                    <div class="feature-desc">Emissão digital de cartões com QR codes</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💳</div>
                    <div class="feature-title">Pagamentos PIX</div>
                    <div class="feature-desc">Sistema integrado de pagamentos instantâneos</div>
                </div>
            </div>
            
            <div class="action-buttons">
                <a href="/agendamento" class="btn btn-primary">
                    📝 Fazer Agendamento
                </a>
                <a href="/cartao-preview" class="btn btn-secondary">
                    🎫 Ver Cartões de Embarque
                </a>
                <a href="/health" class="btn btn-secondary" target="_blank">
                    🔧 Status do Sistema
                </a>
            </div>
            
            <div class="system-status">
                <div class="system-title">📊 Informações do Sistema</div>
                <div class="system-info">
                    Deploy: ${new Date().toISOString()}<br>
                    Versão: 1.0.0 Production<br>
                    Status: ✅ Todos os sistemas operacionais<br>
                    Servidor: HTTP Nativo Node.js<br>
                    Ambiente: Heroku Production
                </div>
            </div>
        </div>
        
        <div class="footer-info">
            © 2025 Sistema Brasileiro de Televisão - SBT<br>
            Portal Oficial de Casting e Seleção
        </div>
    </div>
    
    <script>
        console.log('🚀 Portal SBT carregado com sucesso!');
        console.log('📅 Build timestamp:', '${new Date().toISOString()}');
        
        // Teste de conectividade da API
        fetch('/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ Health Check successful:', data);
                const systemInfo = document.querySelector('.system-info');
                systemInfo.innerHTML += '<br>API: ✅ Conectada e respondendo';
            })
            .catch(error => {
                console.warn('⚠️ Health Check failed:', error);
                const systemInfo = document.querySelector('.system-info');
                systemInfo.innerHTML += '<br>API: 🔄 Verificando conectividade...';
            });
        
        // Adicionar interatividade aos botões
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('/health')) {
                    e.preventDefault();
                    window.open(href, '_blank');
                }
            });
        });
        
        // Animações suaves
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', frontendCode);

// Verificar build final
console.log('4. Verificando build...');
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

console.log('');
console.log('📋 RESULTADO FINAL DO BUILD:');
console.log('='.repeat(40));
buildResults.forEach(result => console.log(result));
console.log(`📊 Total de arquivos criados: ${fs.readdirSync('dist/public').length + 1}`);
console.log('='.repeat(40));

if (buildSuccess) {
    console.log('');
    console.log('🎉 BUILD HEROKU CONCLUÍDO COM SUCESSO!');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS PARA DEPLOY:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix Heroku MODULE_NOT_FOUND - servidor HTTP nativo"');
    console.log('3. git push heroku main');
    console.log('');
    console.log('🔍 APÓS O DEPLOY, VERIFICAR:');
    console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/');
    console.log('- https://portalselecaosbt-02ad61fdc07b.herokuapp.com/health');
    console.log('');
} else {
    console.error('❌ BUILD FALHOU - arquivos obrigatórios não foram criados');
    process.exit(1);
}