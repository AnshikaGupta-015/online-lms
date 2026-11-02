import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0 to 5
  maxRating?: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  showCount = false,
  count,
  size = 'md',
  interactive = false,
  onRatingChange
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= Math.round(rating);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starIndex)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              aria-label={`${starIndex} star`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
        {rating > 0 ? rating.toFixed(1) : 'New'}
      </span>

      {showCount && count !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
