import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Create and export the context
export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOADING_COMPLETE':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const user = authService.getCurrentUser();
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user }
      });
    } else {
      dispatch({ type: 'LOADING_COMPLETE' });
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { user } = await authService.login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user }
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};