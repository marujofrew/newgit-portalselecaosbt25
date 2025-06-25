#!/bin/bash
# Heroku pre-build script to ensure Node.js detection

echo "Setting up Node.js environment for Heroku..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Ensure package.json exists and is valid
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found"
  exit 1
fi

echo "Package.json found, proceeding with Node.js build..."