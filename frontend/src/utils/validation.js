/**
 * Validation utilities for forms
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Username validation
export const isValidUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Rating validation
export const isValidRating = (rating) => {
  const num = parseFloat(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
};

// Form validation schemas
export const loginValidation = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (!isValidUsername(value)) return 'Username must be 3-20 characters, alphanumeric only';
    return null;
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (!isValidPassword(value)) return 'Password must be at least 6 characters';
    return null;
  }
};

export const registerValidation = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (!isValidUsername(value)) return 'Username must be 3-20 characters, alphanumeric only';
    return null;
  },
  email: (value) => {
    if (!value) return 'Email is required';
    if (!isValidEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (!isValidPassword(value)) return 'Password must be at least 6 characters';
    return null;
  },
  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  }
};

/**
 * Validate entire form object
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationSchema).forEach(field => {
    const validator = validationSchema[field];
    const error = validator(formData[field], formData.password);
    
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};