'use client';
import React, {useState} from 'react';
import {TransactionDTO} from '~/types/transaction';
import {useAppContext} from '~/contexts/AppContext';
import ReviewsService from '~/services/reviews.service';
import Image from 'next/image';

interface Props {
    transaction: TransactionDTO;
    onClose: () => void;
    onReviewSubmitted: () => void;
}

const ReviewModal = ({transaction, onClose, onReviewSubmitted}: Props) => {
    const {user} = useAppContext();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userRole = transaction.seller.id === parseInt(user?.userId || '0') ? 'seller' : 'buyer';
    const otherParty = userRole === 'seller' ? transaction.buyer : transaction.seller;
    const hasReviewed = userRole === 'seller' ? transaction.sellerReviewId : transaction.buyerReviewId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (comment.trim().length < 10) {
            alert('Please write a review with at least 10 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await ReviewsService.createReview({
                rating,
                message: comment,
                userId: otherParty.id
            });

            if (response.data) {
                alert('Thank you for your review!');
                onReviewSubmitted();
                onClose();
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasReviewed) {
        return (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-lg max-w-md w-full p-6'>
                    <div className='text-center py-8'>
                        <div className='w-16 h-16 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                        <h3 className='typo-body_lm text-text_one mb-2'>Review Already Submitted</h3>
                        <p className='typo-body_mr text-text_four mb-6'>
                            You have already left a review for this transaction.
                        </p>
                        <button
                            onClick={onClose}
                            className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='sticky top-0 bg-white border-b border-border_gray p-6 flex items-center justify-between'>
                    <h2 className='typo-heading_ss text-text_one'>Leave a Review</h2>
                    <button
                        onClick={onClose}
                        className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'
                    >
                        <svg className='w-5 h-5 text-text_four' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className='p-6'>
                    {/* Other Party Info */}
                    <div className='flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg'>
                        <Image
                            src={otherParty.profileImageUrl || '/placeholder-avatar.svg'}
                            alt={otherParty.firstName}
                            width={48}
                            height={48}
                            className='rounded-full object-cover'
                        />
                        <div>
                            <p className='typo-body_lm text-text_one'>
                                {otherParty.firstName} {otherParty.lastName}
                            </p>
                            <p className='typo-body_sr text-text_four'>
                                {userRole === 'seller' ? 'Buyer' : 'Seller'}
                            </p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className='mb-6'>
                        <label className='typo-body_lr text-text_one mb-3 block'>Rate Your Experience</label>
                        <div className='flex gap-2 justify-center'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type='button'
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className='focus:outline-none transition-transform hover:scale-110'
                                >
                                    <svg
                                        className={`w-12 h-12 ${
                                            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <p className='text-center typo-body_sr text-text_four mt-2'>
                            {rating === 0 && 'Select a rating'}
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className='mb-6'>
                        <label className='typo-body_lr text-text_one mb-2 block'>Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Share your experience with this transaction...'
                            rows={5}
                            required
                            minLength={10}
                            className='w-full border border-border_gray rounded-lg px-4 py-3 typo-body_mr focus:outline-none focus:border-primary resize-none'
                        />
                        <p className='typo-body_sr text-text_four mt-1'>{comment.length} / 500 characters</p>
                    </div>

                    {/* Quick Review Options */}
                    <div className='mb-6'>
                        <p className='typo-body_sr text-text_four mb-2'>Quick suggestions:</p>
                        <div className='flex flex-wrap gap-2'>
                            {[
                                'Great communication',
                                'Fast shipping',
                                'Item as described',
                                'Smooth transaction',
                                'Would trade again'
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type='button'
                                    onClick={() =>
                                        setComment((prev) => {
                                            const newComment = prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion;
                                            return newComment.slice(0, 500);
                                        })
                                    }
                                    className='px-3 py-1 border border-border_gray rounded-full typo-body_sr text-text_four hover:border-primary hover:text-primary transition-colors'
                                >
                                    + {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className='bg-accent-navy/5 border border-accent-navy/20 rounded-lg p-4 mb-6'>
                        <div className='flex items-start gap-2'>
                            <svg className='w-5 h-5 text-accent-navy mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            <p className='typo-body_sr text-blue-700'>
                                Your review will be visible on the user&apos;s profile and helps build trust in the community.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={isSubmitting}
                            className='flex-1 h-[48px] border border-border_gray text-text_four rounded-lg typo-body_lr hover:bg-gray-50 disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                            className='flex-1 h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
