const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku React build...');

// Ensure dist directories exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

try {
  // Build React app using Vite
  console.log('Building React frontend with Vite...');
  process.chdir('client');
  execSync('npx vite build', { stdio: 'inherit' });
  process.chdir('..');
  
  // Copy built files to dist/public
  if (fs.existsSync('client/dist')) {
    console.log('Copying React build files...');
    const files = fs.readdirSync('client/dist');
    files.forEach(file => {
      const srcPath = path.join('client/dist', file);
      const destPath = path.join('dist/public', file);
      if (fs.statSync(srcPath).isDirectory()) {
        execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      console.log(`Copied ${file} to dist/public`);
    });
  }
  
} catch (error) {
  console.log('Vite build failed, using original heroku-build.cjs');
  execSync('node heroku-build.cjs', { stdio: 'inherit' });
}

// Build backend
console.log('Building backend...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
  stdio: 'inherit'
});
console.log('Backend build completed');

console.log('Heroku React build completed successfully!');