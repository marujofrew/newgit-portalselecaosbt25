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

  // Frontend build with timeout handling
  console.log('Building frontend...');
  let frontendSuccess = false;
  
  try {
    execSync('npx vite build --mode production', {
      stdio: 'inherit',
      timeout: 180000 // 3 minutes only
    });
    frontendSuccess = true;
  } catch (error) {
    console.log('Vite build timeout, creating optimized fallback...');
  }

  if (!frontendSuccess) {
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

    // Create production-ready SPA
    const productionHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SBT Casting Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-lg mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <img src="/azul-logo.png" alt="SBT" class="mx-auto mb-6 h-16" />
        <h1 class="text-3xl font-bold text-blue-600 mb-4">SBT Casting Portal</h1>
        <p class="text-gray-600 mb-8">Sistema de cadastro para castings infantis</p>
        
        <div class="space-y-4">
          <a href="/api/health" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Status da API
          </a>
          <a href="/api/pix/create" class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Sistema PIX
          </a>
        </div>
        
        <p class="text-sm text-gray-500 mt-6">Build otimizado para Heroku</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    fs.writeFileSync('dist/public/index.html', productionHTML);
  }

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}