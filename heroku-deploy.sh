#!/bin/bash

echo "🚀 Heroku Deploy Script"
echo "======================"

# Check if heroku CLI is available
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first."
    exit 1
fi

# Remove git lock if it exists
if [ -f .git/index.lock ]; then
    echo "🔓 Removing git lock..."
    rm -f .git/index.lock
fi

echo "📝 Adding files to git..."
git add .

echo "💾 Committing changes..."
git commit -m "Fix Heroku deployment - fast build with minimal frontend"

echo "🚢 Pushing to Heroku..."
git push heroku main

echo "📊 Checking deployment status..."
heroku ps:scale web=1

echo "🌐 Opening app..."
heroku open

echo "📋 Showing recent logs..."
heroku logs --tail --num=50