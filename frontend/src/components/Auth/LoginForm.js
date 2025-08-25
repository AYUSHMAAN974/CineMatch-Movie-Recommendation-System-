import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { validateForm, loginValidation } from '../../utils/validation';
import Button from '../Common/Button';

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const { isValid, errors: validationErrors } = validateForm(formData, loginValidation);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(formData);
      if (success) {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-800 shadow-2xl rounded-lg px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to your CineMatch account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:border-transparent
                ${errors.username 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-netflix-red'
                }
              `}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 pr-12 bg-gray-700 border rounded-lg text-white placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:border-transparent
                  ${errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-netflix-red'
                  }
                `}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-netflix-red hover:text-red-400 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;