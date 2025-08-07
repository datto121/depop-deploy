# 🐳 Docker Deployment Guide

## 📦 Quick Start (Development)

### 1. Build và chạy với Docker Compose:
```bash
# Chạy script tự động
./deploy.ps1

# Hoặc manual:
npm run build
docker-compose up --build -d
```

### 2. Kiểm tra services:
- 🌐 **App**: http://localhost:3000
- 🗄️ **MongoDB UI**: http://localhost:8081 (admin/admin123)
- 💚 **Health Check**: http://localhost:3000/health

## 🚀 Production Deployment

### 1. Chuẩn bị môi trường:
```bash
# Copy và sửa environment variables
cp .env.production .env.prod
nano .env.prod  # Update với credentials thật

# Build production image
docker build -t mongo-express-app:prod .
```

### 2. Deploy production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. SSL Setup (Optional):
```bash
# Generate SSL certificates (Let's Encrypt)
mkdir ssl
# Copy your SSL certificates to ./ssl/
```

## 🔧 Management Commands

### Container Management:
```bash
# View logs
docker-compose logs -f app
docker-compose logs -f mongo

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart app

# Scale app (if needed)
docker-compose up -d --scale app=3
```

### Database Backup:
```bash
# Backup MongoDB
docker exec mongo-express-app_mongo_1 mongodump --db mongo-express-app --out /backups

# Restore from backup
docker exec mongo-express-app_mongo_1 mongorestore --db mongo-express-app /backups/mongo-express-app
```

### Image Management:
```bash
# Build specific version
docker build -t mongo-express-app:v1.0.0 .

# Push to registry (if using Docker Hub)
docker tag mongo-express-app:latest your-username/mongo-express-app:latest
docker push your-username/mongo-express-app:latest

# Clean up unused images
docker image prune -f
```

## 📊 Monitoring

### Health Checks:
```bash
# App health
curl http://localhost:3000/health

# Container status
docker-compose ps

# Resource usage
docker stats
```

### Logs:
```bash
# Real-time logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f app

# Export logs
docker-compose logs app > app.log
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Update MongoDB credentials
- [ ] Use HTTPS in production
- [ ] Limit container resources
- [ ] Regular security updates
- [ ] Network isolation
- [ ] Secret management

## 🚨 Troubleshooting

### Common Issues:

1. **Port conflicts**:
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Change port in docker-compose.yml
   ports: ["3001:3000"]
   ```

2. **MongoDB connection**:
   ```bash
   # Check MongoDB status
   docker-compose exec mongo mongosh
   
   # View MongoDB logs
   docker-compose logs mongo
   ```

3. **Build failures**:
   ```bash
   # Clean build
   docker system prune -f
   docker-compose build --no-cache
   ```

## 📈 Performance Optimization

1. **Multi-stage builds** (already implemented)
2. **Resource limits** (in prod compose)
3. **Health checks** (configured)
4. **Log rotation** (recommended)
5. **CDN for static files** (optional)

---

**🎯 Your app is now containerized and ready for deployment!**
