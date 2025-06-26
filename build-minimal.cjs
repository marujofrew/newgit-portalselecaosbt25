const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building for Heroku...');

// Clean and create directories
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Build frontend - working build (516KB JS + 58KB CSS)
console.log('Building frontend...');
execSync('cd client && npx vite build --outDir ../dist/public', { stdio: 'inherit' });

// Copy static assets
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    if (fs.statSync(`client/public/${file}`).isFile()) {
      fs.copyFileSync(`client/public/${file}`, `dist/public/${file}`);
    }
  });
}

// Build backend with minimal externals to avoid timeouts
console.log('Building backend...');
execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native', { stdio: 'inherit' });

// Verify build
const frontendExists = fs.existsSync('dist/public/index.html');
const backendExists = fs.existsSync('dist/index.js');

if (frontendExists && backendExists) {
  const frontendSize = Math.round(fs.statSync('dist/public/index.html').size / 1024);
  const backendSize = Math.round(fs.statSync('dist/index.js').size / 1024);
  console.log(`Build complete: Frontend (${frontendSize}KB), Backend (${backendSize}KB)`);
} else {
  console.error('Build failed - missing files');
  process.exit(1);
}