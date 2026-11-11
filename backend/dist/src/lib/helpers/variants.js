export const parseVariantsFromRequest = (body) => {
    var _a, _b;
    let variants = body.variants;
    if (typeof variants === "string") {
        try {
            variants = JSON.parse(variants);
        }
        catch (_c) {
            variants = [];
        }
    }
    if (variants && typeof variants === "object" && !Array.isArray(variants)) {
        variants = Object.values(variants);
    }
    if (!Array.isArray(variants)) {
        if (body.price !== undefined || body.sku !== undefined || body.label !== undefined) {
            variants = [{
                    label: body.label || "Default",
                    sku: body.sku,
                    stock: (_a = body.stock) !== null && _a !== void 0 ? _a : 0,
                    price: (_b = body.price) !== null && _b !== void 0 ? _b : 0,
                    onSale: body.onSale,
                    salePrice: body.salePrice,
                    images: Array.isArray(body.images) ? body.images : []
                }];
        }
        else {
            variants = [];
        }
    }
    return variants;
};
export const mapUploadedImagesToVariants = (variants, uploadedFiles, reqBody) => {
    var _a;
    const variantImagesMap = {};
    for (let i = 0; i < variants.length; i++) {
        variantImagesMap[i] = [];
    }
    if (uploadedFiles.length === 0) {
        return variantImagesMap;
    }
    let bodyVariantIndices = null;
    if (reqBody.variantIndices) {
        try {
            const parsed = typeof reqBody.variantIndices === "string"
                ? JSON.parse(reqBody.variantIndices)
                : reqBody.variantIndices;
            if (Array.isArray(parsed)) {
                bodyVariantIndices = parsed.map(Number);
            }
        }
        catch (_b) {
            // ignore JSON parse error
        }
    }
    let imageVariantMap = null;
    if (reqBody.imageVariantMap) {
        try {
            imageVariantMap = typeof reqBody.imageVariantMap === "string"
                ? JSON.parse(reqBody.imageVariantMap)
                : reqBody.imageVariantMap;
        }
        catch (_c) {
            // ignore
        }
    }
    for (const item of uploadedFiles) {
        const { file, index, url } = item;
        let targetIndex = null;
        // 1. Check if fieldname specifies the variant index:
        // Examples: "variants[0][images]", "variant_0_images", "images_0", "variant-0", "variants[0]"
        const fieldMatch = file.fieldname.match(/(?:variant[s]?\[?|_|-)(\d+)/i);
        if (fieldMatch) {
            const idx = parseInt(fieldMatch[1], 10);
            if (idx >= 0 && idx < variants.length) {
                targetIndex = idx;
            }
        }
        // 2. Check if req.body.variantIndices specifies it for this file index
        if (targetIndex === null && bodyVariantIndices && bodyVariantIndices[index] !== undefined) {
            const idx = bodyVariantIndices[index];
            if (idx >= 0 && idx < variants.length) {
                targetIndex = idx;
            }
        }
        // 3. Check req.body.imageVariantMap by originalname or file index
        if (targetIndex === null && imageVariantMap) {
            const mapped = (_a = imageVariantMap[file.originalname]) !== null && _a !== void 0 ? _a : imageVariantMap[String(index)];
            if (mapped !== undefined) {
                const idx = Number(mapped);
                if (!isNaN(idx) && idx >= 0 && idx < variants.length) {
                    targetIndex = idx;
                }
            }
        }
        // 4. Check if a variant explicitly claims this file index via imageIndices
        if (targetIndex === null) {
            for (let vIdx = 0; vIdx < variants.length; vIdx++) {
                const v = variants[vIdx];
                if (Array.isArray(v.imageIndices) && v.imageIndices.map(Number).includes(index)) {
                    targetIndex = vIdx;
                    break;
                }
                else if (typeof v.imageIndices === "number" && v.imageIndices === index) {
                    targetIndex = vIdx;
                    break;
                }
            }
        }
        // 5. Check if a variant's images or imageNames includes this original filename
        if (targetIndex === null) {
            for (let vIdx = 0; vIdx < variants.length; vIdx++) {
                const v = variants[vIdx];
                const matchesName = (name) => name === file.originalname ||
                    file.originalname.includes(name) ||
                    name.includes(file.originalname);
                if (Array.isArray(v.imageNames) && v.imageNames.some(matchesName)) {
                    targetIndex = vIdx;
                    break;
                }
                if (Array.isArray(v.existingImages) && v.existingImages.some(matchesName)) {
                    targetIndex = vIdx;
                    break;
                }
            }
        }
        // 6. If there is only 1 variant, all files go to it
        if (targetIndex === null && variants.length === 1) {
            targetIndex = 0;
        }
        // 7. Fallback: distribute by position or default to variant 0
        if (targetIndex === null) {
            targetIndex = index < variants.length ? index : 0;
        }
        variantImagesMap[targetIndex].push(url);
    }
    return variantImagesMap;
};
