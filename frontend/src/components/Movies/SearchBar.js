import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MOVIE_GENRES } from '../../utils/constants';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ onSearch, onGenreFilter, onSort, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedSearch = debounce((searchQuery) => {
    onSearch(searchQuery);
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    onGenreFilter(genre);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onSort(sort);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedGenre('');
    setSortBy('popularity');
    onSearch('');
    onGenreFilter('');
    onSort('popularity');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-netflix-red hover:text-red-400 font-medium transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {(selectedGenre || sortBy !== 'popularity') && (
          <button
            onClick={clearSearch}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
            >
              <option value="">All Genres</option>
              {MOVIE_GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="release_date">Release Date</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;