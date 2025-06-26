
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

// Ensure attached_assets directory exists for Vite @assets alias
console.log('Preparing assets for build...');

// Create or ensure attached_assets directory in root exists
if (!fs.existsSync('attached_assets')) {
  fs.mkdirSync('attached_assets', { recursive: true });
  console.log('Created attached_assets directory');
}

// Copy logo from client/public to attached_assets if needed
const logoSrc = path.join('client', 'public', 'azul-logo-oficial.png');
const logoDest = path.join('attached_assets', 'azul-logo-02_1750506382633.png');

if (fs.existsSync(logoSrc) && !fs.existsSync(logoDest)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('Copied azul-logo-oficial.png to attached_assets/azul-logo-02_1750506382633.png');
}

// Verify critical assets before build
const criticalAssets = [
  { src: 'client/public/azul-logo-oficial.png', name: 'Azul logo in public' },
  { src: logoDest, name: 'Required logo for Vite build' }
];

criticalAssets.forEach(asset => {
  if (fs.existsSync(asset.src)) {
    console.log(`✓ ${asset.name} found at ${asset.src}`);
  } else {
    console.log(`✗ ${asset.name} missing at ${asset.src}`);
  }
});

// Build React app with Vite
console.log('Building React app with Vite...');
try {
  // Make sure we're in the right directory
  process.chdir(__dirname);
  
  // Build the React app using the proper Vite config
  execSync('NODE_ENV=production npx vite build --config client/vite.config.ts --outDir dist/public', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('React app built successfully');
} catch (error) {
  console.error('Vite build failed:', error);
  
  // Try alternative build method
  try {
    console.log('Trying alternative build method...');
    process.chdir('client');
    execSync('npx vite build --outDir ../dist/public', { stdio: 'inherit' });
    process.chdir('..');
    console.log('Alternative build method succeeded');
  } catch (altError) {
    console.error('Alternative build also failed:', altError);
    throw new Error('Both build methods failed');
  }
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

// Copy attached assets to dist/public/attached_assets
if (fs.existsSync('attached_assets')) {
  const attachedAssetsDir = path.join('dist/public', 'attached_assets');
  if (!fs.existsSync(attachedAssetsDir)) {
    fs.mkdirSync(attachedAssetsDir, { recursive: true });
  }
  
  const files = fs.readdirSync('attached_assets');
  files.forEach(file => {
    const srcPath = path.join('attached_assets', file);
    const destPath = path.join(attachedAssetsDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} from attached_assets`);
    }
  });
}

// Assets are now in the correct location (root attached_assets)
// No cleanup needed as they're part of the project structure

// Move index.html to correct location if needed
const indexPath = path.join('dist/public', 'index.html');
const clientIndexPath = path.join('dist/public/client', 'index.html');

if (!fs.existsSync(indexPath) && fs.existsSync(clientIndexPath)) {
  fs.copyFileSync(clientIndexPath, indexPath);
  console.log('Moved index.html to correct location');
}

// Verify the build was successful
if (!fs.existsSync(indexPath)) {
  throw new Error('Build failed: index.html not found in dist/public');
}

console.log('Heroku build completed successfully!');
