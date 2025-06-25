
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Iniciando build para Heroku...');

try {
  // Verificar estrutura
  if (!fs.existsSync('client/index.html')) {
    throw new Error('client/index.html não encontrado');
  }

  console.log('✅ Estrutura verificada');

  // Build frontend - comando mais simples
  console.log('📦 Build do frontend...');
  process.env.NODE_ENV = 'production';
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Build backend
  console.log('🔧 Build do backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('✅ Build completo!');

} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}
