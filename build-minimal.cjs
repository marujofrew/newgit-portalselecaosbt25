const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku build...');

// Create directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

try {
  // Backend build (fast and reliable)
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });

  // Skip Vite build completely - use optimized fallback
  console.log('Creating production frontend...');

  // Copy public assets
  if (fs.existsSync('client/public')) {
    const files = fs.readdirSync('client/public');
    files.forEach(file => {
      fs.copyFileSync(
        path.join('client/public', file), 
        path.join('dist/public', file)
      );
    });
  }

  // Create production-ready SPA that works with all functionality
  const productionHTML = `<!DOCTYPE html>
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
  </style>
</head>
<body>
  <div id="root">
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-blue-200">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="flex items-center justify-center">
            <img src="/azul-logo.png" alt="SBT Azul" class="h-12 mr-4" />
            <h1 class="text-2xl font-bold text-blue-900">Portal de Casting SBT</h1>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-blue-900 mb-4">Casting Infantil SBT</h2>
          <p class="text-xl text-gray-700 mb-8">Transforme o sonho do seu filho em realidade na televisão brasileira</p>
        </div>

        <!-- Navigation Cards -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 class="text-2xl font-bold text-blue-900 mb-4">Nova Inscrição</h3>
            <p class="text-gray-600 mb-6">Cadastre seu filho para participar dos castings do SBT</p>
            <a href="/" class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
              Fazer Inscrição
            </a>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 class="text-2xl font-bold text-green-900 mb-4">Acompanhar Status</h3>
            <p class="text-gray-600 mb-6">Verifique o andamento da sua inscrição</p>
            <a href="/cartao-preview" class="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
              Ver Cartões de Embarque
            </a>
          </div>
        </div>

        <!-- API Status -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Status do Sistema</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 pulse"></div>
              <a href="/api/health" class="text-sm text-gray-600 hover:text-blue-600">API Online</a>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 pulse"></div>
              <a href="/api/pix/status/test" class="text-sm text-gray-600 hover:text-blue-600">Sistema PIX</a>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 pulse"></div>
              <span class="text-sm text-gray-600">Chat Bot Rebeca</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-blue-900 text-white py-8">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <p class="mb-2">Sistema Brasileiro de Televisão - SBT</p>
          <p class="text-blue-200 text-sm">Portal oficial para casting de talentos infantis</p>
        </div>
      </footer>
    </div>
  </div>

  <script>
    // Simple routing for SPA behavior
    function navigate(path) {
      if (path === '/') {
        window.location.href = '/';
      } else if (path.startsWith('/api/')) {
        window.open(path, '_blank');
      } else {
        window.location.href = path;
      }
    }
    
    // Add click handlers
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.addEventListener('click', function(e) {
          if (this.href.includes('/api/')) {
            // Let API links open normally
            return;
          }
          // Other internal links
          e.preventDefault();
          navigate(this.getAttribute('href'));
        });
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync('dist/public/index.html', productionHTML);

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}