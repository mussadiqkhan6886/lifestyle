"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const geminiAI_1 = require("../config/geminiAI");
async function generate(productName, description) {
    const prompt = description?.trim()
        ? `
        Rewrite the following product description for an ecommerce website.

        Product description: ${description}

        Requirements:
        - Write 4 to 5 clear, professional sentences.
        - Make it SEO-friendly and easy to understand.
        - Preserve the original product details.
        - Do not invent product features.
        - Return plain text only.
        - Do not use Markdown formatting.
        - Do not use bold text, asterisks, headings, bullet points, or quotation marks.
        - Return only the rewritten description without any introduction or explanation.
        `
        : `
        Write a product description for an ecommerce website.

        Product name: ${productName}

        Requirements:
        - Write 4 to 5 clear, professional sentences.
        - Make it SEO-friendly and easy to understand.
        - Do not invent specific product features that are not provided.
        - Return plain text only.
        - Do not use Markdown formatting.
        - Do not use bold text, asterisks, headings, bullet points, or quotation marks.
        - Return only the product description without any introduction or explanation. `;
    const response = await geminiAI_1.gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });
    return response.text;
}
