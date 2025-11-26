#!/usr/bin/env bash
set -euo pipefail

echo "[Netlify] Installing Ruby gems with Bundler"
gem install bundler -v 2.7.2
bundle _2.7.2_ install --path vendor/bundle

echo "[Netlify] Building Jekyll site"
JEKYLL_ENV=production bundle _2.7.2_ exec jekyll build

echo "[Netlify] Done. Publish dir is _site"
ls -la _site || true
