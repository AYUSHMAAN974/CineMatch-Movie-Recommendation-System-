import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard' }] : [])
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎬</span>
              <span className="text-xl font-bold text-netflix-red">CineMatch</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-netflix-red transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-netflix-red transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">{user?.username}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </a>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                    <hr className="my-2 border-gray-700" />
                    <button
                                            onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="text-white hover:text-netflix-red transition-colors font-medium"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-netflix-red transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-white hover:text-netflix-red hover:bg-gray-800 transition-colors font-medium rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {isAuthenticated ? (
                <>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-white hover:text-netflix-red hover:bg-gray-800 transition-colors font-medium rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:text-netflix-red hover:bg-gray-800 transition-colors font-medium rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-white hover:text-netflix-red hover:bg-gray-800 transition-colors font-medium rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="block px-4 py-2 bg-netflix-red text-white hover:bg-red-700 transition-colors font-medium rounded text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;