# 🚀 Hostinger VPS Deployment Guide

## Pharmacy POS System (MEVN Stack)

This guide will walk you through deploying your Pharmacy POS application (Vue.js frontend + Express.js backend) on a Hostinger VPS with the MEVN stack template.

---

## 📋 Prerequisites

- Hostinger VPS with Ubuntu 22.04 + MEVN Stack template installed
- SSH access to your VPS
- Your VPS IP address
- Domain name (optional, but recommended)

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Hostinger VPS Server            │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Nginx (Reverse Proxy)         │    │
│  │  Port 80/443                   │    │
│  └──────────┬─────────────────────┘    │
│             │                           │
│  ┌──────────▼──────────┐  ┌──────────┐ │
│  │  Vue.js Frontend    │  │  Backend │ │
│  │  (Static Files)     │  │  API     │ │
│  │                     │  │  Port    │ │
│  │                     │  │  3000    │ │
│  └─────────────────────┘  └────┬─────┘ │
│                                 │       │
│                          ┌──────▼─────┐ │
│                          │   MySQL    │ │
│                          │  Database  │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📦 Step 1: Connect to Your VPS

```bash
# Connect via SSH
ssh root@your_vps_ip

# Or if you have a username
ssh username@your_vps_ip
```

---

## 🔧 Step 2: Initial Server Setup

### 2.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Required Tools

```bash
# Install Git
sudo apt install git -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (if not already installed)
sudo apt install nginx -y

# Install MySQL client (if needed)
sudo apt install mysql-server -y
sudo apt install mysql-client -y
sudo systemctl status mysql
sudo systemctl start mysql
```

### 2.3 Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🗄️ Step 3: Set Up MySQL Database

### 3.1 Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to:

- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### 3.2 Create Database and User

```bash
# Login to MySQL
sudo mysql -u root -p

# Run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE pharmacy_pos;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'pharmacy_user'@'localhost' IDENTIFIED BY 'Velou@123';  pw - Velou@123

-- Grant privileges
GRANT ALL PRIVILEGES ON pharmacy_pos.* TO 'pharmacy_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

---

## 📥 Step 4: Deploy Your Application

### 4.1 Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/pharmacy-pos
cd /var/www/pharmacy-pos
```

### 4.2 Clone Your Repository

```bash
# If your code is on GitHub
sudo git clone https://github.com/MG4ACA/pharmacy-pos-backend.git


# Or upload your code using SCP from your local machine:
# scp -r /path/to/pharmacy-standalone-pos root@your_vps_ip:/var/www/pharmacy-pos
```

### 4.3 Set Correct Permissions

```bash
# Change ownership
sudo chown -R $USER:$USER /var/www/pharmacy-pos

# Set permissions
sudo chmod -R 755 /var/www/pharmacy-pos
```

---

cd pharmacy-pos-backend

git fetch --all
git branch
git checkout 'your_branch'
git pull origin dev

if errors occur try below
git reset --hard

## 🔨 Step 5: Set Up Backend

### 5.1 Navigate to Backend Directory

```bash
cd /var/www/pharmacy-pos/pharmacy-pos-backend
```

### 5.2 Install Dependencies

```bash
npm install --production
```

### 5.3 Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pharmacy_pos
DB_USER=pharmacy_user
DB_PASSWORD=Velou@123

# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# JWT Expiration
JWT_EXPIRES_IN=24h

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://your_vps_ip,https://yourdomain.com
```

**To generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5.4 Initialize Database

```bash
# Create database tables and seed
npm run db:create


# If you have product CSV data
npm run db:seed:products
```

### 5.5 Test Backend Locally

```bash
# Test if backend works
npm start

# In another terminal, test the API
curl http://localhost:3000/api/health
```

If successful, you should see a response. Press `Ctrl+C` to stop.

### 5.6 Set Up PM2 for Backend

```bash
# Start backend with PM2
pm2 start src/index.js --name pharmacy-pos-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup

# Check status
pm2 status
```

**Useful PM2 Commands:**

```bash
# View logs
pm2 logs pharmacy-pos-backend

# Restart app
pm2 restart pharmacy-pos-backend

