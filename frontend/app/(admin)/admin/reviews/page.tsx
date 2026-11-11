
'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star, Trash2, MessageSquare, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { getAllReviews, deleteReview } from '@/server/review'

const AdminReviews = () => {
    const queryClient = useQueryClient()

    const {
        data: reviews,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['reviews'],
        queryFn: getAllReviews
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteReview(id),

        onSuccess: async () => {
            toast.success('Review deleted successfully')

            queryClient.invalidateQueries({ queryKey: ['reviews'] })
        },

        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete review')
        }
    })

    const handleDelete = (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this review? This action cannot be undone.'
        )

        if (!confirmed) return

        deleteMutation.mutate(id)
    }

    return (
        <section className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <div className="space-y-1">
                    <h1 className={` text-3xl text-neutral-900`}>
                        Reviews Management
                    </h1>

                    <p className="text-sm text-neutral-500">
                        Manage and moderate customer reviews.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                <div className=" border border-black/10 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">
                                Total Reviews
                            </p>

                            <h2 className={` text-3xl mt-2 text-neutral-900`}>
                                {reviews?.length ?? 0}
                            </h2>
                        </div>

                        <div className="bg-neutral-900/5 p-3 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-neutral-800" />
                        </div>
                    </div>
                </div>

                <div className=" border border-black/10 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">
                                Average Rating
                            </p>

                            <h2 className={` text-3xl mt-2 text-neutral-900`}>
                                {reviews?.length
                                    ? (
                                        reviews.reduce(
                                            (sum, review) => sum + review.rating,
                                            0
                                        ) / reviews.length
                                    ).toFixed(1)
                                    : '0.0'}
                                <span className="text-base text-neutral-500"> / 5.0</span>
                            </h2>
                        </div>

                        <div className="bg-amber-500/10 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Reviews Table */}
            <div className=" border border-black/10 rounded-xl overflow-hidden">

                <div className="p-5 border-b border-black/10">
                    <h2 className={` text-xl text-neutral-900`}>
                        Customer Reviews
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-neutral-500">
                        Loading reviews...
                    </div>
                ) : isError ? (
                    <div className="p-10 text-center space-y-3">
                        <p className="text-red-600">
                            {error instanceof Error
                                ? error.message
                                : 'Failed to load reviews'}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="text-sm underline text-neutral-900"
                        >
                            Try again
                        </button>
                    </div>
                ) : !reviews || reviews.length === 0 ? (
                    <div className="p-10 text-center text-neutral-500">
                        No reviews have been submitted yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            <thead className="bg-neutral-900/5 text-xs uppercase tracking-wider text-neutral-600">
                                <tr>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Review</th>
                                    <th className="px-5 py-4">Rating</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {reviews.map((review) => (
                                    <tr
                                        key={review.id}
                                        className="hover:bg-black/[0.02] transition-colors"
                                    >
                                        {/* Customer */}
                                        <td className="px-5 py-5 min-w-[150px]">
                                            <p className="font-semibold text-sm text-neutral-900">
                                                {review.name}
                                            </p>
                                        </td>

                                        {/* Review */}
                                        <td className="px-5 py-5 min-w-[250px] max-w-sm">
                                            <p className="font-semibold text-sm text-neutral-900 mb-1">
                                                {review.title}
                                            </p>

                                            <p className="text-xs text-neutral-500 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </td>

                                        {/* Rating */}
                                        <td className="px-5 py-5 min-w-[120px]">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />

                                                <span className="text-sm font-semibold text-neutral-900">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </td>


                                        {/* Delete */}
                                        <td className="px-5 py-5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(review.id)}
                                                disabled={deleteMutation.isPending}
                                                aria-label={`Delete review by ${review.name}`}
                                                className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                {deleteMutation.isPending &&
                                                deleteMutation.variables === review.id ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </section>
    )
}

export default AdminReviews
