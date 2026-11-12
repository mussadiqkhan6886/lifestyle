"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOption_1 = require("./config/corsOption");
const ErrorHandler_1 = require("./middleware/ErrorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const aiRoute_1 = __importDefault(require("./routes/aiRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOption_1.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "100kb",
    parameterLimit: 100,
}));
app.get(["/api/health", "/health"], (req, res) => {
    res.status(200).send("ok");
});
app.use(["/api/auth", "/auth"], authRoutes_1.default);
app.use(["/api/products", "/products"], productRoute_1.default);
app.use(["/api/ai", "/ai"], aiRoute_1.default);
app.use(["/api/review", "/review"], reviewRoute_1.default);
app.use(["/api/orders", "/orders"], orderRoute_1.default);
app.use(ErrorHandler_1.ErrorHandler);
exports.default = app;
