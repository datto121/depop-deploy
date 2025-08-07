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
describe("Admin API - GET /api/admin/users", () => {
    const testUser = { name: "Test User", email: "test@example.com", password: "123456" };
    const adminUser = { name: "Admin", email: "admin@test.com", password: "123456", role: "admin" };
    const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
        const hash = require("bcrypt").hashSync(adminUser.password, 10);
        yield new User_1.User(Object.assign(Object.assign({}, adminUser), { password: hash })).save();
        return (yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send(adminUser)).body.accessToken;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return mongoose_1.default.connection.readyState === 0 && (yield mongoose_1.default.connect(process.env.MONGO_URI)); }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.User.deleteMany({}); }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongoose_1.default.connection.close(); }));
    it("should return all users for admin", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        const token = yield createAdmin();
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.users).toHaveLength(2);
        expect(res.body.users[0]).not.toHaveProperty("password");
    }));
    it("should return 401 without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/admin/users");
        expect(res.statusCode).toBe(401);
    }));
    it("should return 403 for regular user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        const login = yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send(testUser);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/admin/users").set("Authorization", `Bearer ${login.body.accessToken}`);
        expect(res.statusCode).toBe(403);
    }));
});
