const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting simplified Heroku build...');

// Create dist directories
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Build React app
console.log('Building React app...');
try {
  execSync('NODE_ENV=production npx vite build --config client/vite.config.ts --outDir dist/public', { 
    stdio: 'inherit'
  });
  console.log('✓ React app built successfully');
} catch (error) {
  console.error('React build failed:', error);
  process.exit(1);
}

// Move index.html to correct position
if (fs.existsSync('dist/public/client/index.html')) {
  fs.copyFileSync('dist/public/client/index.html', 'dist/public/index.html');
  console.log('✓ index.html positioned correctly');
}

// Copy static assets
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    const srcPath = path.join('client/public', file);
    const destPath = path.join('dist/public', file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  console.log('✓ Static assets copied');
}

// Build backend in CommonJS format
console.log('Building backend...');
try {
  execSync('npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native --external:sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --external:pg-query-stream --external:@mapbox/node-pre-gyp', { 
    stdio: 'inherit'
  });
  console.log('✓ Backend built successfully');
} catch (error) {
  console.error('Backend build failed:', error);
  process.exit(1);
}

// Verify build success
const requiredFiles = [
  'dist/index.js',
  'dist/public/index.html'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`✗ Required file missing: ${file}`);
    process.exit(1);
  }
}

console.log('✓ Heroku build completed successfully!');
console.log('Files ready for deployment:');
console.log('- dist/index.js (server)');
console.log('- dist/public/ (React app + assets)');