
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku build (asset-safe version)...');

// Create directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

try {
  // Backend build only
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  console.log('Backend build completed');

  // Copy all assets from various locations
  console.log('Copying assets...');
  
  // Copy client/public assets
  if (fs.existsSync('client/public')) {
    const files = fs.readdirSync('client/public');
    files.forEach(file => {
      const srcPath = path.join('client/public', file);
      const destPath = path.join('dist/public', file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  // Copy attached assets
  if (fs.existsSync('attached_assets')) {
    const attachedFiles = fs.readdirSync('attached_assets').filter(file => 
      file.match(/\.(png|jpg|jpeg|svg|webp)$/i)
    );
    attachedFiles.forEach(file => {
      const srcPath = path.join('attached_assets', file);
      const destPath = path.join('dist/public', file);
      fs.copyFileSync(srcPath, destPath);
    });
  }

  // Copy root assets
  if (fs.existsSync('azul-logo.png')) {
    fs.copyFileSync('azul-logo.png', 'dist/public/azul-logo.png');
  }

  // Create static HTML with embedded React-like functionality
  const productionHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SBT Casting Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
  <div id="root">
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header class="bg-white shadow-sm border-b border-blue-200">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="flex items-center justify-center">
            <img src="/azul-logo.png" alt="SBT Azul" class="h-12 mr-4" />
            <h1 class="text-2xl font-bold text-blue-900">Portal de Casting SBT</h1>
          </div>
        </div>
      </header>
      <main class="max-w-4xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-blue-900 mb-4">Sistema de Casting Infantil</h2>
          <p class="text-xl text-gray-700 mb-8">Portal oficial do SBT para seleção de talentos</p>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold text-blue-900 mb-4">Sistema Online</h3>
            <p class="text-gray-600 mb-6">Acesse todas as funcionalidades do portal</p>
            <a href="/api/health" class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
              Verificar Status da API
            </a>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold text-green-900 mb-4">Pagamentos PIX</h3>
            <p class="text-gray-600 mb-6">Sistema de pagamento integrado</p>
            <a href="/api/pix/status/test" class="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
              Testar Sistema PIX
            </a>
          </div>
        </div>
      </main>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync('dist/public/index.html', productionHTML);
  console.log('Static HTML created successfully');

  console.log('Heroku build completed successfully!');

} catch (error) {
  console.error('Heroku build failed:', error.message);
  process.exit(1);
}
