import rateLimit from "express-rate-limit";
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    },
    legacyHeaders: false,
    standardHeaders: "draft-8",
});
