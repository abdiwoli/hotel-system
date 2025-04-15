import { use, useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { Review } from '@/app/models/review';
import { createReview, getReviews } from '@/libs/apis';
import { useSession } from 'next-auth/react';

interface RoomReviewsProps {
    slug: string;
    hotelRoomId: string;
}

export default function RoomReviews({ slug, hotelRoomId }: RoomReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: '',
        submitting: false,
        error: null as string | null,
        success: false,
    });
    const { data: session } = useSession();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const data = await getReviews(hotelRoomId);
                setReviews(data || []);
            } catch (err) {
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                <div className="flex">
                    <div className="text-red-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    function calculateAverageRating(reviews: Review[]): number {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                    {reviews.length > 0 && (
                        <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.round(calculateAverageRating(reviews))
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                {calculateAverageRating(reviews).toFixed(1)} out of 5 · {reviews.length} reviews
                            </span>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No reviews yet. Be the first to review this room!
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                            {review.user?.name?.charAt(0).toUpperCase() || 'G'}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon
                                                        key={star}
                                                        className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                        </div>
                                        <div className="mt-1">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {review.user?.name || 'Guest'}
                                            </h4>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p>{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}