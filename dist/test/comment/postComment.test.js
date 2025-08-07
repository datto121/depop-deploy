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
const Comment_1 = require("../../models/Comment");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.setTimeout(30000);
describe("Comment API - POST /api/comments/:imageId", () => {
    const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
    let testImageId;
    const setup = () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
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
        yield Comment_1.Comment.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongoose_1.default.connection.close(); }));
    it("should create comment when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield setup();
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/comments/${testImageId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ content: "Test comment" });
        expect(res.statusCode).toBe(201);
        expect(res.body.comment.content).toBe("Test comment");
        expect(res.body.comment).toHaveProperty("user");
        expect(res.body.comment).toHaveProperty("image", testImageId);
    }));
    it("should return 401 without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        yield setup();
        const res = yield (0, supertest_1.default)(app_1.default).post(`/api/comments/${testImageId}`).send({ content: "Test" });
        expect(res.statusCode).toBe(401);
    }));
    it("should handle multiple comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield setup();
        const res1 = yield (0, supertest_1.default)(app_1.default).post(`/api/comments/${testImageId}`)
            .set("Authorization", `Bearer ${token}`).send({ content: "Comment 1" });
        const res2 = yield (0, supertest_1.default)(app_1.default).post(`/api/comments/${testImageId}`)
            .set("Authorization", `Bearer ${token}`).send({ content: "Comment 2" });
        expect(res1.statusCode).toBe(201);
        expect(res2.statusCode).toBe(201);
        expect(res1.body.comment.content).toBe("Comment 1");
        expect(res2.body.comment.content).toBe("Comment 2");
    }));
});
