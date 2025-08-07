Write-Host "🚀 Chạy tất cả 4 test functions..." -ForegroundColor Green

Write-Host ""
Write-Host "📝 1. Test GET /api/user/me (getProfile)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
npm test -- src/test/user/getProfile.test.ts

Write-Host ""
Write-Host "📝 2. Test GET /api/admin/users (getAllUsers)" -ForegroundColor Yellow
Write-Host "-------------------------------------------"
npm test -- src/test/admin/getAllUsers.test.ts

Write-Host ""
Write-Host "📝 3. Test POST /api/comments/:imageId (postComment)" -ForegroundColor Yellow
Write-Host "--------------------------------------------------"
npm test -- src/test/comment/postComment.test.ts

Write-Host ""
Write-Host "📝 4. Test POST /api/likes/:imageId (toggleLike)" -ForegroundColor Yellow
Write-Host "----------------------------------------------"
npm test -- src/test/like/toggleLike.test.ts

Write-Host ""
Write-Host "✅ Hoàn thành tất cả test!" -ForegroundColor Green
