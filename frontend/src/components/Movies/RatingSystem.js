import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const RatingSystem = ({ 
  currentRating = 0, 
  onRate, 
  size = 'medium',
  interactive = true,
  showValue = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const handleRate = async (rating) => {
    if (!interactive || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRate(rating);
    } catch (error) {
      console.error('Rating failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStar = (starNumber) => {
    const rating = hoverRating || currentRating;
    const isFilled = starNumber <= rating;
    const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

    return (
      <button
        key={starNumber}
        onClick={() => handleRate(starNumber)}
        onMouseEnter={() => interactive && setHoverRating(starNumber)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        disabled={!interactive || isSubmitting}
        className={`
          ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
          transition-transform duration-150
          ${isSubmitting ? 'opacity-50' : ''}
          disabled:cursor-not-allowed
        `}
      >
        <div className="relative">
          {isFilled ? (
            <StarIcon className={`${sizes[size]} text-yellow-400`} />
          ) : (
            <StarOutlineIcon className={`${sizes[size]} text-gray-400`} />
          )}
          
          {/* Half star effect */}
          {isHalfFilled && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className={`${sizes[size]} text-yellow-400`} />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm text-gray-400">
          {currentRating > 0 ? `${currentRating.toFixed(1)}/5` : 'Not rated'}
        </span>
      )}
      
      {isSubmitting && (
        <div className="ml-2">
          <div className="w-4 h-4 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;