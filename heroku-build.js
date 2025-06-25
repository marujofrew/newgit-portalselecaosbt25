#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Heroku build...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }

  // Build frontend
  console.log('Building frontend...');
  execSync('npx vite build --mode production', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minutes
  });

  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}