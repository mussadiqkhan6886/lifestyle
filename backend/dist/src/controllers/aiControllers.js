"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerate = void 0;
const aiSchema_1 = require("../schemas/aiSchema");
const geminiAiService_1 = require("../service/geminiAiService");
const aiGenerate = async (req, res) => {
    try {
        const { productName, description } = req.body;
        const parsedData = aiSchema_1.aiSchema.safeParse({ productName, description });
        if (!parsedData.success) {
            res.status(400).json({ message: "Zod error, please enter correct field data", success: false, error: parsedData.error.message });
            return;
        }
        const data = parsedData.data;
        let response;
        if (!data.productName && !data.description) {
            res.status(400).json({
                success: false,
                message: "Provide productName or description"
            });
            return;
        }
        response = await (0, geminiAiService_1.generate)(data.productName, data.description);
        res.status(200).json({ success: true, answer: response });
    }
    catch (error) {
        if (error.status === 503) {
            res.status(503).json({
                success: false,
                message: "AI service is busy. Please try again."
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error.message || "AI generation failed"
        });
    }
};
exports.aiGenerate = aiGenerate;
