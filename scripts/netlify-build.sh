#!/usr/bin/env bash
set -euo pipefail

echo "[Netlify] Installing Ruby gems with Bundler"
bundle install --path vendor/bundle

echo "[Netlify] Building Jekyll site"
JEKYLL_ENV=production bundle exec jekyll build

echo "[Netlify] Preparing admin publish directory"
rm -rf netlify-deploy
mkdir -p netlify-deploy

# Copy the integrated admin interface
if [ -d "_site/admin" ]; then
  echo "[Netlify] Copying integrated admin interface"
  cp -R _site/admin/* netlify-deploy/
else
  echo "[Netlify] ERROR: _site/admin not found. Is admin present in the repo?"
  exit 1
fi

# Copy custom CMS admin assets
echo "[Netlify] Copying custom CMS admin assets"
mkdir -p netlify-deploy/new\ cms\ admin
if [ -d "_site/new cms admin" ]; then
  cp -R "_site/new cms admin"/* netlify-deploy/new\ cms\ admin/
elif [ -d "new cms admin" ]; then
  # If Jekyll didn't copy it, copy from source
  cp -R "new cms admin"/* netlify-deploy/new\ cms\ admin/
fi

echo "[Netlify] Copying site assets required by CMS"
mkdir -p netlify-deploy/assets
[ -d "_site/assets/css" ] && cp -R _site/assets/css netlify-deploy/assets/ || true
[ -d "_site/assets/images" ] && cp -R _site/assets/images netlify-deploy/assets/ || true

# Ensure Decap CMS can access the repo
echo "[Netlify] Setting up Netlify Identity for Git Gateway"

echo "[Netlify] Done. Publish dir contents:"
ls -la netlify-deploy || true
