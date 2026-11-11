import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { fetchHelperNoCookies } from "@/lib/helpers/fetchHelperNoCookies"
import { ReviewT } from "@/types"

export const getAllReviews = async () : Promise<ReviewT[]> => {
    const res = await fetchHelperNoCookies<{
        success: boolean,
        reviews: ReviewT[]
    }>("review", {method: "GET"})

    return res.reviews
}

export const deleteReview = async (id:number) : Promise<undefined> => {
    await fetchHelper<undefined>(`reviews/${id}`, {method: "DELETE"})
}

export const createReview = async (data: {name: string, comment:string, title:string, rating:number}) : Promise<ReviewT> => {
    const res = await fetchHelperNoCookies<{
        success: boolean,
        review: ReviewT
    }>('review', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)})

    return res.review
}