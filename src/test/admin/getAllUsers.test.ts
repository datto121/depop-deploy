import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { User } from "../../models/User";
import dotenv from "dotenv";
dotenv.config();

jest.setTimeout(30000);

describe("Admin API - GET /api/admin/users", () => {
  const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
  const adminUser = { name: "Admin", email: "admin@test.com", password: "123456", role: "admin" };

  const createAdmin = async () => {
    const hash = require("bcrypt").hashSync(adminUser.password, 10);
    await new User({ ...adminUser, password: hash }).save();
    return (await request(app).post("/api/auth/login").send(adminUser)).body.accessToken;
  };

  beforeAll(async () => mongoose.connection.readyState === 0 && await mongoose.connect(process.env.MONGO_URI!));
  beforeEach(async () => await User.deleteMany({}));
  afterAll(async () => await mongoose.connection.close());

  it("should return all users for admin", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const token = await createAdmin();
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toHaveLength(2);
    expect(res.body.users[0]).not.toHaveProperty("password");
  });

  it("should return 401 without auth", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.statusCode).toBe(401);
  });

  it("should return 403 for regular user", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const login = await request(app).post("/api/auth/login").send(testUser);
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${login.body.accessToken}`);
    expect(res.statusCode).toBe(403);
  });
});
