
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StarRating = ({
  initialRating = 0,
  totalStars = 5,
  onRatingChange,
  readOnly = false,
  size = 'medium'
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const starSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };
  
  const containerSizes = {
    small: 'gap-1',
    medium: 'gap-1.5',
    large: 'gap-2'
  };
  
  const handleSetRating = (value: number) => {
    if (readOnly) return;
    
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };
  
  return (
    <div 
      className={cn("flex items-center", containerSizes[size])}
      onMouseLeave={() => !readOnly && setHoverRating(0)}
    >
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        
        return (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              "transition-colors cursor-pointer",
              (hoverRating >= starValue || (!hoverRating && rating >= starValue))
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-500",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
            onClick={() => handleSetRating(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
