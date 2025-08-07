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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.setTimeout(30000);
describe("User Profile API - GET /api/user/me", () => {
    const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
    const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        return (yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send(testUser)).body.accessToken;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return mongoose_1.default.connection.readyState === 0 && (yield mongoose_1.default.connect(process.env.MONGO_URI)); }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.User.deleteMany({}); }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongoose_1.default.connection.close(); }));
    it("should return user profile when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield getToken();
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/user/me").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("email", testUser.email);
        expect(res.body.user).not.toHaveProperty("password");
    }));
    it("should return 401 without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/user/me");
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("UnAuthorized!!!");
    }));
    it("should return 401 with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/user/me").set("Authorization", "Bearer invalid.token");
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("UnAuthorized!!!");
    }));
    it("should return 401 with expired token", () => __awaiter(void 0, void 0, void 0, function* () {
        const jwt = require("jsonwebtoken");
        const user = yield User_1.User.create(Object.assign(Object.assign({}, testUser), { password: require("bcrypt").hashSync(testUser.password, 10) }));
        const expiredToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "-1h" });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/user/me").set("Authorization", `Bearer ${expiredToken}`);
        expect(res.statusCode).toBe(401);
    }));
});
