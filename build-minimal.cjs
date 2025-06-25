const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para Heroku...');

try {
  // Verificar se o diretório client existe
  if (!fs.existsSync('client')) {
    throw new Error('Diretório client não encontrado');
  }

  // Verificar se index.html existe
  if (!fs.existsSync('client/index.html')) {
    throw new Error('client/index.html não encontrado');
  }

  console.log('✅ Estrutura de arquivos verificada');

  // Build do frontend com Vite
  console.log('📦 Executando build do frontend...');
  execSync('npx vite build --config vite.config.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  console.log('✅ Build do frontend concluído');

  // Build do backend com esbuild
  console.log('🔧 Executando build do backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('✅ Build completo com sucesso!');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}