Write-Host "🚀 Chạy tất cả 4 MINIMAL test functions..." -ForegroundColor Green

Write-Host ""
Write-Host "📝 1. Test GET /api/user/me (getProfile) - MINIMAL" -ForegroundColor Cyan
Write-Host "------------------------------------------------"
npm test -- src/test/user/getProfile.minimal.test.ts

Write-Host ""
Write-Host "📝 2. Test GET /api/admin/users (getAllUsers) - MINIMAL" -ForegroundColor Cyan
Write-Host "-----------------------------------------------------"
npm test -- src/test/admin/getAllUsers.minimal.test.ts

Write-Host ""
Write-Host "📝 3. Test POST /api/comments/:imageId (postComment) - MINIMAL" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"
npm test -- src/test/comment/postComment.minimal.test.ts

Write-Host ""
Write-Host "📝 4. Test POST /api/likes/:imageId (toggleLike) - MINIMAL" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------"
npm test -- src/test/like/toggleLike.minimal.test.ts

Write-Host ""
Write-Host "✅ Hoàn thành tất cả MINIMAL tests!" -ForegroundColor Green
