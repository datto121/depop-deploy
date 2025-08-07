import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { Image } from "../../models/Image";
import { Like } from "../../models/Like";
import dotenv from "dotenv";
dotenv.config();

jest.setTimeout(30000);

describe("Like API - POST /api/likes/:imageId", () => {
  const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
  const secondUser = { name: "User 2", email: "user2@example.com", password: "123456" };
  let testImageId: string;

  const setup = async () => {
    await request(app).post("/api/auth/register").send(testUser);
    await request(app).post("/api/auth/register").send(secondUser);
    
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
    await Like.deleteMany({});
  });
  afterAll(async () => await mongoose.connection.close());

  it("should like/unlike toggle correctly", async () => {
    const token = await setup();
    
    // Like
    const likeRes = await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
    expect(likeRes.statusCode).toBe(200);
    expect(likeRes.body.liked).toBe(true);
    
    // Unlike
    const unlikeRes = await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
    expect(unlikeRes.statusCode).toBe(200);
    expect(unlikeRes.body.liked).toBe(false);
  });

  it("should return 401 without auth", async () => {
    await setup();
    const res = await request(app).post(`/api/likes/${testImageId}`);
    expect(res.statusCode).toBe(401);
  });

  it("should handle multiple users liking same image", async () => {
    const token1 = await setup();
    const token2 = (await request(app).post("/api/auth/login").send(secondUser)).body.accessToken;
    
    const res1 = await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token1}`);
    const res2 = await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token2}`);
    
    expect(res1.body.liked).toBe(true);
    expect(res2.body.liked).toBe(true);
  });

  it("should create/remove like record in database", async () => {
    const token = await setup();
    const user = await User.findOne({ email: testUser.email }) as any;
    
    
    await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
    let like = await Like.findOne({ user: user._id, image: testImageId });
    expect(like).toBeTruthy();
    
   
    await request(app).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
    like = await Like.findOne({ user: user._id, image: testImageId });
    expect(like).toBeNull();
  });
});
