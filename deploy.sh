#!/bin/bash

# Exit on error
set -e

echo "🏗️ Starting build process..."

# Build the site (assuming you're using a static site generator - adjust the build command as needed)
# For example, if using Jekyll:
# bundle exec jekyll build
# Or if using Hugo:
# hugo
# Or if using npm:
# npm run build

# Add your actual build command here

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check if the build directory exists (adjust the directory name as needed)
BUILD_DIR="./dist" # or "./public" or "_site" depending on your setup
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found!"
    exit 1
fi

# Verify AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed!"
    exit 1
fi

echo "🚀 Deploying to S3..."

# Sync build directory with S3 bucket
aws s3 sync $BUILD_DIR s3://roganov.me \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "*.html" \
    --exclude "*.xml" \
    --exclude "*.txt"

# Sync HTML, XML, and TXT files with different cache settings
aws s3 sync $BUILD_DIR s3://roganov.me \
    --delete \
    --cache-control "no-cache" \
    --include "*.html" \
    --include "*.xml" \
    --include "*.txt"

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌎 Site is now live at http://roganov.me"
else
    echo "❌ Deployment failed!"
    exit 1
fi
