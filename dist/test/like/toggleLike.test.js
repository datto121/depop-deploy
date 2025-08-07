"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../models/User");
const Image_1 = require("../../models/Image");
const Like_1 = require("../../models/Like");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.setTimeout(30000);
describe("Like API - POST /api/likes/:imageId", () => {
    const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
    const secondUser = { name: "User 2", email: "user2@example.com", password: "123456" };
    let testImageId;
    const setup = () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(secondUser);
        const loginRes = yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send(testUser);
        const user = yield User_1.User.findOne({ email: testUser.email });
        const image = yield Image_1.Image.create({
            user: user._id,
            imageUrl: "https://test.jpg",
            publicId: "test_id",
            description: "Test image",
            visibility: "public",
            status: "approved"
        });
        testImageId = image._id.toString();
        return loginRes.body.accessToken;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return mongoose_1.default.connection.readyState === 0 && (yield mongoose_1.default.connect(process.env.MONGO_URI)); }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.User.deleteMany({});
        yield Image_1.Image.deleteMany({});
        yield Like_1.Like.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongoose_1.default.connection.close(); }));
    it("should like/unlike toggle correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield setup();
        const likeRes = yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
        expect(likeRes.statusCode).toBe(200);
        expect(likeRes.body.liked).toBe(true);
        const unlikeRes = yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
        expect(unlikeRes.statusCode).toBe(200);
        expect(unlikeRes.body.liked).toBe(false);
    }));
    it("should return 401 without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        yield setup();
        const res = yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`);
        expect(res.statusCode).toBe(401);
    }));
    it("should handle multiple users liking same image", () => __awaiter(void 0, void 0, void 0, function* () {
        const token1 = yield setup();
        const token2 = (yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send(secondUser)).body.accessToken;
        const res1 = yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token1}`);
        const res2 = yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token2}`);
        expect(res1.body.liked).toBe(true);
        expect(res2.body.liked).toBe(true);
    }));
    it("should create/remove like record in database", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield setup();
        const user = yield User_1.User.findOne({ email: testUser.email });
        yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
        let like = yield Like_1.Like.findOne({ user: user._id, image: testImageId });
        expect(like).toBeTruthy();
        yield (0, supertest_1.default)(app_1.default).post(`/api/likes/${testImageId}`).set("Authorization", `Bearer ${token}`);
        like = yield Like_1.Like.findOne({ user: user._id, image: testImageId });
        expect(like).toBeNull();
    }));
});
