// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'CineMatch',
  VERSION: '1.0.0',
  DESCRIPTION: 'Advanced Movie Recommendation Platform',
};

// Movie Genres
export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western'
];

// Rating Configuration
export const RATING_CONFIG = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5,
  LABELS: {
    1: 'Terrible',
    2: 'Bad',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  PREFERENCES: 'user_preferences',
  THEME: 'theme',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIES: '/movies',
  MOVIE_DETAIL: '/movies/:id',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

// Movie Poster Placeholders
export const PLACEHOLDER_IMAGES = {
  MOVIE_POSTER: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster',
  USER_AVATAR: 'https://via.placeholder.com/100x100/1f2937/ffffff?text=User',
};

// Theme Colors (matching Tailwind config)
export const COLORS = {
  NETFLIX_RED: '#E50914',
  NETFLIX_BLACK: '#141414',
  NETFLIX_GRAY: '#2F2F2F',
};