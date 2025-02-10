#!/bin/bash

# Exit on error
set -e

echo "🏗️ Starting build process..."

# Build the site with npm
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check if the build directory exists
BUILD_DIR="./dist"
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

# List contents of build directory
echo "📁 Contents of $BUILD_DIR:"
ls -la $BUILD_DIR

# Sync all files first
aws s3 sync $BUILD_DIR s3://roganov.me \
    --delete \
    --exclude ".DS_Store" \
    --exclude "*.xml" \
    --exclude "*.txt" \
    --cache-control "max-age=31536000,public"

echo "📤 First sync completed"

# Sync XML and TXT files with different cache settings
aws s3 sync $BUILD_DIR s3://roganov.me \
    --exclude "*" \
    --include "*.xml" \
    --include "*.txt" \
    --cache-control "no-cache"

echo "📤 Second sync completed"

# List contents of S3 bucket
echo "📁 Contents of S3 bucket:"
aws s3 ls s3://roganov.me --recursive

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌎 Site is now live at http://roganov.me"
else
    echo "❌ Deployment failed!"
    exit 1
fi
