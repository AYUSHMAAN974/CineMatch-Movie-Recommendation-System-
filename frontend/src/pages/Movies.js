import React, { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import MovieGrid from '../components/Movies/MovieGrid';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Movies = () => {
  // State Management
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Movie Categories
  const movieCategories = [
    { 
      id: 'popular', 
      name: 'Popular', 
      icon: '🔥',
      description: 'Most popular movies right now'
    },
    { 
      id: 'trending', 
      name: 'Trending', 
      icon: '📈',
      description: 'Trending movies today'
    },
    { 
      id: 'now_playing', 
      name: 'Now Playing', 
      icon: '🎬',
      description: 'Currently in theaters'
    },
    { 
      id: 'upcoming', 
      name: 'Upcoming', 
      icon: '🚀',
      description: 'Coming soon to theaters'
    },
    { 
      id: 'top_rated', 
      name: 'Top Rated', 
      icon: '⭐',
      description: 'Highest rated movies'
    }
  ];

  // Available Genres
  const availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ];

  // Fetch Movies Function
  const fetchMovies = async (category, page, append, genre) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (searchQuery.trim()) {
        response = await movieService.searchMovies(searchQuery, page || 1);
      } else if (genre) {
        response = await movieService.getMoviesByGenre(genre, page || 1);
      } else {
        response = await movieService.getMoviesByCategory(category || 'popular', page || 1);
      }

      if (response && response.items && Array.isArray(response.items)) {
        if (append) {
          setMovies(prev => [...prev, ...response.items]);
        } else {
          setMovies(response.items);
        }

        setCurrentPage(response.page || 1);
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total || 0);
        setHasMore((response.page || 1) < (response.total_pages || 1));
      } else {
        setMovies([]);
        setError('No movies found');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchMovies(currentCategory, 1, false, selectedGenre);
  }, [currentCategory]);

  // Handle Category Change
  const handleCategoryChange = (category) => {
    if (category === currentCategory) return;
    
    setCurrentCategory(category);
    setCurrentPage(1);
    setMovies([]);
    setSearchQuery('');
    setSelectedGenre('');
  };

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setMovies([]);
    
    if (query.trim()) {
      fetchMovies('search', 1, false, '');
    } else {
      fetchMovies(currentCategory, 1, false, selectedGenre);
    }
  };

  // Handle Genre Filter
  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setMovies([]);
    setSearchQuery('');
    
    fetchMovies(currentCategory, 1, false, genre);
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      fetchMovies(
        searchQuery ? 'search' : currentCategory, 
        nextPage, 
        true, 
        selectedGenre
      );
    }
  };

  // Get Current Category Info
  const getCurrentCategoryInfo = () => {
    const category = movieCategories.find(cat => cat.id === currentCategory);
    return category || movieCategories[0];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎬 Discover Movies
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore thousands of movies from The Movie Database. Find your next favorite film.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-netflix-red text-white border-netflix-red' 
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Filter by Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => handleGenreFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  >
                    <option value="">All Genres</option>
                    {availableGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedGenre('');
                      setSearchQuery('');
                      fetchMovies(currentCategory, 1, false, '');
                    }}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 md:gap-4 overflow-x-auto pb-2">
              {movieCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                    currentCategory === category.id
                      ? 'bg-netflix-red text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            
            {/* Category Description */}
            <div className="mt-4 text-center">
              <p className="text-gray-400">
                {getCurrentCategoryInfo().description}
              </p>
            </div>
          </div>
        )}

        {/* Results Info */}
        {!loading && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-400">
              {searchQuery ? (
                <span>Search results for "{searchQuery}"</span>
              ) : selectedGenre ? (
                <span>{selectedGenre} movies</span>
              ) : (
                <span>{getCurrentCategoryInfo().name} movies</span>
              )}
              {totalResults > 0 && (
                <span className="ml-2">({totalResults.toLocaleString()} found)</span>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Movies Content */}
        {loading && movies.length === 0 ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" text="Loading movies..." />
          </div>
        ) : error ? (
          <div className="py-16">
            <ErrorMessage 
              message={error}
              onRetry={() => fetchMovies(currentCategory, 1, false, selectedGenre)}
            />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-3">No movies found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "Try adjusting your filters"
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('');
                setCurrentCategory('popular');
                fetchMovies('popular', 1, false, '');
              }}
              className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Popular Movies
            </button>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie, index) => (
                <div 
                  key={`${movie.tmdb_id || movie.id}-${index}`} 
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform group"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={movie.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster';
                      }}
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded px-2 py-1">
                      <span className="text-yellow-400 text-xs font-bold">
                        ⭐ {movie.average_rating || movie.vote_average || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="text-white font-semibold text-sm truncate mb-1" title={movie.title}>
                      {movie.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">
                        {movie.genre || 'Unknown'}
                      </span>
                      <span className="text-gray-500">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-netflix-red hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Loading more...
                    </div>
                  ) : (
                    <>
                      Load More Movies
                      <span className="ml-2 text-sm opacity-75">
                        ({movies.length} of {totalResults.toLocaleString()})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && movies.length > 0 && (
              <div className="text-center py-8 border-t border-gray-800">
                <p className="text-gray-400">
                  🎉 You've reached the end! Showing all {movies.length} results
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;