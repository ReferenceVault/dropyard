cd /var/www/dropyard/frontend
echo "==> Restart frontend with PM2"
pm2 restart dropyard-frontend || pm2 start npm --name dropyard-frontend --cwd /var/www/dropyard/frontend -- start

echo "==> Save PM2"
pm2 save

echo "✅ Frontend deploy complete"
