import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const MovieGrid = ({ 
  movies = [], // ✅ ADD DEFAULT EMPTY ARRAY HERE
  loading, 
  error, 
  onLoadMore, 
  hasMore, 
  onMovieRate 
}) => {
  // Add safety checks
  if (loading && (!movies || movies.length === 0)) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" text="Loading awesome movies..." />
      </div>
    );
  }

  if (error && (!movies || movies.length === 0)) {
    return (
      <div className="py-12">
        <ErrorMessage 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // ✅ SAFE CHECK: Ensure movies is an array
  const safeMovies = Array.isArray(movies) ? movies : [];

  if (safeMovies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {safeMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onRate={onMovieRate}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && safeMovies.length > 0 && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading more...
              </div>
            ) : (
              'Load More Movies'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;