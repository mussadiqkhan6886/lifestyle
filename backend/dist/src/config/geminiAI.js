"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gemini = void 0;
const genai_1 = require("@google/genai");
exports.gemini = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_AI_API_KEY
});
