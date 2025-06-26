
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

// Create symlink for attached_assets during build (for Vite to resolve)
const symlinkTarget = path.join('client', 'attached_assets');
if (!fs.existsSync(symlinkTarget) && fs.existsSync('attached_assets')) {
  try {
    if (process.platform === 'win32') {
      // Windows: use junction
      execSync(`mklink /J "${symlinkTarget}" "${path.resolve('attached_assets')}"`, { stdio: 'ignore' });
    } else {
      // Unix: use symbolic link
      fs.symlinkSync(path.resolve('attached_assets'), symlinkTarget);
    }
    console.log('Created symlink for attached_assets');
  } catch (error) {
    console.log('Could not create symlink, copying files instead');
    // Fallback: copy files
    if (!fs.existsSync(symlinkTarget)) {
      fs.mkdirSync(symlinkTarget, { recursive: true });
    }
    const files = fs.readdirSync('attached_assets');
    files.forEach(file => {
      const srcPath = path.join('attached_assets', file);
      const destPath = path.join(symlinkTarget, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
}

// Verify the build was successful
const indexPath = path.join('dist/public', 'index.html');
if (!fs.existsSync(indexPath)) {
  throw new Error('Build failed: index.html not found in dist/public');
}

console.log('Heroku build completed successfully!');
