"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.aiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
