# Docker Build & Deploy Commands

Write-Host "🐳 Docker Build & Deploy Script" -ForegroundColor Green

Write-Host ""
Write-Host "1️⃣ Building TypeScript..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "2️⃣ Building Docker Image..." -ForegroundColor Yellow
docker build -t mongo-express-app:latest .

Write-Host ""
Write-Host "3️⃣ Starting containers with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🌐 App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  MongoDB UI: http://localhost:8081 (admin/admin123)" -ForegroundColor Cyan
Write-Host "💚 Health: http://localhost:3000/health" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor White
Write-Host "docker-compose logs -f app    # View app logs" -ForegroundColor Gray
Write-Host "docker-compose down          # Stop all containers" -ForegroundColor Gray
Write-Host "docker-compose up --build    # Rebuild and start" -ForegroundColor Gray
