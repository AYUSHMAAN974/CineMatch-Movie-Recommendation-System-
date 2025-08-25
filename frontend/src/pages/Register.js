import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  const handleRegisterSuccess = () => {
    // Will redirect to login in the component
    console.log('Registration successful');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default Register;