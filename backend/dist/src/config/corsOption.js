"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins_1 = require("./allowedOrigins");
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins_1.allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
};
