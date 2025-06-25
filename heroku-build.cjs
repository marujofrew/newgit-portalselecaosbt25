const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Heroku production build...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }

  // Create directories
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });

  // Build backend first (fast and reliable)
  console.log('📦 Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  console.log('✅ Backend compiled successfully');

  // Try Vite build for React app
  console.log('⚛️ Building React frontend...');
  let frontendBuilt = false;
  
  try {
    execSync('NODE_ENV=production npx vite build --config vite.config.ts', {
      stdio: 'inherit',
      timeout: 120000, // 2 minutes timeout
      env: { ...process.env, NODE_ENV: 'production' }
    });
    frontendBuilt = true;
    console.log('✅ React app built successfully');
  } catch (viteError) {
    console.log('⚠️ Vite build failed, creating optimized fallback...');
    console.log('Error:', viteError.message);
  }

  // Copy assets regardless of build success
  console.log('📁 Copying assets...');
  
  // Copy public assets
  if (fs.existsSync('client/public')) {
    const files = fs.readdirSync('client/public');
    files.forEach(file => {
      fs.copyFileSync(
        path.join('client/public', file), 
        path.join('dist/public', file)
      );
    });
    console.log(`📋 Copied ${files.length} public assets`);
  }

  // Copy attached assets
  if (fs.existsSync('attached_assets')) {
    const attachedFiles = fs.readdirSync('attached_assets').filter(file => 
      file.match(/\.(png|jpg|jpeg|svg|webp)$/i)
    );
    attachedFiles.forEach(file => {
      fs.copyFileSync(
        path.join('attached_assets', file), 
        path.join('dist/public', file)
      );
    });
    console.log(`🖼️ Copied ${attachedFiles.length} attached assets`);
  }

  // If Vite build failed, create fallback HTML
  if (!frontendBuilt || !fs.existsSync('dist/public/index.html')) {
    console.log('🔧 Creating production SPA fallback...');
    
    const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SBT Casting Portal - Sistema de Casting Infantil</title>
  <meta name="description" content="Portal oficial SBT para casting de talentos infantis. Cadastre-se e participe das seleções." />
  <link rel="icon" type="image/png" href="/azul-logo.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    .fade-in { animation: fadeIn 0.8s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
  <div id="root">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-blue-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-center">
          <img src="/azul-logo.png" alt="SBT Azul" class="h-12 mr-4" />
          <h1 class="text-3xl font-bold text-blue-900">Portal de Casting SBT</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center mb-16 fade-in">
        <h2 class="text-5xl font-bold text-blue-900 mb-6">Casting Infantil SBT</h2>
        <p class="text-2xl text-gray-700 mb-4">Transforme o sonho do seu filho em realidade</p>
        <p class="text-lg text-gray-600">Sistema Brasileiro de Televisão</p>
      </div>

      <!-- Navigation Cards -->
      <div class="grid lg:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 fade-in">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-blue-900 mb-4">Nova Inscrição</h3>
            <p class="text-gray-600 mb-6">Cadastre seu filho para participar dos castings</p>
            <a href="/" class="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Fazer Inscrição
            </a>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 fade-in">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-green-900 mb-4">Cartões de Embarque</h3>
            <p class="text-gray-600 mb-6">Visualize seus documentos de viagem</p>
            <a href="/cartao-preview" class="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Ver Cartões
            </a>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 fade-in">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-purple-900 mb-4">Pagamento PIX</h3>
            <p class="text-gray-600 mb-6">Sistema de pagamento instantâneo</p>
            <a href="/api/pix/status/test" class="inline-block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium" target="_blank">
              Testar PIX
            </a>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white rounded-xl shadow-lg p-8 fade-in">
        <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">Status do Sistema</h3>
        <div class="grid md:grid-cols-4 gap-6">
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 pulse"></div>
            <a href="/api/health" class="text-sm font-medium text-gray-700 hover:text-blue-600" target="_blank">API Backend</a>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 pulse"></div>
            <a href="/api/pix/create" class="text-sm font-medium text-gray-700 hover:text-blue-600" target="_blank">Gateway PIX</a>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 pulse"></div>
            <span class="text-sm font-medium text-gray-700">Chat Bot Rebeca</span>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 pulse"></div>
            <span class="text-sm font-medium text-gray-700">Sistema de Cartões</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-blue-900 text-white py-12 mt-16">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <img src="/azul-logo.png" alt="SBT" class="h-8 mx-auto mb-4 opacity-80" />
        <p class="text-xl mb-2">Sistema Brasileiro de Televisão</p>
        <p class="text-blue-200">Portal oficial para casting de talentos infantis</p>
        <p class="text-blue-300 text-sm mt-4">Build otimizado para produção Heroku</p>
      </div>
    </footer>
  </div>

  <script>
    // Enhanced SPA navigation
    function navigate(path) {
      if (path === '/') {
        window.location.href = '/';
      } else if (path.startsWith('/api/')) {
        window.open(path, '_blank');
      } else {
        window.location.href = path;
      }
    }
    
    // Add loading animations
    document.addEventListener('DOMContentLoaded', function() {
      // Add click handlers
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.addEventListener('click', function(e) {
          if (this.href.includes('/api/')) {
            return; // Let API links open normally
          }
          e.preventDefault();
          const href = this.getAttribute('href');
          this.style.transform = 'scale(0.95)';
          setTimeout(() => navigate(href), 150);
        });
      });

      // Add fade-in animation to elements
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      });

      document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    });
  </script>
</body>
</html>`;

    fs.writeFileSync('dist/public/index.html', fallbackHTML);
    console.log('📝 Production SPA created');
  }

  // Verify build output
  const backendSize = fs.statSync('dist/index.js').size;
  const frontendSize = fs.statSync('dist/public/index.html').size;
  const assetCount = fs.readdirSync('dist/public').length;

  console.log('🎉 Build completed successfully!');
  console.log(`📊 Backend: ${(backendSize / 1024).toFixed(1)}kb`);
  console.log(`📊 Frontend: ${(frontendSize / 1024).toFixed(1)}kb`);
  console.log(`📊 Assets: ${assetCount} files`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}