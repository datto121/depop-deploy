#!/bin/bash

echo "🚀 Chạy tất cả 4 test functions..."

echo ""
echo "📝 1. Test GET /api/user/me (getProfile)"
echo "----------------------------------------"
npm test -- src/test/user/getProfile.test.ts

echo ""
echo "📝 2. Test GET /api/admin/users (getAllUsers)"  
echo "-------------------------------------------"
npm test -- src/test/admin/getAllUsers.test.ts

echo ""
echo "📝 3. Test POST /api/comments/:imageId (postComment)"
echo "--------------------------------------------------"
npm test -- src/test/comment/postComment.test.ts

echo ""
echo "📝 4. Test POST /api/likes/:imageId (toggleLike)"
echo "----------------------------------------------"
npm test -- src/test/like/toggleLike.test.ts

echo ""
echo "✅ Hoàn thành tất cả test!"