# Stop app
pm2 stop pharmacy-pos-backend

# Monitor
pm2 monit
```

---

## 🎨 Step 6: Set Up Frontend

### 6.1 Navigate to Frontend Directory

## clone frotend repo then

```bash
cd /var/www/pharmacy-pos/pharmacy-pos-frontend
```

### 6.2 Configure API Endpoint

create environment file:

```bash
nano .env.production
```

```env
VITE_API_BASE_URL=http://your_vps_ip/api
```

or Update the frontend to point to your backend API:

```bash
nano src/api/client.js
```

Update the base URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://your_vps_ip/api';
```

### 6.3 Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with optimized static files.

### 6.4 Move Build to Nginx Directory

```bash
# Create directory for frontend
sudo mkdir -p /var/www/pharmacy-pos/frontend

# Copy built files
sudo cp -r dist/* /var/www/pharmacy-pos/frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/pharmacy-pos/frontend
sudo chmod -R 755 /var/www/pharmacy-pos/frontend
```

---

## 🌐 Step 7: Configure Nginx

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/pharmacy-pos
```

Add this configuration:

```nginx
# Upstream backend
upstream pharmacy_backend {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
 server_name demo-po.pharmacy.lumicore-labs.com www.demo-po.pharmacy.lumicore-labs.com;
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve Vue.js app
    location / {
        root /var/www/pharmacy-pos/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Express.js
    location /api/ {
        proxy_pass http://pharmacy_backend/api/;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Disable cache for API
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://pharmacy_backend/health;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/pharmacy-pos-access.log;
    error_log /var/log/nginx/pharmacy-pos-error.log;
}
```

### 7.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pharmacy-pos /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

---

## 🔒 Step 8: Set Up SSL (Optional but Recommended)

### 8.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Obtain SSL Certificate

**Note:** You need a domain name pointed to your VPS IP for this step.

```bash
# Replace with your domain
sudo certbot --nginx -d demo-po.pharmacy.lumicore-labs.com -d www.demo-po.pharmacy.lumicore-labs.com
```

Certbot will:

- Obtain certificate
- Automatically configure Nginx
- Set up automatic renewal

### 8.3 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 8.4 Update Frontend API URL

After SSL is set up, update your frontend API URL to use HTTPS:

```bash
nano /var/www/pharmacy-pos/src/api/client.js
```

Change to:

```javascript
const API_BASE_URL = 'https://lumicore.trustyou-go.com/api';
```

Rebuild and redeploy:

```bash
cd /var/www/pharmacy-pos
npm run build
sudo cp -r dist/* /var/www/pharmacy-pos/frontend/
```

---

## ✅ Step 9: Verify Deployment

### 9.1 Check Backend

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs pharmacy-pos-backend

# Test API directly
curl http://localhost:3000/api/health
```

### 9.2 Check Nginx

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/pharmacy-pos-error.log
```

### 9.3 Test Application

Open your browser and visit:

- `http://your_vps_ip` (or `https://yourdomain.com`)

You should see your Pharmacy POS login page!

---

## 🔄 Step 10: Deployment Script (For Updates)

Create a deployment script for easy updates:

```bash
nano /var/www/pharmacy-pos/deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/pharmacy-pos

# Pull latest changes (if using Git)
echo "📥 Pulling latest changes..."
git pull origin main

# Backend deployment
echo "🔨 Deploying backend..."
cd backend-project
npm install --production
pm2 restart pharmacy-pos-backend

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/pharmacy-pos/frontend/

# Restart Nginx
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x /var/www/pharmacy-pos/deploy.sh
```

Run deployment:

```bash
./deploy.sh
```

---

## 🛠️ Maintenance Commands

### Check Application Status

```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Check disk space
df -h

# Check memory usage
free -m
```

### View Logs

```bash
# Backend logs
pm2 logs pharmacy-pos-backend

# Nginx access logs
sudo tail -f /var/log/nginx/pharmacy-pos-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/pharmacy-pos-error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
mysqldump -u pharmacy_user -p pharmacy_pos > ~/backups/pharmacy_pos_$(date +%Y%m%d_%H%M%S).sql

# Create automated backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
mysqldump -u pharmacy_user -p'your_password' pharmacy_pos > $BACKUP_DIR/pharmacy_pos_$(date +%Y%m%d_%H%M%S).sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "pharmacy_pos_*.sql" -mtime +7 -delete
```

```bash
chmod +x ~/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /home/username/backup-db.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs pharmacy-pos-backend

# Common issues:
# 1. Port 3000 already in use
sudo lsof -i :3000
sudo kill -9 <PID>

# 2. Database connection failed
# Check .env file and MySQL credentials
mysql -u pharmacy_user -p pharmacy_pos
```

### Frontend Not Loading

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/pharmacy-pos-error.log

# Verify files exist
ls -la /var/www/pharmacy-pos/frontend

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 502 Bad Gateway

```bash
# Backend is not running
pm2 status
pm2 restart pharmacy-pos-backend

# Check backend is listening on port 3000
sudo netstat -tlnp | grep 3000
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u pharmacy_user -p pharmacy_pos

# Check MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check backend .env file
cat backend-project/.env
```

---

## � Updating Backend Changes on Server

When you make changes to the backend code and need to deploy them to the server, follow these steps:

### Method 1: Using Git (Recommended)

```bash
# 1. SSH into your server
ssh root@your_vps_ip

# 2. Navigate to backend directory
cd /var/www/pharmacy-pos/backend-project

# 3. Pull latest changes from repository
git pull origin main  # or your branch name (dev, master, etc.)

# 4. Install any new dependencies (if package.json changed)
npm install

# 5. Restart the backend application with PM2
pm2 restart pharmacy-pos-backend

# 6. Check if restart was successful
pm2 status

# 7. Monitor logs for any errors
pm2 logs pharmacy-pos-backend --lines 50
```

### Method 2: Manual File Upload (Alternative)

If you made changes locally and want to upload directly:

```bash
# From your local machine, upload changed files
scp -r backend-project/src/controllers/YourController.js root@your_vps_ip:/var/www/pharmacy-pos/backend-project/src/controllers/

# Then SSH into server and restart
ssh root@your_vps_ip
pm2 restart pharmacy-pos-backend
```

### Common Scenarios

#### Scenario A: Controller/Route Changes Only

```bash
# Just restart the application
pm2 restart pharmacy-pos-backend

# Verify it's running
pm2 status
```

#### Scenario B: Database Model Changes

```bash
# 1. Pull changes
git pull origin main

# 2. Run database sync (if using Sequelize sync)
cd /var/www/pharmacy-pos/backend-project
node -e "require('./src/database/models/index.js')"

# Or if you have a sync script
npm run db:sync

# 3. Restart backend
pm2 restart pharmacy-pos-backend
```

#### Scenario C: New Dependencies Added

```bash
# 1. Pull changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Restart backend
pm2 restart pharmacy-pos-backend
```

#### Scenario D: Environment Variables Changed

```bash
# 1. Edit .env file
nano /var/www/pharmacy-pos/backend-project/.env

# 2. Make your changes and save (Ctrl+X, Y, Enter)

# 3. Restart backend (required for env changes to take effect)
pm2 restart pharmacy-pos-backend
```

### Quick Update Commands (Copy-Paste Ready)

```bash
# Full update sequence
cd /var/www/pharmacy-pos/backend-project && \
git pull origin main && \
npm install && \
pm2 restart pharmacy-pos-backend && \
pm2 logs pharmacy-pos-backend --lines 20
```

### Verification Steps

After updating, always verify:

```bash
# 1. Check PM2 status
pm2 status

# 2. Check recent logs
pm2 logs pharmacy-pos-backend --lines 50

# 3. Test API endpoint
curl http://localhost:3000/api/health  # or your health check endpoint

# 4. Monitor for errors
pm2 monit
```

### Troubleshooting Update Issues

**Problem: Changes not reflecting**

```bash
# Hard restart PM2
pm2 delete pharmacy-pos-backend
pm2 start src/index.js --name pharmacy-pos-backend
pm2 save
```

**Problem: Application won't start after update**

```bash
# Check error logs
pm2 logs pharmacy-pos-backend --err

# Check if dependencies installed
npm list --depth=0

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem: Database errors after model changes**

```bash
# Check if database is running
sudo systemctl status mysql

# Verify database connection
mysql -u pharmacy_user -p pharmacy_pos

# Re-run migrations if needed
npm run db:migrate  # if using migrations
```

### PM2 Useful Commands Reference

```bash
# View all processes
pm2 list

# View logs (last 100 lines)
pm2 logs pharmacy-pos-backend --lines 100

# Follow logs in real-time
pm2 logs pharmacy-pos-backend

# Restart application
pm2 restart pharmacy-pos-backend

# Stop application
pm2 stop pharmacy-pos-backend

# Delete from PM2
pm2 delete pharmacy-pos-backend

# Reload application (0-downtime)
pm2 reload pharmacy-pos-backend

# View resource usage
pm2 monit

# Save current PM2 processes
pm2 save

# View detailed info
pm2 show pharmacy-pos-backend
```

### Automated Deployment Script (Optional)

Create a deployment script for easier updates:

```bash
# Create deploy script
nano /var/www/pharmacy-pos/deploy-backend.sh
```

Add this content:

```bash
#!/bin/bash

echo "🚀 Starting backend deployment..."

# Navigate to backend directory
cd /var/www/pharmacy-pos/backend-project

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Restart application
echo "🔄 Restarting backend..."
pm2 restart pharmacy-pos-backend

# Show status
echo "✅ Deployment complete!"
pm2 status

# Show recent logs
echo "📊 Recent logs:"
pm2 logs pharmacy-pos-backend --lines 20 --nostream
```

Make it executable:

```bash
chmod +x /var/www/pharmacy-pos/deploy-backend.sh
```

Run deployment:

```bash
/var/www/pharmacy-pos/deploy-backend.sh
```

### Best Practices

1. **Always backup before updating:**

   ```bash
   mysqldump -u pharmacy_user -p pharmacy_pos > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test changes locally first** before deploying to production

3. **Use Git branches** (dev → staging → main) for safer deployments

4. **Monitor logs** after every update for at least 5 minutes

5. **Keep PM2 updated:**

   ```bash
   npm install -g pm2@latest
   pm2 update
   ```

6. **Document changes** in your commit messages for easier rollback

---

## �📊 Monitoring Setup (Optional)

### Install Monitoring Tools

```bash
# Install htop for resource monitoring
sudo apt install htop -y

# Use PM2 monitoring
pm2 install pm2-server-monit
```

### Set Up PM2 Web Dashboard

```bash
# Install PM2 web interface
pm2 install pm2-web

# Access at: http://your_vps_ip:9615
```

---

## 🎯 Performance Optimization

### Enable Gzip Compression in Nginx

Edit `/etc/nginx/nginx.conf`:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### Configure Node.js for Production

In PM2 configuration:

```bash
pm2 start src/index.js --name pharmacy-pos-backend -i max --node-args="--max-old-space-size=1024"
```

---

## 📚 Additional Resources

- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Certbot](https://certbot.eff.org/)

---

## 📞 Support

If you encounter issues:

1. Check logs first (`pm2 logs`, nginx logs)
2. Verify all services are running
3. Check firewall settings
4. Review configuration files
5. Restart services in order: MySQL → Backend → Nginx

---

## 🎉 Congratulations!

Your Pharmacy POS System is now live on Hostinger VPS!

**Access your application at:**

- 🌐 Frontend: `http://your_vps_ip` or `https://yourdomain.com`
- 🔌 Backend API: `http://your_vps_ip/api` or `https://yourdomain.com/api`

**Default Login (if using seed data):**

- Username: `admin`
- Password: Check your seed file

---

## 📝 Post-Deployment Checklist

- [ ] Backend is running via PM2
- [ ] Database is created and seeded
- [ ] Frontend is built and served by Nginx
- [ ] API endpoints are accessible
- [ ] Application login works
- [ ] SSL certificate is installed (if using domain)
- [ ] Firewall is configured
- [ ] Backups are automated
- [ ] Monitoring is set up
- [ ] Deployment script is ready

---

**Last Updated:** December 31, 2025  
**Version:** 1.1.0
