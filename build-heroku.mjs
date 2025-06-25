#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

console.log('Starting Heroku build...');

try {
  // Create directories
  if (!existsSync('dist')) mkdirSync('dist', { recursive: true });
  if (!existsSync('dist/public')) mkdirSync('dist/public', { recursive: true });

  // Try Vite build with timeout
  console.log('Building frontend...');
  try {
    execSync('timeout 300 npx vite build --mode production', { 
      stdio: 'inherit',
      timeout: 300000
    });
    console.log('Frontend build completed');
  } catch (error) {
    console.log('Vite build failed/timeout, using fallback...');
    
    // Copy essential files as fallback
    if (existsSync('client/index.html')) {
      copyFileSync('client/index.html', 'dist/public/index.html');
    }
    if (existsSync('index.html')) {
      copyFileSync('index.html', 'dist/public/index.html');
    }
    
    // Create minimal app bundle
    execSync('npx vite build --mode production --minify false', { 
      stdio: 'inherit',
      timeout: 180000
    });
  }

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