"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.aiSchema = zod_1.default.object({
    productName: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
