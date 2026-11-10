import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { reviewSchema } from "../schemas/reviewSchema";

export const getAllReviews = async (req:Request, res:Response) : Promise<void> => {
    const reviews = await prisma.review.findMany({
        orderBy: {
                id: "desc"
            }
    })

    res.json({
        success:true,
        reviews
    })
}
export const createReview = async (req:Request, res:Response) : Promise<void> => {

    const parsedData = reviewSchema.safeParse(req.body)
    
    if(!parsedData.success){
        res.status(400).json({
            success:false,
            message: parsedData.error.issues.map(issue => issue.message)
        })
        return
    }

    const data = parsedData.data

    const review = await prisma.review.create({
        data: {
            title: data.title,
            comment: data.comment,
            name: data.name,
            rating: data.rating
        }
    })

    res.status(201).json({
        success: true,
        review
    });

}
export const deleteReview = async (req:Request<{id: string}>, res:Response) : Promise<void> => {
    const id = await Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                success: false,
                message: "A valid review ID is required"
            });
            return;
        }

    const review = await prisma.review.findUnique({where: {id}})

    if(!review){
        res.status(404).json({
            success:false,
            message: "Review not found with this id"
        })
        return
    }

    await prisma.review.delete({where: {id}})

    res.status(204).send()
}