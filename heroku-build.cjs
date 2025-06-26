const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Heroku build...');

// Create directories
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public', { recursive: true });

try {
  // Build frontend with Vite
  console.log('Building frontend...');
  execSync('cd client && NODE_ENV=production npx vite build --outDir ../dist/public', {
    stdio: 'inherit'
  });
  console.log('Frontend build completed');

  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  console.log('Backend build completed');

  // Copy client/public assets to dist/public
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
    const attachedFiles = fs.readdirSync('attached_assets').filter(file => 
      file.match(/\.(png|jpg|jpeg|svg|webp)$/i)
    );
    attachedFiles.forEach(file => {
      const srcPath = path.join('attached_assets', file);
      const destPath = path.join('dist/public', file);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} from attached_assets`);
    });
  }

  // Copy root assets
  if (fs.existsSync('azul-logo.png')) {
    fs.copyFileSync('azul-logo.png', 'dist/public/azul-logo.png');
    console.log('Copied azul-logo.png');
  }

  console.log('Heroku build completed successfully!');

} catch (error) {
  console.error('Heroku build failed:', error.message);
  process.exit(1);
}