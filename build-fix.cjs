#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Fixing build process...');

try {
  // Create a temporary index.html in root for build compatibility
  console.log('📋 Preparing build environment...');
  const tempIndexPath = path.resolve('./index.html');
  const clientIndexPath = path.resolve('./client/index.html');
  
  // Copy and modify client/index.html to root temporarily
  if (fs.existsSync(clientIndexPath)) {
    let indexContent = fs.readFileSync(clientIndexPath, 'utf8');
    // Fix the script src path for root directory
    indexContent = indexContent.replace('./src/main.tsx', './client/src/main.tsx');
    fs.writeFileSync(tempIndexPath, indexContent);
    console.log('✓ Temporary index.html created with corrected paths');
  }
  
  // Build frontend using the root config (which expects index.html in root)  
  console.log('📦 Building frontend...');
  execSync('NODE_ENV=production vite build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Copy attached_assets to build output
  console.log('📁 Copying assets...');
  const attachedAssetsSource = path.resolve('./attached_assets');
  const attachedAssetsTarget = path.resolve('./dist/public/attached_assets');
  
  if (fs.existsSync(attachedAssetsSource)) {
    try {
      // Create target directory if it doesn't exist
      if (!fs.existsSync(attachedAssetsTarget)) {
        fs.mkdirSync(attachedAssetsTarget, { recursive: true });
      }
      
      // Copy all files from attached_assets
      const files = fs.readdirSync(attachedAssetsSource);
      let copiedCount = 0;
      
      files.forEach(file => {
        try {
          const sourcePath = path.join(attachedAssetsSource, file);
          const targetPath = path.join(attachedAssetsTarget, file);
          
          if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, targetPath);
            copiedCount++;
          }
        } catch (fileError) {
          console.warn(`⚠️ Failed to copy ${file}: ${fileError.message}`);
        }
      });
      console.log(`✓ Copied ${copiedCount} asset files`);
    } catch (error) {
      console.warn(`⚠️ Error copying attached_assets: ${error.message}`);
    }
  }
  
  // Copy client/public assets to build output
  const clientPublicSource = path.resolve('./client/public');
  const publicTarget = path.resolve('./dist/public');
  
  if (fs.existsSync(clientPublicSource)) {
    try {
      const files = fs.readdirSync(clientPublicSource);
      let copiedCount = 0;
      
      files.forEach(file => {
        try {
          const sourcePath = path.join(clientPublicSource, file);
          const targetPath = path.join(publicTarget, file);
          
          if (fs.statSync(sourcePath).isFile() && !fs.existsSync(targetPath)) {
            fs.copyFileSync(sourcePath, targetPath);
            copiedCount++;
          }
        } catch (fileError) {
          console.warn(`⚠️ Failed to copy ${file}: ${fileError.message}`);
        }
      });
      console.log(`✓ Copied ${copiedCount} public files`);
    } catch (error) {
      console.warn(`⚠️ Error copying public files: ${error.message}`);
    }
  }
  
  // Clean up temporary file
  if (fs.existsSync(tempIndexPath)) {
    fs.unlinkSync(tempIndexPath);
    console.log('✓ Temporary files cleaned up');
  }
  
  // Build the backend
  console.log('⚙️ Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Cleanup on error
  const tempIndexPath = path.resolve('./index.html');
  if (fs.existsSync(tempIndexPath)) {
    fs.unlinkSync(tempIndexPath);
    console.log('✓ Cleanup completed');
  }
  
  process.exit(1);
}