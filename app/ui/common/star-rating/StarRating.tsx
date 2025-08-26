import React from 'react';
import Image from 'next/image';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    showRating?: boolean;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    size = 16,
    showRating = false,
    className = ''
}) => {
    const stars = [];
    const normalizedRating = Math.max(0, Math.min(maxStars, rating || 0));
    
    for (let i = 0; i < maxStars; i++) {
        const isFilled = i < Math.floor(normalizedRating);
        stars.push(
            <Image
                key={i}
                src={isFilled ? '/full-star.svg' : '/empty-star.svg'}
                height={size}
                width={size}
                alt={isFilled ? 'filled star' : 'empty star'}
                style={{ height: size, width: size }}
            />
        );
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className='flex'>
                {stars}
            </div>
            {showRating && (
                <span className='typo-body_mr text-text_four ml-1'>
                    {normalizedRating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;