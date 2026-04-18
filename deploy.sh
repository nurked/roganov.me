#!/bin/bash

# Exit on error
set -e

echo "🏗️  Starting build process..."

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

# Strip stray .DS_Store files from the build output so they never make it to S3
find "$BUILD_DIR" -name ".DS_Store" -type f -print -delete || true

echo "🚀 Deploying to S3..."

# Pass 1: everything EXCEPT XML/TXT/HTML. Hashed asset bundles and images
# get the 1-year immutable cache.
#
# Astro's _astro/ bundles and the OG PNGs are content-hashed or
# content-addressed, so we can push aggressive caching. Anything not matched
# here falls into pass 2.
aws s3 sync "$BUILD_DIR" s3://roganov.me \
    --delete \
    --exclude "*.DS_Store" \
    --exclude "*.xml" \
    --exclude "*.txt" \
    --exclude "*.html" \
    --cache-control "max-age=31536000,public,immutable"

echo "📤 Pass 1 (assets) complete"

# Pass 2: HTML pages — medium-lived, revalidate regularly. Uses --delete
# (scoped by include/exclude) so stale HTML pages get pruned when slugs
# are renamed or removed.
aws s3 sync "$BUILD_DIR" s3://roganov.me \
    --delete \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public,max-age=300,must-revalidate"

echo "📤 Pass 2 (HTML) complete"

# Pass 3: XML feeds, sitemap, robots.txt — no-cache so crawlers always see
# the freshest version.
aws s3 sync "$BUILD_DIR" s3://roganov.me \
    --exclude "*" \
    --include "*.xml" \
    --include "*.txt" \
    --cache-control "no-cache"

echo "📤 Pass 3 (feeds + robots) complete"

# One-shot cleanup: remove stale objects that predate the Astro rebuild and
# are excluded from the sync --delete globs above.
aws s3 rm s3://roganov.me/sitemap.xml 2>/dev/null || true

echo "🧹 Stale-object cleanup complete"

# Final listing
echo "📁 Contents of S3 bucket:"
aws s3 ls s3://roganov.me --recursive | tail -20

echo "✅ Deployment successful!"
echo "🌎 Site is now live at https://roganov.me"
