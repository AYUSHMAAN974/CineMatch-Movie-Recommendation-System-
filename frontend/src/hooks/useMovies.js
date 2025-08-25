import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export const useMovies = (initialCategory = 'popular') => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(initialCategory);

  const fetchMovies = async (category = currentCategory, page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movieService.getMoviesByCategory(category, page);
      
      if (response && response.items && Array.isArray(response.items)) {
        if (append) {
          setMovies(prev => [...prev, ...response.items]);
        } else {
          setMovies(response.items);
        }
        
        setCurrentPage(response.page || 1);
        setTotalPages(response.total_pages || 1);
        setHasMore(page < (response.total_pages || 1));
      } else {
        console.error('Unexpected response format:', response);
        setMovies([]);
        setError('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to fetch movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchMovies(currentCategory, currentPage + 1, true);
    }
  };

  const changeCategory = (newCategory) => {
    setCurrentCategory(newCategory);
    setCurrentPage(1);
    setMovies([]);
    fetchMovies(newCategory, 1, false);
  };

  const searchMovies = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await movieService.searchMovies(query, 1);
      
      if (Array.isArray(results.items)) {
        setMovies(results.items);
        setCurrentPage(results.page || 1);
        setTotalPages(results.total_pages || 1);
        setHasMore((results.page || 1) < (results.total_pages || 1));
      } else {
        setMovies([]);
        setError('No results found');
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const resetMovies = () => {
    setMovies([]);
    setCurrentPage(1);
    setError(null);
    fetchMovies(currentCategory, 1, false);
  };

  useEffect(() => {
    fetchMovies(currentCategory);
  }, []);

  return {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    hasMore,
    currentCategory,
    loadMore,
    changeCategory,
    searchMovies,
    resetMovies,
    refetch: () => fetchMovies(currentCategory, 1, false)
  };
};