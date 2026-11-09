import { Request, Response } from "express";
import { db } from "../prisma/db";
import { uploadToCloudinary } from "../lib/helpers/uploadToCloudinary";
import { createSlug } from "../lib/helpers";
import { mapUploadedImagesToVariants, parseVariantsFromRequest } from "../lib/helpers/variants";
import { UploadedFileRef } from "../types/global";
import { or } from "@prisma/orm-postgres/orm-client";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    const sort = String(req.query.sort || "featured").trim();

    const page = Math.max(1, Number(req.query.page) || 1);
    const requestedLimit = Number(req.query.limit) || 12;
    const limit = Math.min(Math.max(1, requestedLimit), 48);
    const skip = (page - 1) * limit;

    let productQuery = db.orm.public.Product.include("variants");

    if (category) {
      productQuery = productQuery.where({ category });
    }

    // Search
    if (q) {
      productQuery = productQuery.where((p) =>
        or(
          p.name.ilike(`%${q}%`),
          p.category.ilike(`%${q}%`),
          p.description.ilike(`%${q}%`),
          p.slug.ilike(`%${q}%`)
        )
      );
    }
    // Backend sorting
   // Hot sellers filter
    if (sort === "hot-sellers") {
    productQuery = productQuery.where({ hotSeller: true });
    }

    // Ordering
    switch (sort) {
    case "price-asc":
    case "price-desc":
        // Temporary: sort by name/id in SQL.
        // After fetch, re-sort the page by effective variant price (see below).
        productQuery = productQuery.orderBy([
        (p) => p.name.asc(),
        (p) => p.id.asc(),
        ]);
        break;

    case "name":
        productQuery = productQuery.orderBy([
        (p) => p.name.asc(),
        (p) => p.id.asc(),
        ]);
        break;

    case "hot-sellers":
        productQuery = productQuery.orderBy((p) => p.id.desc());
        break;

    case "featured":
    default:
        productQuery = productQuery.orderBy((p) => p.id.desc());
        break;
    }

    const result = await productQuery
    .limit(limit + 1)
    .offset(skip)
    .all();

    const hasMore = result.length > limit;
    let products = result.slice(0, limit);

    // Page-level price sort (only when price sort is requested)
    if (sort === "price-asc" || sort === "price-desc") {
    const getEffectivePrice = (product: any) => {
        const variant = product.variants?.[0];
        if (!variant) return Number.MAX_SAFE_INTEGER;
        if (variant.onSale && variant.salePrice != null) {
        return Number(variant.salePrice);
        }
        return Number(variant.price ?? Number.MAX_SAFE_INTEGER);
    };

    products = [...products].sort((a, b) => {
        const diff = getEffectivePrice(a) - getEffectivePrice(b);
        return sort === "price-asc" ? diff : -diff;
    });
    }

    res.status(200).json({
      success: true,
      products: products,
      hasMore,
      currentPage: page,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

export const getHotSellerProducts = async ( req: Request, res: Response ): Promise<void> => {
    const products = await db.orm.public.Product
        .where({ hotSeller: true })
        .include("variants")
        .all();

    res.status(200).json({
        success: true,
        products,
    });
};

export const getNewArrivals = async ( req: Request, res: Response): Promise<void> => {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await db.orm.public.Product
        .where((p) => p.createdAt.gte(sevenDaysAgo))
        .include("variants")
        .all();


    res.status(200).json({
        success: true,
        products,
    });
};

export const getSingleProduct = async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    try {
        const slug = String(req.params.slug);

        if (!slug) {
            res.status(400).json({ success: false, message: "A valid Product slug is required" });
            return;
        }

        const product = await db.orm.public.Product.where({ slug }).include("variants").first();

        if (!product) {
            res.status(404).json({ success: false, message: "No product found with this id" });
            return;
        }

        res.status(200).json({ success: true, product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch product" });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, category, description } = req.body;
        const rawSlug = req.body.slug;
        const hotSeller = req.body.hotSeller === true || req.body.hotSeller === "true";

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ success: false, message: "Product name is required" });
            return;
        }

        if (!category || typeof category !== "string" || !category.trim()) {
            res.status(400).json({ success: false, message: "Product category is required" });
            return;
        }

        if (!description || typeof description !== "string" || !description.trim()) {
            res.status(400).json({ success: false, message: "Product description is required" });
            return;
        }

        const slug = rawSlug && typeof rawSlug === "string" && rawSlug.trim()
            ? createSlug(rawSlug)
            : createSlug(name);

        const variants = parseVariantsFromRequest(req.body);

        if (!variants || variants.length === 0) {
            res.status(400).json({
                success: false,
                message: "At least one product variant is required",
            });
            return;
        }

        // Validate variants
        for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            if (!v.label || typeof v.label !== "string" || !v.label.trim()) {
                res.status(400).json({
                    success: false,
                    message: `Variant at index ${i} requires a non-empty label`,
                });
                return;
            }
            if (v.price === undefined || v.price === null || isNaN(Number(v.price))) {
                res.status(400).json({
                    success: false,
                    message: `Variant "${v.label}" requires a valid price`,
                });
                return;
            }
        }

        // Upload files to Cloudinary
        const files = (req.files as Express.Multer.File[]) || [];
        const uploadedFiles: UploadedFileRef[] = await Promise.all(
            files.map(async (file, index) => {
                const uploadRes = await uploadToCloudinary(file.buffer);
                return {
                    file,
                    index,
                    url: uploadRes.secure_url,
                };
            })
        );

        // Distribute images to their target variants
        const variantImagesMap = mapUploadedImagesToVariants(variants, uploadedFiles, req.body);

        for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            // Preserve pre-existing URLs (e.g. if passed as strings in images)
            const existingUrls = Array.isArray(v.existingImages)
                ? v.existingImages.filter((img) => typeof img === "string" && /^https?:\/\//i.test(img))
                : [];
            const newUrls = variantImagesMap[i] || [];
            v.existingImages = Array.from(new Set([...existingUrls, ...newUrls]));
        }

        // Save product and variants inside a transaction
        const result = await db.transaction(async (tx) => {
            const product = await tx.orm.public.Product.create({
                name: name.trim(),
                slug,
                hotSeller,
                category: category.trim(),
                description: description.trim(),
            });
            const createdVariants = await Promise.all(
                variants.map((v, i) => {
                    const variantSku =
                    v.sku?.trim() || `${slug}-${createSlug(v.label)}-${Date.now()}-${i}`

                    return tx.orm.public.Variant.create({
                    label: v.label.trim(),
                    sku: variantSku,
                    stock: Number(v.stock) || 0,
                    price: Math.round(Number(v.price)),
                    onSale: Boolean(v.onSale === true || v.onSale === 'true'),
                    salePrice:
                        v.salePrice !== undefined && v.salePrice !== null && v.salePrice !== ''
                        ? Math.round(Number(v.salePrice))
                        : null,
                    images: v.existingImages || [],
                    productId: product.id,
                    })
                })
                )

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
    } catch (error: any) {
        console.error("createProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create product",
        });
    }
};

