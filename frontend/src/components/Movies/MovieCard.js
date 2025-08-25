import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ratingService } from '../../services/ratingService';
import { useAuth } from '../../hooks/useAuth';
import { getMoviePosterUrl, formatRating } from '../../utils/helpers';

const MovieCard = ({ movie, onRate }) => {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(movie.user_rating || 0);
  const [isRating, setIsRating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleRateMovie = async (rating) => {
    if (!isAuthenticated) {
      alert('Please login to rate movies');
      return;
    }

    setIsRating(true);
    try {
      await ratingService.rateMovie(movie.id, rating);
      setUserRating(rating);
      setShowRatingModal(false);
      if (onRate) onRate(movie.id, rating);
    } catch (error) {
      console.error('Rating failed:', error);
    } finally {
      setIsRating(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [1, 2, 3, 4, 5].map(star => {
      const isFilled = star <= rating;
      return (
        <button
          key={star}
          onClick={() => interactive && handleRateMovie(star)}
          className={`${interactive ? 'hover:scale-110' : ''} transition-transform`}
          disabled={!interactive || isRating}
        >
          {isFilled ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      );
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg movie-card-hover group">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3]">
        <img
          src={getMoviePosterUrl(movie.poster_url)}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster';
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded px-2 py-1">
          <span className="text-yellow-400 text-sm font-bold">
            ⭐ {formatRating(movie.average_rating)}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-center">
            <button 
              onClick={() => setShowRatingModal(true)}
              className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded mb-2 transition-colors"
            >
              Rate Movie
            </button>
            <a 
              href={`/movies/${movie.id}`}
              className="block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 truncate" title={movie.title}>
          {movie.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-2">{movie.genre}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
          </span>
          
          {/* User's Rating */}
          {userRating > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-400 mr-1">Your rating:</span>
              <div className="flex">
                {renderStars(userRating)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Rate "{movie.title}"</h3>
            
            <div className="flex justify-center space-x-2 mb-4">
              {renderStars(0, true)}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;