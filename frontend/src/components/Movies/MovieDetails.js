import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { movieService } from '../../services/movieService';
import { getMoviePosterUrl, formatDuration, formatDate } from '../../utils/helpers';
import RatingSystem from './RatingSystem';
import { ratingService } from '../../services/ratingService';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const MovieDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetchMovieDetails();
    fetchSimilarMovies();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const movieData = await movieService.getMovieById(id);
      setMovie(movieData);
      setUserRating(movieData.user_rating || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const similar = await movieService.getSimilarMovies(id);
      setSimilarMovies(similar.slice(0, 6)); // Show only 6 similar movies
    } catch (err) {
      console.error('Failed to fetch similar movies:', err);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      alert('Please login to rate this movie');
      return;
    }

    try {
      await ratingService.rateMovie(parseInt(id), rating);
      setUserRating(rating);
      // Refresh movie data to get updated average rating
      fetchMovieDetails();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading movie details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchMovieDetails} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
          <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        {movie.backdrop_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(17,24,39,0.9)), url(${movie.backdrop_url})` 
            }}
          />
        )}
        
        <div className="relative container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
            {/* Movie Poster */}
            <div className="lg:w-1/3">
              <img
                src={getMoviePosterUrl(movie.poster_url)}
                alt={movie.title}
                className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/1f2937/ffffff?text=No+Poster';
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                  {movie.release_date && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-1" />
                      {formatDate(movie.release_date)}
                    </div>
                  )}
                  
                  {movie.duration && (
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 mr-1" />
                      {formatDuration(movie.duration)}
                    </div>
                  )}
                  
                  {movie.genre && (
                    <div className="flex items-center">
                      <TagIcon className="w-5 h-5 mr-1" />
                      {movie.genre}
                    </div>
                  )}
                </div>

                {/* Average Rating */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
                    ⭐ {movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}
                  </div>
                  <span className="text-gray-400">
                    {movie.rating_count ? `${movie.rating_count} ratings` : 'No ratings yet'}
                  </span>
                </div>
              </div>

              {/* User Rating */}
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Rate this movie</h3>
                <RatingSystem
                  currentRating={userRating}
                  onRate={handleRate}
                  size="large"
                  interactive={isAuthenticated}
                />
                {!isAuthenticated && (
                  <p className="text-gray-400 text-sm mt-2">
                    <a href="/login" className="text-netflix-red hover:underline">Login</a> to rate this movie
                  </p>
                )}
              </div>

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.director && (
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <span className="text-white ml-2">{movie.director}</span>
                  </div>
                )}
                
                {movie.cast && (
                  <div>
                    <span className="text-gray-400">Cast:</span>
                    <span className="text-white ml-2">{movie.cast}</span>
                  </div>
                )}
                
                {movie.language && (
                  <div>
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white ml-2">{movie.language}</span>
                  </div>
                )}
                
                {movie.country && (
                  <div>
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white ml-2">{movie.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarMovies.map((similarMovie) => (
              <a
                key={similarMovie.id}
                href={`/movies/${similarMovie.id}`}
                className="block group"
              >
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={getMoviePosterUrl(similarMovie.poster_url)}
                    alt={similarMovie.title}
                    className="w-full aspect-[2/3] object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300/1f2937/ffffff?text=No+Poster';
                    }}
                  />
                  <div className="p-3">
                    <h4 className="text-white font-semibold text-sm truncate" title={similarMovie.title}>
                      {similarMovie.title}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      ⭐ {similarMovie.average_rating ? similarMovie.average_rating.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;