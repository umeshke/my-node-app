# Navigate to app directory
Set-Location E:\project\my-node-app

# Install production deps (if needed)
npm ci --production

# Start Node app (PM2 recommended)
pm2 start server.js --name my-node-app
pm2 save
pm2 startup

Write-Host "Node.js app started with PM2"
