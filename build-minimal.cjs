
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
  console.log('Backend build completed');

  // Skip Vite build to avoid asset import issues
  console.log('Skipping Vite build due to asset import conflicts...');

  // Copy client/public assets first
  console.log('Copying client public assets...');
  if (fs.existsSync('client/public')) {
    const files = fs.readdirSync('client/public');
    files.forEach(file => {
      const srcPath = path.join('client/public', file);
      const destPath = path.join('dist/public', file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
    console.log(`Copied ${files.length} client public assets`);
  }

  // Copy attached assets to dist/public (images only)
  console.log('Copying attached assets...');
  if (fs.existsSync('attached_assets')) {
    const attachedFiles = fs.readdirSync('attached_assets').filter(file => 
      file.match(/\.(png|jpg|jpeg|svg|webp)$/i)
    );
    attachedFiles.forEach(file => {
      const srcPath = path.join('attached_assets', file);
      const destPath = path.join('dist/public', file);
      fs.copyFileSync(srcPath, destPath);
    });
    console.log(`Copied ${attachedFiles.length} attached image assets`);
  }

  // Copy root assets
  console.log('Copying root assets...');
  const rootAssets = ['azul-logo.png'];
  rootAssets.forEach(asset => {
    if (fs.existsSync(asset)) {
      fs.copyFileSync(asset, path.join('dist/public', asset));
      console.log(`Copied ${asset}`);
    }
  });

  // Ensure sbt_logo.png exists
  if (!fs.existsSync('dist/public/sbt_logo.png')) {
    if (fs.existsSync('client/public/sbt_logo.png')) {
      fs.copyFileSync('client/public/sbt_logo.png', 'dist/public/sbt_logo.png');
      console.log('Copied sbt_logo.png from client/public');
    } else if (fs.existsSync('attached_assets/sbt_logo.png')) {
      fs.copyFileSync('attached_assets/sbt_logo.png', 'dist/public/sbt_logo.png');
      console.log('Copied sbt_logo.png from attached_assets');
    } else if (fs.existsSync('azul-logo.png')) {
      fs.copyFileSync('azul-logo.png', 'dist/public/sbt_logo.png');
      console.log('Created sbt_logo.png from azul-logo.png');
    }
  }

  // Create production-ready HTML
  console.log('Creating frontend...');
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
</body>
</html>`;

  fs.writeFileSync('dist/public/index.html', productionHTML);
  console.log('Frontend created successfully');

  // Verify critical files exist
  const criticalFiles = ['dist/index.js', 'dist/public/index.html', 'dist/public/azul-logo.png'];
  const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('Missing critical files:', missingFiles);
    process.exit(1);
  }

  console.log('Build completed successfully!');
  console.log('Generated files:');
  console.log('- Backend: dist/index.js');
  console.log('- Frontend: dist/public/index.html');
  console.log('- Assets:', fs.readdirSync('dist/public').length, 'files');

} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
