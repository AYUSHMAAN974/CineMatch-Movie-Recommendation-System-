import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { movieService } from '../services/movieService';
import { ratingService } from '../services/ratingService';
import MovieGrid from '../components/Movies/MovieGrid';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [recentRatings, setRecentRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch personalized recommendations
      const recommendationsData = await movieService.getPersonalizedRecommendations();
      setRecommendations(recommendationsData.slice(0, 12)); // Show 12 recommendations

      // Fetch user's recent ratings
      const ratingsData = await ratingService.getMyRatings();
      setRecentRatings(ratingsData.slice(0, 6)); // Show 6 recent ratings
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your personalized dashboard..." />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Here are your personalized movie recommendations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-netflix-red mb-2">
                {recentRatings.length}
              </div>
              <div className="text-gray-400">Movies Rated</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {recentRatings.length > 0 
                  ? (recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {recommendations.length}
              </div>
              <div className="text-gray-400">New Recommendations</div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
              <a 
                href="/movies"
                className="text-netflix-red hover:text-red-400 font-medium"
              >
                View All Movies →
              </a>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendations.map((movie) => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg movie-card-hover">
                    <a href={`/movies/${movie.id}`}>
                      <img
                        src={movie.poster_url || 'https://via.placeholder.com/200x300/1f2937/ffffff?text=No+Poster'}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x300/1f2937/ffffff?text=No+Poster';
                        }}
                      />
                      <div className="p-3">
                        <h4 className="text-white font-semibold text-sm truncate" title={movie.title}>
                          {movie.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          ⭐ {movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white mb-2">No recommendations yet</h3>
                <p className="text-gray-400 mb-4">Rate some movies to get personalized recommendations!</p>
                <a 
                  href="/movies"
                  className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Browse Movies
                </a>
              </div>
            )}
          </section>

          {/* Recent Ratings */}
          {recentRatings.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Your Recent Ratings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRatings.map((rating) => (
                  <div key={rating.id} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                    <img
                      src={rating.movie?.poster_url || 'https://via.placeholder.com/60x90/1f2937/ffffff?text=?'}
                      alt={rating.movie?.title || 'Movie'}
                      className="w-12 h-18 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x90/1f2937/ffffff?text=?';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">
                        {rating.movie?.title || 'Unknown Movie'}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">
                          {'⭐'.repeat(Math.floor(rating.rating))}
                        </span>
                        <span className="text-gray-400 text-sm ml-2">
                          {rating.rating}/5
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {rating.created_at ? new Date(rating.created_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;