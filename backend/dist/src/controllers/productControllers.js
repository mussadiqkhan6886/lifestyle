import { uploadToCloudinary } from "../lib/helpers/uploadToCloudinary";
import { createSlug } from "../lib/helpers";
import { mapUploadedImagesToVariants, parseVariantsFromRequest } from "../lib/helpers/variants";
import { prisma } from "../config/prisma";
import { createProductSchema, updateProductSchema } from "../schemas/productSchema";
export const getAllProducts = async (req, res) => {
    try {
        const q = String(req.query.q || "").trim();
        const category = String(req.query.category || "").trim();
        const sort = String(req.query.sort || "featured").trim();
        const page = Math.max(1, Number(req.query.page) || 1);
        const requestedLimit = Number(req.query.limit) || 12;
        const limit = Math.min(Math.max(1, requestedLimit), 48);
        const skip = (page - 1) * limit;
        const where = {
            ...(category && { category }),
            ...(sort === "hot-sellers" && {
                hotSeller: true,
            }),
            ...(q && {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        };
        // Sorting
        let orderBy;
        switch (sort) {
            case "price-asc":
            case "price-desc":
            case "name":
                orderBy = [
                    { name: "asc" },
                    { id: "asc" },
                ];
                break;
            case "hot-sellers":
            case "featured":
            default:
                orderBy = { id: "desc" };
                break;
        }
        // Fetch products
        const result = await prisma.product.findMany({
            where,
            include: {
                variants: true,
            },
            orderBy,
            take: limit + 1,
            skip,
        });
        // Pagination
        const hasMore = result.length > limit;
        let products = result.slice(0, limit);
        // Price sorting
        if (sort === "price-asc" || sort === "price-desc") {
            const getEffectivePrice = (product) => {
                var _a;
                var _b;
                const variant = (_a = product.variants) === null || _a === void 0 ? void 0 : _a[0];
                if (!variant)
                    return Number.MAX_SAFE_INTEGER;
                if (variant.onSale && variant.salePrice != null) {
                    return Number(variant.salePrice);
                }
                return Number((_b = variant.price) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER);
            };
            products = [...products].sort((a, b) => {
                const diff = getEffectivePrice(a) - getEffectivePrice(b);
                return sort === "price-asc" ? diff : -diff;
            });
        }
        res.status(200).json({
            success: true,
            products,
            hasMore,
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch products",
        });
    }
};
export const getHotSellerProducts = async (req, res) => {
    const products = await prisma.product.findMany({
        where: { hotSeller: true },
        include: { variants: true },
    });
    res.status(200).json({
        success: true,
        products,
    });
};
export const getNewArrivals = async (req, res) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const products = await prisma.product.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        include: { variants: true }
    });
    res.status(200).json({
        success: true,
        products,
    });
};
export const getSingleProduct = async (req, res) => {
    try {
        const slug = String(req.params.slug);
        if (!slug) {
            res.status(400).json({ success: false, message: "A valid Product slug is required" });
            return;
        }
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { variants: true }
        });
        if (!product) {
            res.status(404).json({ success: false, message: "No product found with this id" });
            return;
        }
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch product" });
    }
};
export const createProduct = async (req, res) => {
    var _a;
    try {
        const variants = parseVariantsFromRequest(req.body);
        const validation = createProductSchema.safeParse({
            ...req.body,
            hotSeller: (_a = req.body.hotSeller) !== null && _a !== void 0 ? _a : false,
            variants,
        });
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
            return;
        }
        const { name, category, description, slug: rawSlug, hotSeller, variants: validatedVariants, } = validation.data;
        const slug = (rawSlug === null || rawSlug === void 0 ? void 0 : rawSlug.trim())
            ? createSlug(rawSlug)
            : createSlug(name);
        if (!validatedVariants || validatedVariants.length === 0) {
            res.status(400).json({
                success: false,
                message: "At least one product variant is required",
            });
            return;
        }
        // Upload files to Cloudinary
        const files = req.files || [];
        const uploadedFiles = await Promise.all(files.map(async (file, index) => {
            const uploadRes = await uploadToCloudinary(file.buffer);
            return {
                file,
                index,
                url: uploadRes.secure_url,
            };
        }));
        // Distribute images to their target validatedVariants
        const variantImagesMap = mapUploadedImagesToVariants(validatedVariants, uploadedFiles, req.body);
        for (let i = 0; i < validatedVariants.length; i++) {
            const v = validatedVariants[i];
            // Preserve pre-existing URLs (e.g. if passed as strings in images)
            const existingUrls = Array.isArray(v.existingImages)
                ? v.existingImages.filter((img) => typeof img === "string" && /^https?:\/\//i.test(img))
                : [];
            const newUrls = variantImagesMap[i] || [];
            v.existingImages = Array.from(new Set([...existingUrls, ...newUrls]));
        }
        // Save product and variants inside a transaction
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    name: name.trim(),
                    slug,
                    hotSeller,
                    category: category.trim(),
                    description: description.trim(),
                }
            });
            const createdVariants = await Promise.all(validatedVariants.map((v, i) => {
                var _a;
                const variantSku = ((_a = v.sku) === null || _a === void 0 ? void 0 : _a.trim()) || `${slug}-${createSlug(v.label)}-${Date.now()}-${i}`;
                return tx.variant.create({
                    data: {
                        label: v.label.trim(),
                        sku: variantSku,
                        stock: Number(v.stock) || 0,
                        price: Math.round(Number(v.price)),
                        onSale: Boolean(v.onSale === true),
                        salePrice: v.salePrice !== undefined && v.salePrice !== null
                            ? Math.round(Number(v.salePrice))
                            : null,
                        images: v.existingImages || [],
                        productId: product.id,
                    }
                });
            }));
            return {
                ...product,
                variants: createdVariants,
            };
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: result,
        });
    }
    catch (error) {
        console.error("createProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create product",
        });
    }
};
export const UpdateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ success: false, message: "A valid Product ID is required" });
            return;
        }
        const existingProduct = await prisma.product.findFirst({
            where: { id },
            include: { variants: true }
        });
        if (!existingProduct) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        const { name } = req.body;
        const rawSlug = req.body.slug;
        // Check for nameBody/slug conflict with other products
        if (name && name.trim() !== existingProduct.name) {
            const conflict = await prisma.product.findUnique({
                where: { name: name.trim() }
            });
            if (conflict && conflict.id !== id) {
                res.status(409).json({
                    success: false,
                    message: `Another product with name "${name}" already exists`,
                });
                return;
            }
        }
        const slugSource = (rawSlug === null || rawSlug === void 0 ? void 0 : rawSlug.trim()) || name;
        const updatedSlug = slugSource
            ? createSlug(slugSource)
            : existingProduct.slug;
        if (updatedSlug !== existingProduct.slug) {
            const conflict = await prisma.product.findUnique({
                where: { slug: updatedSlug }
            });
            if (conflict && conflict.id !== id) {
                res.status(409).json({
                    success: false,
                    message: `Another product with slug "${updatedSlug}" already exists`,
                });
                return;
            }
        }
        const incomingVariantsParsed = parseVariantsFromRequest(req.body);
        const validation = updateProductSchema.safeParse({
            ...req.body,
            variants: req.body.variants !== undefined
                ? incomingVariantsParsed
                : undefined,
        });
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
            return;
        }
        const { name: updatedName, category, description, slug, hotSeller, variants: validatedVariants, } = validation.data;
        const incomingVariants = validatedVariants !== null && validatedVariants !== void 0 ? validatedVariants : [];
        // Upload any newly uploaded files to Cloudinary
        const files = req.files || [];
        const uploadedFiles = await Promise.all(files.map(async (file, index) => {
            const uploadRes = await uploadToCloudinary(file.buffer);
            return {
                file,
                index,
                url: uploadRes.secure_url,
            };
        }));
        const variantImagesMap = incomingVariants.length > 0
            ? mapUploadedImagesToVariants(incomingVariants, uploadedFiles, req.body)
            : {};
        for (let i = 0; i < incomingVariants.length; i++) {
            const v = incomingVariants[i];
            const existingUrls = Array.isArray(v.existingImages)
                ? v.existingImages.filter((img) => typeof img === "string" && /^https?:\/\//i.test(img))
                : [];
            const newUrls = variantImagesMap[i] || [];
            v.existingImages = Array.from(new Set([...existingUrls, ...newUrls]));
        }
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update product base fields
            const productUpdateData = {};
            if (updatedName !== undefined)
                productUpdateData.name = updatedName.trim();
            if (slug !== undefined)
                productUpdateData.slug = slug;
            if (hotSeller !== undefined)
                productUpdateData.hotSeller = hotSeller;
            if (category !== undefined)
                productUpdateData.category = category.trim();
            if (description !== undefined)
                productUpdateData.description = description.trim();
            const updatedProd = Object.keys(productUpdateData).length > 0
                ? await tx.product.update({ where: { id }, data: productUpdateData })
                : existingProduct;
            const product = updatedProd || existingProduct;
            // 2. Update variants if provided
            const existingVariants = existingProduct.variants || [];
            let finalVariants = existingVariants;
            if (incomingVariants.length > 0) {
                const incomingIds = incomingVariants
                    .filter((v) => v.id !== undefined && v.id !== null)
                    .map((v) => Number(v.id));
                // Delete variants removed in update
                const toDelete = existingVariants.filter((exV) => !incomingIds.includes(exV.id));
                for (const delV of toDelete) {
                    await tx.variant.delete({ where: { id: delV.id } });
                }
                const updatedVariants = [];
                for (let i = 0; i < incomingVariants.length; i++) {
                    const v = incomingVariants[i];
                    const vId = v.id ? Number(v.id) : null;
                    const variantSku = `${slug}-${createSlug(v.label)}-${i}`;
                    if (vId && existingVariants.some((exV) => exV.id === vId)) {
                        // Update existing variant
                        const updatedV = await tx.variant.update({
                            where: { id: vId },
                            data: {
                                label: v.label.trim(),
                                sku: variantSku,
                                stock: Number(v.stock) || 0,
                                price: Math.round(Number(v.price)),
                                onSale: Boolean(v.onSale === true),
                                salePrice: v.salePrice !== undefined && v.salePrice !== null
                                    ? Math.round(Number(v.salePrice))
                                    : null,
                                images: v.existingImages || [],
                            }
                        });
                        if (updatedV) {
                            updatedVariants.push(updatedV);
                        }
                    }
                    else {
                        // Create newly added variant
                        const createdV = await tx.variant.create({
                            data: {
                                label: v.label.trim(),
                                sku: variantSku,
                                stock: Number(v.stock) || 0,
                                price: Math.round(Number(v.price)),
                                onSale: Boolean(v.onSale === true),
                                salePrice: v.salePrice !== undefined && v.salePrice !== null
                                    ? Math.round(Number(v.salePrice))
                                    : null,
                                images: v.existingImages || [],
                                productId: id,
                            }
                        });
                        updatedVariants.push(createdV);
                    }
                }
                finalVariants = updatedVariants;
            }
            return {
                ...product,
                variants: finalVariants,
            };
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: result,
        });
    }
    catch (error) {
        console.error("UpdateProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update product",
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ success: false, message: "A valid Product ID is required" });
            return;
        }
        const product = await prisma.product.findFirst({ where: { id } });
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        await prisma.product.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("deleteProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete product",
        });
    }
};
