import api from './api';
import toast from 'react-hot-toast';

export const ratingService = {
  // Rate a movie
  async rateMovie(movieId, rating) {
    try {
      const response = await api.post('/ratings/', {
        movie_id: movieId,
        rating: rating
      });
      toast.success('Movie rated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to rate movie';
      toast.error(message);
      throw error;
    }
  },

  // Get user's ratings
  async getMyRatings() {
    try {
      const response = await api.get('/ratings/my-ratings');
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  },

  // Delete a rating
  async deleteRating(ratingId) {
    try {
      await api.delete(`/ratings/${ratingId}`);
      toast.success('Rating removed successfully!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to remove rating';
      toast.error(message);
      throw error;
    }
  }
};