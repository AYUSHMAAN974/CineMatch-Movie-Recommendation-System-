import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, show fallback or redirect to login
  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Access Restricted</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to access this page.</p>
          <div className="space-x-4">
            <a 
              href="/login"
              className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Login
            </a>
            <a 
              href="/register"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return children;
};

export default ProtectedRoute;