export const UpdateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ success: false, message: "A valid Product ID is required" });
            return;
        }

        const existingProduct = await db.orm.public.Product.where({ id }).include("variants").first();

        if (!existingProduct) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const { name, category, description } = req.body;
        const rawSlug = req.body.slug;
        const hotSeller = req.body.hotSeller !== undefined
            ? (req.body.hotSeller === true || req.body.hotSeller === "true")
            : undefined;

        // Check for name/slug conflict with other products
        if (name && name.trim() !== existingProduct.name) {
            const conflict = await db.orm.public.Product.where({ name: name.trim() }).first();
            if (conflict && conflict.id !== id) {
                res.status(409).json({
                    success: false,
                    message: `Another product with name "${name}" already exists`,
                });
                return;
            }
        }

        let updatedSlug = existingProduct.slug;
        updatedSlug = createSlug(name)

        if (updatedSlug !== existingProduct.slug) {
            const conflict = await db.orm.public.Product.where({ slug: updatedSlug }).first();
            if (conflict && conflict.id !== id) {
                res.status(409).json({
                    success: false,
                    message: `Another product with slug "${updatedSlug}" already exists`,
                });
                return;
            }
        }

        const incomingVariants = parseVariantsFromRequest(req.body);

        // Upload any newly uploaded files to Cloudinary
        const files = (req.files as Express.Multer.File[]) || [];
        const uploadedFiles: UploadedFileRef[] = await Promise.all(
            files.map(async (file, index) => {
                const uploadRes = await uploadToCloudinary(file.buffer);
                return {
                    file,
                    index,
                    url: uploadRes.secure_url,
                };
            })
        );

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

        const result = await db.transaction(async (tx) => {
            // 1. Update product base fields
            const productUpdateData: {
                name?: string;
                slug?: string;
                hotSeller?: boolean;
                category?: string;
                description?: string;
            } = {};

            if (name !== undefined) productUpdateData.name = name.trim();
            if (updatedSlug !== undefined) productUpdateData.slug = updatedSlug;
            if (hotSeller !== undefined) productUpdateData.hotSeller = hotSeller;
            if (category !== undefined) productUpdateData.category = category.trim();
            if (description !== undefined) productUpdateData.description = description.trim();

            const updatedProd = Object.keys(productUpdateData).length > 0
                ? await tx.orm.public.Product.where({ id }).update(productUpdateData)
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
                    await tx.orm.public.Variant.where({ id: delV.id }).delete();
                }

                const updatedVariants = [];
                for (let i = 0; i < incomingVariants.length; i++) {
                    const v = incomingVariants[i];
                    const vId = v.id ? Number(v.id) : null;
                    const variantSku = `${updatedSlug}-${createSlug(v.label)}-${i}`;

                    if (vId && existingVariants.some((exV) => exV.id === vId)) {
                        // Update existing variant
                        const updatedV = await tx.orm.public.Variant.where({ id: vId }).update({
                            label: v.label.trim(),
                            sku: variantSku,
                            stock: Number(v.stock) || 0,
                            price: Math.round(Number(v.price)),
                            onSale: Boolean(v.onSale === true || v.onSale === "true"),
                            salePrice: v.salePrice !== undefined && v.salePrice !== null && v.salePrice !== ""
                                ? Math.round(Number(v.salePrice))
                                : null,
                            images: v.existingImages || [],
                        });
                        if (updatedV) {
                            updatedVariants.push(updatedV);
                        }
                    } else {
                        // Create newly added variant
                        const createdV = await tx.orm.public.Variant.create({
                            label: v.label.trim(),
                            sku: variantSku,
                            stock: Number(v.stock) || 0,
                            price: Math.round(Number(v.price)),
                            onSale: Boolean(v.onSale === true || v.onSale === "true"),
                            salePrice: v.salePrice !== undefined && v.salePrice !== null && v.salePrice !== ""
                                ? Math.round(Number(v.salePrice))
                                : null,
                            images: v.existingImages || [],
                            productId: id,
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
    } catch (error: any) {
        console.error("UpdateProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update product",
        });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({ success: false, message: "A valid Product ID is required" });
            return;
        }

        const product = await db.orm.public.Product.where({ id }).first();

        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        await db.orm.public.Product.where({ id }).delete();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        console.error("deleteProduct error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete product",
        });
    }
};

