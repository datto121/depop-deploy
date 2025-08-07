import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import imageRoutes from "./routes/image.routes";

import likeRoutes from "./routes/like.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);

app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

export default app;
