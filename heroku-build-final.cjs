const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Heroku deployment...');

// Ensure directories exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Build React app using minimal config
console.log('Building React frontend...');
try {
  execSync('cd client && NODE_ENV=production npx vite build --outDir ../dist/public', { 
    stdio: 'inherit'
  });
  console.log('✓ Frontend build complete');
} catch (error) {
  console.error('Frontend build failed:', error);
  process.exit(1);
}

// Copy static assets from client/public
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    const srcPath = path.join('client/public', file);
    const destPath = path.join('dist/public', file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file}`);
    }
  });
}

// Build backend with minimal externals to avoid import.meta issues
console.log('Building backend server...');
try {
  execSync('npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:vite --external:@replit/* --external:pg-native --external:sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --external:pg-query-stream', { 
    stdio: 'inherit'
  });
  console.log('✓ Backend build complete');
} catch (error) {
  console.error('Backend build failed:', error);
  process.exit(1);
}

// Verify critical files exist
const requiredFiles = [
  'dist/index.js',
  'dist/public/index.html'
];

let buildValid = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`✗ Missing: ${file}`);
    buildValid = false;
  } else {
    const size = fs.statSync(file).size;
    console.log(`✓ ${file} (${Math.round(size/1024)}KB)`);
  }
}

if (!buildValid) {
  console.error('Build verification failed');
  process.exit(1);
}

console.log('\n✓ Heroku build completed successfully!');
console.log('Ready for deployment:');
console.log('- Server: dist/index.js');
console.log('- Frontend: dist/public/');