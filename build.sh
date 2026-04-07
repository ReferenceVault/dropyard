#!/usr/bin/env bash

cd /var/www/dropyard/frontend

echo "==> Pull latest code"
git pull origin main


echo "==> Install dependencies"
npm install

echo "==> Build Next.js app"
npm run build

echo "✅ Frontend build complete"
