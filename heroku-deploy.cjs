const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku deployment build...');

// Create build directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

// Build frontend first
console.log('Building frontend...');
try {
  process.chdir('client');
  execSync('npx vite build --outDir ../dist/public', { stdio: 'inherit' });
  process.chdir('..');
  console.log('Frontend build completed');
} catch (error) {
  console.error('Frontend build failed');
  process.exit(1);
}

// Copy static files
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    const src = path.join('client/public', file);
    const dest = path.join('dist/public', file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
}

// Build backend
console.log('Building backend...');
try {
  execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native', { stdio: 'inherit' });
  console.log('Backend build completed');
} catch (error) {
  console.error('Backend build failed');
  process.exit(1);
}

// Verify files
const files = ['dist/index.js', 'dist/public/index.html'];
for (const file of files) {
  if (fs.existsSync(file)) {
    const size = Math.round(fs.statSync(file).size / 1024);
    console.log(`${file}: ${size}KB`);
  } else {
    console.error(`Missing ${file}`);
    process.exit(1);
  }
}

console.log('Build completed successfully');