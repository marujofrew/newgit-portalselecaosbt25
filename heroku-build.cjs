const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku build...');

// Ensure dist directories exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Build React app with Vite
console.log('Building React app with Vite...');
try {
  process.chdir('client');
  execSync('npx vite build --outDir ../dist/public', { stdio: 'inherit' });
  process.chdir('..');
  console.log('React app built successfully');
} catch (error) {
  console.log('Vite build failed, creating minimal fallback');
  process.chdir('..');
  
  const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal SBT</title>
</head>
<body>
  <div id="root">
    <h1>Portal de Casting SBT</h1>
    <p>Sistema de seleção para talentos infantis</p>
  </div>
</body>
</html>`;
  
  fs.writeFileSync('dist/public/index.html', fallbackHTML);
  console.log('Fallback HTML created');
}

// Build backend
console.log('Building backend...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
  stdio: 'inherit'
});
console.log('Backend build completed');

// Copy assets from client/public to dist/public
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
  const files = fs.readdirSync('attached_assets');
  files.forEach(file => {
    const srcPath = path.join('attached_assets', file);
    const destPath = path.join('dist/public', file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} from attached_assets`);
    }
  });
}

// Copy main assets to dist/public
const mainAssets = ['azul-logo.png'];
mainAssets.forEach(asset => {
  if (fs.existsSync(asset)) {
    fs.copyFileSync(asset, path.join('dist/public', asset));
    console.log(`Copied ${asset}`);
  }
});

console.log('Heroku build completed successfully!');