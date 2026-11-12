"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.admin = {
            id: decoded.adminInfo.id,
            email: decoded.adminInfo.email,
        };
        next();
    });
};
exports.verifyJWT = verifyJWT;
