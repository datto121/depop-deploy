Write-Host "🚀 Chạy 4 test functions ngắn gọn..." -ForegroundColor Green

npm test -- src/test/user/getProfile.test.ts
npm test -- src/test/admin/getAllUsers.test.ts  
npm test -- src/test/comment/postComment.test.ts
npm test -- src/test/like/toggleLike.test.ts

Write-Host "✅ Hoàn thành!" -ForegroundColor Green
