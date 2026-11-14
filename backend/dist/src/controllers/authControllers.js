"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginSchema_1 = require("../schemas/loginSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const login = async (req, res) => {
    const { email, password } = req.body;
    const safeParsed = loginSchema_1.loginSchema.safeParse({ email, password });
    if (!safeParsed.success) {
        res.status(400).json({ success: false, message: "Please enter a valid email and password" });
        return;
    }
    const data = safeParsed.data;
    const user = await prisma_1.prisma.admin.findUnique({ where: { email: data.email } });
    if (!user) {
        res.status(404).json({ success: false, message: "Admin not found with this email" });
        return;
    }
    const comparePassword = await bcryptjs_1.default.compare(data.password, user.password);
    if (!comparePassword) {
        res.status(401).json({ success: false, message: "Wrong password" });
        return;
    }
    const accessSecret = process.env.ACCESS_TOKEN;
    const refreshSecret = process.env.REFRESH_TOKEN;
    if (!accessSecret || !refreshSecret) {
        throw new Error('JWT secrets are not configured');
    }
    const accessToken = jsonwebtoken_1.default.sign({
        adminInfo: {
            id: user.id,
            email: user.email
        }
    }, accessSecret, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email
    }, refreshSecret, { expiresIn: "7d" });
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/'
    };
    res.cookie("accessToken", accessToken, {
        ...cookieOptions, maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ message: "Login successfully" });
};
exports.login = login;
const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        res.sendStatus(204);
        return;
    }
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/'
    };
    res.clearCookie("accessToken", {
        ...cookieOptions, maxAge: 15 * 60 * 1000
    });
    res.clearCookie("refreshToken", {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ message: "Logout successfully" });
};
exports.logout = logout;
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        res.sendStatus(204);
        return;
    }
    const token = cookies.refreshToken;
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN, async (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        const admin = await prisma_1.prisma.admin.findUnique({ where: { id: Number(decoded.id) } });
        if (!admin) {
            res.status(401).json({ message: "No User Found" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({
            adminInfo: {
                id: admin.id,
                email: admin.email
            }
        }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/'
        };
        res.cookie("accessToken", accessToken, {
            ...cookieOptions, maxAge: 15 * 60 * 1000
        });
        res.json({ message: "Token refreshed" });
    });
};
exports.refresh = refresh;
