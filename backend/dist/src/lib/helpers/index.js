"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = exports.createSlug = void 0;
const node_crypto_1 = require("node:crypto");
const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
exports.createSlug = createSlug;
const generateOrderNumber = () => {
    const random = (0, node_crypto_1.randomBytes)(4).toString("hex").toUpperCase();
    return `LFS-${Date.now()}-${random}`;
};
exports.generateOrderNumber = generateOrderNumber;
