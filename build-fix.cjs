#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Fixing build process...');

try {
  // First, build the frontend from the client directory
  console.log('📦 Building frontend...');
  process.chdir('client');
  execSync('NODE_ENV=production vite build --config vite.config.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Go back to root directory
  process.chdir('..');
  
  // Then build the backend
  console.log('⚙️ Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}