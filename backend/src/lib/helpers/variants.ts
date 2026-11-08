import { UploadedFileRef, VariantInput } from "../../types/global";

export const parseVariantsFromRequest = (body: Record<string, any>): VariantInput[] => {
    let variants = body.variants;

    if (typeof variants === "string") {
        try {
            variants = JSON.parse(variants);
        } catch {
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
                stock: body.stock ?? 0,
                price: body.price ?? 0,
                onSale: body.onSale,
                salePrice: body.salePrice,
                images: Array.isArray(body.images) ? body.images : []
            }];
        } else {
            variants = [];
        }
    }

    return variants;
};

export const mapUploadedImagesToVariants = (
    variants: VariantInput[],
    uploadedFiles: UploadedFileRef[],
    reqBody: Record<string, any>
): { [variantIndex: number]: string[] } => {
    const variantImagesMap: { [index: number]: string[] } = {};
    for (let i = 0; i < variants.length; i++) {
        variantImagesMap[i] = [];
    }

    if (uploadedFiles.length === 0) {
        return variantImagesMap;
    }

    let bodyVariantIndices: number[] | null = null;
    if (reqBody.variantIndices) {
        try {
            const parsed = typeof reqBody.variantIndices === "string"
                ? JSON.parse(reqBody.variantIndices)
                : reqBody.variantIndices;
            if (Array.isArray(parsed)) {
                bodyVariantIndices = parsed.map(Number);
            }
        } catch {
            // ignore JSON parse error
        }
    }

    let imageVariantMap: Record<string, any> | null = null;
    if (reqBody.imageVariantMap) {
        try {
            imageVariantMap = typeof reqBody.imageVariantMap === "string"
                ? JSON.parse(reqBody.imageVariantMap)
                : reqBody.imageVariantMap;
        } catch {
            // ignore
        }
    }

    for (const item of uploadedFiles) {
        const { file, index, url } = item;
        let targetIndex: number | null = null;

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
            const mapped = imageVariantMap[file.originalname] ?? imageVariantMap[String(index)];
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
                } else if (typeof v.imageIndices === "number" && v.imageIndices === index) {
                    targetIndex = vIdx;
                    break;
                }
            }
        }

        // 5. Check if a variant's images or imageNames includes this original filename
        if (targetIndex === null) {
            for (let vIdx = 0; vIdx < variants.length; vIdx++) {
                const v = variants[vIdx];
                const matchesName = (name: string) =>
                    name === file.originalname ||
                    file.originalname.includes(name) ||
                    name.includes(file.originalname);

                if (Array.isArray(v.imageNames) && v.imageNames.some(matchesName)) {
                    targetIndex = vIdx;
                    break;
                }
                if (Array.isArray(v.images) && v.images.some(matchesName)) {
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