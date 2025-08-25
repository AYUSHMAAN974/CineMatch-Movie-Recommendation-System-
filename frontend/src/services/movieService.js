import api from './api';

export const movieService = {
  // Get movies by category (NEW - primary method)
  async getMoviesByCategory(category = 'popular', page = 1) {
    try {
      const response = await api.get(`/movies/?category=${category}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      throw error;
    }
  },

  // Get all movies with pagination (UPDATED - now uses popular by default)
  async getMovies(page = 1, limit = 20) {
    try {
      const response = await api.get(`/movies/?category=popular&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Get movie by ID (UPDATED endpoint)
  async getMovieById(id) {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  },

  // Search movies (UPDATED - new search endpoint)
  async searchMovies(query, page = 1) {
    try {
      const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movies by genre (UPDATED - now uses category filtering)
  async getMoviesByGenre(genre, page = 1) {
    try {
      const response = await api.get(`/movies/?category=popular&genre=${encodeURIComponent(genre)}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Get trending movies (UPDATED - new category system)
  async getTrendingMovies(page = 1) {
    try {
      const response = await api.get(`/movies/?category=trending&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get popular movies (UPDATED - new category system)
  async getPopularMovies(page = 1) {
    try {
      const response = await api.get(`/movies/?category=popular&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get now playing movies (NEW)
  async getNowPlayingMovies(page = 1) {
    try {
      const response = await api.get(`/movies/?category=now_playing&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Get upcoming movies (NEW)
  async getUpcomingMovies(page = 1) {
    try {
      const response = await api.get(`/movies/?category=upcoming&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get top rated movies (NEW)
  async getTopRatedMovies(page = 1) {
    try {
      const response = await api.get(`/movies/?category=top_rated&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get all available categories and genres (NEW)
  async getCategories() {
    try {
      const response = await api.get('/movies/categories/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [], genres: [] };
    }
  },

  // Get personalized recommendations (KEPT - if you have recommendation endpoints)
  async getPersonalizedRecommendations() {
    try {
      const response = await api.get('/recommendations/for-me');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Get similar movies (KEPT - if you have recommendation endpoints)
  async getSimilarMovies(movieId) {
    try {
      const response = await api.get(`/recommendations/similar/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  },

  // Helper method to get movies with advanced filtering (NEW)
  async getMoviesWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.category) params.append('category', filters.category);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.page) params.append('page', filters.page);
      
      const response = await api.get(`/movies/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered movies:', error);
      throw error;
    }
  }
};

// Export individual methods for convenience (NEW)
export const {
  getMoviesByCategory,
  getMovies,
  getMovieById,
  searchMovies,
  getMoviesByGenre,
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getCategories,
  getPersonalizedRecommendations,
  getSimilarMovies,
  getMoviesWithFilters
} = movieService;