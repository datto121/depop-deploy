import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { User } from "../../models/User";
import dotenv from "dotenv";
dotenv.config();

jest.setTimeout(30000);

describe("User Profile API - GET /api/user/me", () => {
  const testUser = { name: "Test User", email: "test@example.com", password: "123456" };

  const getToken = async () => {
    await request(app).post("/api/auth/register").send(testUser);
    return (await request(app).post("/api/auth/login").send(testUser)).body.accessToken;
  };

  beforeAll(async () => mongoose.connection.readyState === 0 && await mongoose.connect(process.env.MONGO_URI!));
  beforeEach(async () => await User.deleteMany({}));
  afterAll(async () => await mongoose.connection.close());

  it("should return user profile when authenticated", async () => {
    const token = await getToken();
    const res = await request(app).get("/api/user/me").set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should return 401 without auth", async () => {
    const res = await request(app).get("/api/user/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("UnAuthorized!!!");
  });

  it("should return 401 with invalid token", async () => {
    const res = await request(app).get("/api/user/me").set("Authorization", "Bearer invalid.token");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("UnAuthorized!!!");
  });

  it("should return 401 with expired token", async () => {
    const jwt = require("jsonwebtoken");
    const user = await User.create({...testUser, password: require("bcrypt").hashSync(testUser.password, 10)});
    const expiredToken = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "-1h"});
    
    const res = await request(app).get("/api/user/me").set("Authorization", `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });
});
