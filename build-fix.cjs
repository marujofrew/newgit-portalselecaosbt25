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