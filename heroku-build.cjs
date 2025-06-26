
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting simplified Heroku build...');

// Create build directories
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Ensure critical logos are in client/public
console.log('Ensuring logos are available...');
const requiredLogos = [
  { name: 'azul-logo-oficial.png', size: '64KB' },
  { name: 'sbt_logo.png', size: '2KB' }
];

requiredLogos.forEach(logo => {
  const logoPath = path.join('client/public', logo.name);
  if (fs.existsSync(logoPath)) {
    console.log(`✓ ${logo.name} ready for build`);
  } else {
    console.log(`✗ ${logo.name} missing - this will cause build failure`);
  }
});

// Build React app
console.log('Building React frontend...');
try {
  execSync('cd client && NODE_ENV=production npx vite build --outDir ../dist/public', { 
    stdio: 'inherit',
    timeout: 60000
  });
  console.log('✓ React build successful');
} catch (error) {
  console.error('React build failed:', error);
  process.exit(1);
}

// Build backend with extensive externals to avoid problematic files
console.log('Building backend...');
try {
  execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native --external:sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --external:pg-query-stream --external:@mapbox/node-pre-gyp', {
    stdio: 'inherit'
  });
  console.log('✓ Backend build completed');
} catch (error) {
  console.error('Backend build failed:', error);
  process.exit(1);
}

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

// Ensure critical assets are in dist/public for static serving
console.log('Ensuring static assets in build output...');
const staticAssets = [
  { src: 'client/public/azul-logo-oficial.png', dest: 'dist/public/azul-logo-oficial.png' },
  { src: 'client/public/sbt_logo.png', dest: 'dist/public/sbt_logo.png' }
];

staticAssets.forEach(asset => {
  if (fs.existsSync(asset.src)) {
    fs.copyFileSync(asset.src, asset.dest);
    console.log(`Copied ${path.basename(asset.src)} to public directory`);
  }
});

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
