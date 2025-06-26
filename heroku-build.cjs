const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku build...');

// Create directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

try {
  // Create fallback HTML for production
  console.log('Creating production frontend...');
  const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portal de Casting SBT - Sistema Oficial</title>
  <meta name="description" content="Portal oficial SBT para casting de talentos infantis. Sistema completo com chat bot Rebeca, PIX e cartões de embarque." />
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
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-center">
          <img src="/azul-logo.png" alt="SBT Logo" class="h-12 w-auto" />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white rounded-lg shadow-lg p-8 fade-in">
        <!-- Logo -->
        <div class="flex justify-center pt-16 pb-8">
          <img 
            src="/azul-logo.png" 
            alt="SBT Azul Logo" 
            class="h-20 w-auto"
          />
        </div>

        <!-- Título principal -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-blue-900 mb-4">
            Portal de Casting SBT
          </h1>
          <p class="text-xl text-gray-600">
            Sistema de seleção para talentos infantis
          </p>
        </div>

        <!-- Conteúdo principal -->
        <div class="prose max-w-none">
          <div class="bg-gray-50 p-6 rounded-lg">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Portal Interativo de Casting SBT
            </h2>
            <p class="text-gray-600 mb-6 text-lg leading-relaxed">
              Sistema completo para inscrição de talentos infantis do SBT. Realize seu cadastro online, 
              agende sua participação no casting e receba seus cartões de embarque digitais para viagem.
            </p>
            <p class="text-gray-600 mb-6 text-lg leading-relaxed">
              Nossa plataforma oferece chat bot inteligente da Rebeca para organizar sua viagem, 
              sistema de pagamento PIX integrado e geração automática de documentos de viagem.
            </p>
            <p class="text-gray-600 mb-8 text-lg leading-relaxed">
              Complete seu cadastro, escolha sua data de agendamento e prepare-se para a experiência 
              única de fazer parte da família SBT.
            </p>
            
            <!-- Botões de ação -->
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="/cadastro" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                Iniciar Cadastro
              </a>
              <a href="/cartao-preview" class="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center">
                Ver Cartões de Embarque
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-blue-200 mt-16">
      <div class="container mx-auto px-4 py-8 text-center">
        <p class="text-gray-600">© 2025 SBT - Sistema Brasileiro de Televisão</p>
      </div>
    </footer>
  </div>

  <!-- React App will mount here when JS loads -->
  <script type="module">
    // Fallback loads first, React app will replace when ready
    window.addEventListener('DOMContentLoaded', () => {
      console.log('SBT Portal loaded successfully');
    });
  </script>
</body>
</html>`;

  if (!fs.existsSync('client/dist')) {
    fs.mkdirSync('client/dist', { recursive: true });
  }
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    fs.writeFileSync('dist/public/index.html', fallbackHTML);
    console.log('Fallback HTML created');
  }

  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  console.log('Backend build completed');

  // Copy client/public assets to dist/public
  if (fs.existsSync('client/public')) {
    const files = fs.readdirSync('client/public');
    files.forEach(file => {
      const srcPath = path.join('client/public', file);
      const destPath = path.join('dist/public', file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to dist/public`);
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
      console.log(`Copied ${file} from attached_assets`);
    });
  }

  // Copy root assets
  if (fs.existsSync('azul-logo.png')) {
    fs.copyFileSync('azul-logo.png', 'dist/public/azul-logo.png');
    console.log('Copied azul-logo.png');
  }

  console.log('Heroku build completed successfully!');

} catch (error) {
  console.error('Heroku build failed:', error.message);
  process.exit(1);
}