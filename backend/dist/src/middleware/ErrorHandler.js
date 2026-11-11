export const ErrorHandler = (err, req, res, next) => {
    var _a;
    const status = (_a = err.statusCode) !== null && _a !== void 0 ? _a : 500;
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
