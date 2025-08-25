/**
 * Format rating to display (e.g., 4.5 → "4.5/5")
 */
export const formatRating = (rating) => {
  if (!rating) return 'Not Rated';
  return `${rating.toFixed(1)}/5`;
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format duration (minutes to hours and minutes)
 */
export const formatDuration = (minutes) => {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function for search
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Generate movie poster URL or fallback
 */
export const getMoviePosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) {
    return 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster';
  }
  
  // If it's already a full URL, return as is
  if (posterPath.startsWith('http')) {
    return posterPath;
  }
  
  // TMDB image URL format (you might need to adjust based on your backend)
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

/**
 * Calculate average rating from ratings array
 */
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / ratings.length).toFixed(1);
};

/**
 * Check if user has rated a movie
 */
export const hasUserRatedMovie = (movieId, userRatings) => {
  if (!userRatings) return false;
  return userRatings.some(rating => rating.movie_id === movieId);
};

/**
 * Get user's rating for a specific movie
 */
export const getUserMovieRating = (movieId, userRatings) => {
  if (!userRatings) return null;
  const rating = userRatings.find(rating => rating.movie_id === movieId);
  return rating ? rating.rating : null;
};

/**
 * Format large numbers (e.g., 1500 → "1.5K")
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Generate random color for user avatars
 */
export const getRandomColor = (seed) => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#F97316'
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Scroll to top smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};