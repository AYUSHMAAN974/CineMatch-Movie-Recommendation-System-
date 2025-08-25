import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * This provides all authentication-related state and functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Alternative hook that just checks if user is authenticated
 * Useful for components that only need to know login status
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook that returns current user data
 * Returns null if not authenticated
 */
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? user : null;
};

/**
 * Hook for login functionality
 * Returns login function and loading state
 */
export const useLogin = () => {
  const { login } = useAuth();
  
  return {
    login,
    loginUser: login // alias for consistency
  };
};

/**
 * Hook for logout functionality
 * Returns logout function
 */
export const useLogout = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    // Optionally redirect to home page
    window.location.href = '/';
  };
  
  return {
    logout,
    handleLogout
  };
};

/**
 * Hook to check if user has specific permissions
 * Can be extended based on user roles
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = (permission) => {
    if (!isAuthenticated || !user) return false;
    
    // Add your permission logic here
    // For now, all authenticated users have all permissions
    return true;
  };
  
  const canRate = () => hasPermission('rate');
  const canComment = () => hasPermission('comment');
  const canViewRecommendations = () => hasPermission('recommendations');
  
  return {
    hasPermission,
    canRate,
    canComment,
    canViewRecommendations
  };
};

// Default export is the main useAuth hook
export default useAuth;