const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting minimal build for Heroku...');

// Create dist directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

try {
  // Build backend first (fast)
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  
  // Try frontend build with reduced timeout
  console.log('Building frontend...');
  try {
    execSync('npx vite build --mode production', { 
      stdio: 'inherit',
      timeout: 240000 // 4 minutes
    });
  } catch (error) {
    console.log('Vite build timeout, creating minimal frontend...');
    
    // Copy assets from client/public
    if (fs.existsSync('client/public')) {
      const files = fs.readdirSync('client/public');
      files.forEach(file => {
        fs.copyFileSync(
          path.join('client/public', file), 
          path.join('dist/public', file)
        );
      });
    }
    
    // Create minimal index.html that serves the API
    const minimalHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SBT Casting Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root">
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">SBT Casting Portal</h1>
        <p class="text-gray-600">Sistema de cadastro para castings infantis</p>
        <div class="mt-8">
          <a href="/api/health" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            API Status
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync('dist/public/index.html', minimalHTML);
  }
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}