import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-4">{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-netflix-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;