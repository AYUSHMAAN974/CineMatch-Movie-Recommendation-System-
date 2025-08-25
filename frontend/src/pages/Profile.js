import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ratingService } from '../services/ratingService';
import { UserIcon, StarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userRatings, setUserRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    favoriteGenres: []
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const ratings = await ratingService.getMyRatings();
      setUserRatings(ratings);
      
      // Calculate stats
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0;

      setStats({
        totalRatings,
        averageRating,
        favoriteGenres: [] // Would calculate from movie data
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Are you sure you want to remove this rating?')) {
      try {
        await ratingService.deleteRating(ratingId);
        setUserRatings(prev => prev.filter(r => r.id !== ratingId));
        // Recalculate stats
        fetchUserData();
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your profile..." />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-netflix-red rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              
              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-netflix-red">{stats.totalRatings}</div>
                    <div className="text-gray-400 text-sm">Movies Rated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.averageRating}</div>
                    <div className="text-gray-400 text-sm">Average Rating</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Ratings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <StarIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Your Movie Ratings
            </h2>
            
            {userRatings.length > 0 ? (
              <div className="space-y-4">
                {userRatings.map((rating) => (
                  <div key={rating.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={rating.movie?.poster_url || 'https://via.placeholder.com/60x90/1f2937/ffffff?text=?'}
                        alt={rating.movie?.title || 'Movie'}
                        className="w-12 h-18 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x90/1f2937/ffffff?text=?';
                        }}
                      />
                      <div>
                        <h4 className="text-white font-semibold">
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
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {rating.created_at ? new Date(rating.created_at).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/movies/${rating.movie?.id}`}
                        className="text-netflix-red hover:text-red-400 text-sm font-medium"
                      >
                        View Movie
                      </a>
                      <button
                        onClick={() => handleDeleteRating(rating.id)}
                        className="text-gray-400 hover:text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <StarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No ratings yet</h3>
                <p className="text-gray-400 mb-4">Start rating movies to build your profile!</p>
                <a
                  href="/movies"
                  className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Browse Movies
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;