import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { Image } from "../../models/Image";
import { Comment } from "../../models/Comment";
import dotenv from "dotenv";
dotenv.config();

jest.setTimeout(30000);

describe("Comment API - POST /api/comments/:imageId", () => {
  const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
  let testImageId: string;

  const setup = async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    const user = await User.findOne({ email: testUser.email }) as any;
    
    const image = await Image.create({
      user: user._id,
      imageUrl: "https://test.jpg",
      publicId: "test_id",
      description: "Test image",
      visibility: "public",
      status: "approved"
    });
    
    testImageId = (image as any)._id.toString();
    return loginRes.body.accessToken;
  };

  beforeAll(async () => mongoose.connection.readyState === 0 && await mongoose.connect(process.env.MONGO_URI!));
  beforeEach(async () => {
    await User.deleteMany({});
    await Image.deleteMany({});
    await Comment.deleteMany({});
  });
  afterAll(async () => await mongoose.connection.close());

  it("should create comment when authenticated", async () => {
    const token = await setup();
    const res = await request(app)
      .post(`/api/comments/${testImageId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Test comment" });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.comment.content).toBe("Test comment");
    expect(res.body.comment).toHaveProperty("user");
    expect(res.body.comment).toHaveProperty("image", testImageId);
  });

  it("should return 401 without auth", async () => {
    await setup();
    const res = await request(app).post(`/api/comments/${testImageId}`).send({ content: "Test" });
    expect(res.statusCode).toBe(401);
  });

  it("should handle multiple comments", async () => {
    const token = await setup();
    
    const res1 = await request(app).post(`/api/comments/${testImageId}`)
      .set("Authorization", `Bearer ${token}`).send({ content: "Comment 1" });
    const res2 = await request(app).post(`/api/comments/${testImageId}`)
      .set("Authorization", `Bearer ${token}`).send({ content: "Comment 2" });
    
    expect(res1.statusCode).toBe(201);
    expect(res2.statusCode).toBe(201);
    expect(res1.body.comment.content).toBe("Comment 1");
    expect(res2.body.comment.content).toBe("Comment 2");
  });
});
