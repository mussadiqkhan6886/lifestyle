"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
});
