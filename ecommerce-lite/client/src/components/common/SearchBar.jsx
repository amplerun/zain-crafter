import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative">
      {isSearchOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products, shades, colors..."
                className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500"
              >
                <FaSearch size={18} />
              </button>
            </form>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors"
        >
          <FaSearch className="text-gray-500" />
          <span className="text-gray-600">Search product, shade, colour</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
