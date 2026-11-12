"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.createReview = exports.getAllReviews = void 0;
const prisma_1 = require("../config/prisma");
const reviewSchema_1 = require("../schemas/reviewSchema");
const getAllReviews = async (req, res) => {
    const reviews = await prisma_1.prisma.review.findMany({
        orderBy: {
            id: "desc"
        }
    });
    res.json({
        success: true,
        reviews
    });
};
exports.getAllReviews = getAllReviews;
const createReview = async (req, res) => {
    const parsedData = reviewSchema_1.reviewSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            success: false,
            message: parsedData.error.issues.map(issue => issue.message)
        });
        return;
    }
    const data = parsedData.data;
    const review = await prisma_1.prisma.review.create({
        data: {
            title: data.title,
            comment: data.comment,
            name: data.name,
            rating: data.rating
        }
    });
    res.status(201).json({
        success: true,
        review
    });
};
exports.createReview = createReview;
const deleteReview = async (req, res) => {
    const id = await Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            success: false,
            message: "A valid review ID is required"
        });
        return;
    }
    const review = await prisma_1.prisma.review.findUnique({ where: { id } });
    if (!review) {
        res.status(404).json({
            success: false,
            message: "Review not found with this id"
        });
        return;
    }
    await prisma_1.prisma.review.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteReview = deleteReview;
