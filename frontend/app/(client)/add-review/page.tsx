
'use client'

import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { createReview } from '@/server/review'
import { aire } from '@/lib/fonts'
import { z } from 'zod'
import { reviewSchema } from '@/lib/schemas/reviewSchema'

type ReviewFormInput = z.input<typeof reviewSchema>
type ReviewFormValues = z.output<typeof reviewSchema>

const CreateReview = () => {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<ReviewFormInput, unknown, ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            name: '',
            title: '',
            comment: '',
            rating: 0
        }
    })

    const selectedRating = watch('rating')

    const mutation = useMutation({
        mutationFn: createReview,

        onSuccess: () => {
            toast.success('Review submitted successfully!')

            reset()

            queryClient.invalidateQueries({
                queryKey: ['reviews']
            })
        },

        onError: (error: Error) => {
            toast.error(error.message || 'Failed to submit review')
        }
    })

    const onSubmit = (data: ReviewFormValues) => {
        mutation.mutate(data)
    }

    return (
        <section className="min-h-screen bg-light-beige px-4 py-16 sm:px-6 mt-14">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-10 space-y-3">
                    <h1 className={`${aire.className} text-3xl sm:text-4xl text-neutral-900`}>
                        Share Your Experience
                    </h1>

                    <p className="text-sm text-neutral-600">
                        Your feedback helps us improve and serve you better.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm"
                >

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-900">
                            Your Name
                        </label>

                        <input
                            {...register('name')}
                            placeholder="Enter your name"
                            className="w-full border border-black/15 rounded-lg px-4 py-3 bg-light-beige outline-none focus:border-neutral-900"
                        />

                        {errors.name && (
                            <p className="text-red-600 text-xs">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-900">
                            Review Title
                        </label>

                        <input
                            {...register('title')}
                            placeholder="Summarize your experience"
                            className="w-full border border-black/15 rounded-lg px-4 py-3 bg-light-beige outline-none focus:border-neutral-900"
                        />

                        {errors.title && (
                            <p className="text-red-600 text-xs">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-900">
                            Your Rating
                        </label>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, index) => {
                                const rating = index + 1

                                return (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setValue('rating', rating, {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        })}
                                        aria-label={`Rate ${rating} out of 5`}
                                        aria-pressed={selectedRating === rating}
                                    >
                                        <Star
                                            className={`w-8 h-8 cursor-pointer transition-colors ${
                                                rating <= selectedRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-neutral-400'
                                            }`}
                                        />
                                    </button>
                                )
                            })}
                        </div>

                        {errors.rating && (
                            <p className="text-red-600 text-xs">
                                {errors.rating.message}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-900">
                            Your Review
                        </label>

                        <textarea
                            {...register('comment')}
                            rows={5}
                            placeholder="Tell us about your experience..."
                            className="w-full border border-black/15 rounded-lg px-4 py-3 bg-light-beige outline-none focus:border-neutral-900 resize-none"
                        />

                        {errors.comment && (
                            <p className="text-red-600 text-xs">
                                {errors.comment.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-neutral-900 text-light-beige py-3 rounded-lg uppercase tracking-widest text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </button>

                </form>
            </div>
        </section>
    )
}

export default CreateReview
