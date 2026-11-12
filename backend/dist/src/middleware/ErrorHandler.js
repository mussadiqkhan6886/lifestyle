"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorHandler = (err, req, res, next) => {
    const status = err.statusCode ?? 500;
    console.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        time: new Date().toISOString(),
    });
    const response = {
        success: false,
        message: process.env.NODE_ENV === "production" && status === 500
            ? "Something went wrong."
            : err.message,
    };
    if (process.env.NODE_ENV !== "production") {
        response.stack = err.stack;
    }
    res.status(status).json(response);
};
exports.ErrorHandler = ErrorHandler;
