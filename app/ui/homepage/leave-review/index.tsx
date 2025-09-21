'use client';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import Image from 'next/image';
import StarRating from '../../common/star-rating/StarRating';
// import {ReviewService} from '~/services/review.service';
// import {ReviewRequest} from '~/utils/interface';

interface LeaveReviewModalProps {
    title: string;
    onClose: () => void;
    onSubmit?: (rating: number, comment: string) => void;
    itemId?: number;
    sellerId?: number;
    transactionType?: 'PURCHASE' | 'AUCTION_WIN';
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
    title,
    onClose,
    onSubmit,
    itemId,
    sellerId,
    transactionType = 'PURCHASE'
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            if (onSubmit) {
                // Use custom submit handler if provided
                onSubmit(rating, comment);
            } else {
                // Use new API service
                // const reviewData: ReviewRequest = {
                //     rating,
                //     comment,
                //     transactionType,
                //     ...(itemId && { itemId }),
                //     ...(sellerId && { sellerId })
                // };

                // const result = await ReviewService.createReview(reviewData);

                // if (result.success) {
                    alert('Review submitted successfully!');
                    onClose();
                // } else {
                //     alert('Failed to submit review. Please try again.');
                // }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (query === 'leave-review')
        return (
            <form className='w-full max-w-[527px] bg-white p-8 rounded-lg' onSubmit={handleSubmit}>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='typo-heading_sb'>{title}</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='text-2xl text-gray-500 hover:text-gray-700'
                        aria-label='Close'
                    >
                        &times;
                    </button>
                </div>

                <div className='mb-6'>
                    <label className='block mb-3 typo-body_sr'>
                        Rate your experience
                    </label>
                    <div className='flex items-center gap-2'>
                        <StarRating
                            rating={rating}
                            size={32}
                            interactive={true}
                            onRatingChange={setRating}
                        />
                        <span className='typo-body_sr text-text_four ml-2'>
                            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                        </span>
                    </div>
                </div>

                <div className='mb-8'>
                    <label className='block mb-2 typo-body_sr' htmlFor='comment'>
                        Tell us about your experience (Optional)
                    </label>
                    <textarea
                        id='comment'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Share your thoughts about the seller and transaction...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                    />
                    <div className='text-right mt-1'>
                        <span className='typo-body_sr text-text_four'>{comment.length}/500</span>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting || rating === 0}
                    className='w-full bg-primary text-white py-3 rounded typo-heading-md-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        );
};

export default LeaveReviewModal;