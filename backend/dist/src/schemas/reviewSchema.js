"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.reviewSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Please Enter valid name"),
    title: zod_1.default.string().min(2, "Please Enter valid title").max(30, "Please Enter short title maximum 30 characters"),
    comment: zod_1.default.string().min(10, "Please Enter atleast 10 characters comment").max(130, "Maximum length of comment in 130"),
    rating: zod_1.default.coerce.number().int("Rating must be a whole number").min(1, "Please Enter rating atleast 1").max(5, "Maximum value of rating is 5 more then 5 is not valid")
});
