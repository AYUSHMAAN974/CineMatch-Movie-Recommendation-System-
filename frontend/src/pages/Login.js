import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  const handleLoginSuccess = () => {
    // Redirect to dashboard or previous page
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;