#!/usr/bin/env bash

cd /var/www/dropyard/frontend

echo "==> Pull latest code"
git fetch origin
git reset --hard origin/main   # change branch if needed



echo "==> Install dependencies"
npm install

echo "==> Build Next.js app"
npm run build

echo "✅ Frontend build complete"
