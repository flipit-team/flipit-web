'use client';
import React from 'react';
import {ChevronLeft, User} from 'lucide-react';
import Image from 'next/image';
import GoBack from '~/ui/common/go-back';

// Types
interface Review {
    id: string;
    name: string;
    review: string;
    rating: number;
    avatar?: string;
}


// Star Rating Component
const StarRating: React.FC<{rating: number; size?: 'sm' | 'md' | 'lg'}> = ({rating, size = 'md'}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${sizeClasses[size]} ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                    viewBox='0 0 20 20'
                >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
            ))}
        </div>
    );
};

// Review Card Component
const ReviewCard: React.FC<{review: Review}> = ({review}) => {
    return (
        <div className='bg-white h-[85px] rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-start gap-4'>
                {/* Profile Icon */}
                <div className='flex-shrink-0'>
                    {review.avatar ? (
                        <Image
                            src={review.avatar}
                            alt={`${review.name}'s avatar`}
                            width={24}
                            height={24}
                            className='w-6 h-6 rounded-full object-cover'
                        />
                    ) : (
                        <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center'>
                            <User className='w-6 h-6 text-gray-500' />
                        </div>
                    )}
                </div>

                {/* Review Content */}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm font-medium text-gray-900 truncate'>{review.name}</h3>
                        <StarRating rating={review.rating} size='sm' />
                    </div>
                    <p className='text-gray-700 text-sm leading-relaxed'>{review.review}</p>
                </div>
            </div>
        </div>
    );
};

// Main Feedback Page Component
const FeedbackPage: React.FC = () => {
    // Default reviews data (matching your image)
    const defaultReviews: Review[] = [
        {id: '1', name: 'Collins', review: 'Good Product', rating: 5},
        {id: '2', name: 'Collins', review: 'Good Product', rating: 5},
        {id: '3', name: 'Collins', review: 'Good Product', rating: 5},
        {id: '4', name: 'Collins', review: 'Good Product', rating: 5}
    ];

    const displayReviews = defaultReviews;

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='grid-sizes'>
                {/* Go Back Button */}
                <GoBack />

                {/* Feedback Header */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
                    <div className='w-[672px] px-6 py-4'>
                        <div className='flex items-center justify-between'>
                            <h1 className='typo-heading_ms'>Feedback</h1>
                            <button
                                onClick={() => console.log('Give feedback clicked')}
                                className='bg-[#005F7329] border border-primary hover:bg-primary text-primary px-4 py-2 rounded-lg typo-body_mr transition-colors duration-200 '
                            >
                                Give Feedback
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className='w-[672px] p-6'>
                        <div className='space-y-4'>
                            {displayReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {displayReviews.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <User className='w-8 h-8 text-gray-400' />
                                </div>
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>No feedback yet</h3>
                                <p className='text-gray-500 mb-4'>Be the first to share your thoughts!</p>
                                <button
                                    onClick={() => console.log('Give feedback clicked')}
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200'
                                >
                                    Give Feedback
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
