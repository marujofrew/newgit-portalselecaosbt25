const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Heroku...');

// Create directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

// Build frontend
console.log('Building React app...');
execSync('cd client && NODE_ENV=production npx vite build --outDir ../dist/public', { stdio: 'inherit' });

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
}

// Build backend excluding problematic files
console.log('Building backend...');
execSync(`npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --external:vite --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal --external:pg-native --external:sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --external:pg-query-stream --external:@babel/preset-typescript --external:@babel/core --external:lightningcss`, { 
  stdio: 'inherit' 
});

console.log('✓ Build complete for Heroku deployment');
console.log(`✓ Server: dist/index.js (${Math.round(fs.statSync('dist/index.js').size/1024)}KB)`);
console.log(`✓ Frontend: dist/public/index.html`);