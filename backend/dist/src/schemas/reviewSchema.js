import z from "zod";
export const reviewSchema = z.object({
    name: z.string().min(2, "Please Enter valid name"),
    title: z.string().min(2, "Please Enter valid title").max(30, "Please Enter short title maximum 30 characters"),
    comment: z.string().min(10, "Please Enter atleast 10 characters comment").max(130, "Maximum length of comment in 130"),
    rating: z.coerce.number().int("Rating must be a whole number").min(1, "Please Enter rating atleast 1").max(5, "Maximum value of rating is 5 more then 5 is not valid")
});
