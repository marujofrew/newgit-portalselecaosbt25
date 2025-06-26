
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Building for Heroku deployment...');

// Clean and create directories
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Build frontend first
console.log('⚛️  Building React frontend...');
try {
  process.chdir('client');
  execSync('npx vite build --outDir ../dist/public --mode production', { 
    stdio: 'inherit',
    timeout: 60000
  });
  process.chdir('..');
  console.log('✅ Frontend build complete');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Copy static files from client/public to dist/public
if (fs.existsSync('client/public')) {
  const files = fs.readdirSync('client/public');
  files.forEach(file => {
    const src = `client/public/${file}`;
    const dest = `dist/public/${file}`;
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`📄 Copied ${file}`);
    }
  });
}

// Build backend with CommonJS format for Heroku compatibility
console.log('🔧 Building backend...');
try {
  execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:pg-native --packages=external --minify', { 
    stdio: 'inherit' 
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
console.log('📦 Ready for deployment');
