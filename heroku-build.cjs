const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building for Heroku deployment...');

// Clean and create directories
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Build backend first (836KB in 191ms)
console.log('Building backend...');
execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native --minify', { stdio: 'inherit' });

// Build frontend (516KB JS + 58KB CSS in 7.87s)
console.log('Building frontend...');
execSync('cd client && npx vite build --outDir ../dist/public --minify', { stdio: 'inherit' });

// Copy static assets
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    if (fs.statSync(`client/public/${file}`).isFile()) {
      fs.copyFileSync(`client/public/${file}`, `dist/public/${file}`);
    }
  });
}

// Verify build success
const backendExists = fs.existsSync('dist/index.js');
const frontendExists = fs.existsSync('dist/public/index.html');

if (backendExists && frontendExists) {
  const backendSize = Math.round(fs.statSync('dist/index.js').size / 1024);
  const frontendSize = Math.round(fs.statSync('dist/public/index.html').size);
  console.log(`Build complete: Backend (${backendSize}KB), Frontend (${frontendSize}B)`);
} else {
  console.error('Build failed - missing files');
  process.exit(1);
}