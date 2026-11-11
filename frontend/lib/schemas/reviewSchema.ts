
import z from "zod";

export const reviewSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Please enter a valid name")
        .max(50, "Name cannot exceed 50 characters"),

    title: z.string()
        .trim()
        .min(2, "Please enter a review title")
        .max(30, "Title cannot exceed 30 characters"),

    comment: z.string()
        .trim()
        .min(10, "Please enter at least 10 characters")
        .max(130, "Comment cannot exceed 130 characters"),

    rating: z.number()
        .int("Rating must be a whole number")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5")
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
