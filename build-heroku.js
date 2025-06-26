const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Heroku deployment...');

// Create build directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

// Build React app quickly
console.log('⚛️  Building React frontend...');
try {
  execSync('cd client && npx vite build --outDir ../dist/public --mode production', { 
    stdio: 'pipe',
    timeout: 45000
  });
  console.log('✅ Frontend build complete');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Copy static assets
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    const src = path.join('client/public', file);
    const dest = path.join('dist/public', file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
  console.log('📁 Static assets copied');
}

// Build backend using production server
console.log('🔧 Building Node.js backend...');
try {
  execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native --external:sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --external:pg-query-stream', { 
    stdio: 'pipe',
    timeout: 30000
  });
  console.log('✅ Backend build complete');
} catch (error) {
  console.error('❌ Backend build failed:', error.message);
  process.exit(1);
}

// Verify build success
const requiredFiles = ['dist/index.js', 'dist/public/index.html'];
let success = true;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing: ${file}`);
    success = false;
  } else {
    const size = Math.round(fs.statSync(file).size / 1024);
    console.log(`✅ ${file} (${size}KB)`);
  }
}

if (!success) {
  console.error('❌ Build verification failed');
  process.exit(1);
}

console.log('🎉 Heroku build completed successfully!');
console.log('📦 Ready for deployment:');
console.log('   - Server: dist/index.js');
console.log('   - Frontend: dist/public/');