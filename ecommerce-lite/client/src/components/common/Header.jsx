import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, updateTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
            Charlotte Tilbury
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => `hover:text-primary-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/makeup" 
              className={({ isActive }) => `hover:text-primary-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
            >
              Makeup
            </NavLink>
            <NavLink 
              to="/skincare" 
              className={({ isActive }) => `hover:text-primary-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
            >
              Skincare
            </NavLink>
            <NavLink 
              to="/fragrance" 
              className={({ isActive }) => `hover:text-primary-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
            >
              Fragrance
            </NavLink>
            <NavLink 
              to="/gifts" 
              className={({ isActive }) => `hover:text-primary-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
            >
              Gifts
            </NavLink>
          </nav>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="border border-gray-300 rounded-full py-1 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500"
              >
                <FaSearch />
              </button>
            </form>

            <div className="flex items-center space-x-4">
              <Link 
                to="/cart" 
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cart"
              >
                <FaShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <FaUser size={18} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Login"
                >
                  <FaUser size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500"
              >
                <FaSearch />
              </button>
            </form>

            <nav className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => `py-2 px-4 rounded-lg hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/makeup" 
                className={({ isActive }) => `py-2 px-4 rounded-lg hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
                onClick={() => setIsMenuOpen(false)}
              >
                Makeup
              </NavLink>
              <NavLink 
                to="/skincare" 
                className={({ isActive }) => `py-2 px-4 rounded-lg hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
                onClick={() => setIsMenuOpen(false)}
              >
                Skincare
              </NavLink>
              <NavLink 
                to="/fragrance" 
                className={({ isActive }) => `py-2 px-4 rounded-lg hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
                onClick={() => setIsMenuOpen(false)}
              >
                Fragrance
              </NavLink>
              <NavLink 
                to="/gifts" 
                className={({ isActive }) => `py-2 px-4 rounded-lg hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => ({ color: isActive ? theme.primaryColor : 'inherit' })}
                onClick={() => setIsMenuOpen(false)}
              >
                Gifts
              </NavLink>
            </nav>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Cart"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart size={18} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <FaUser size={18} />
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser size={18} />
                  </Link>
                )}
              </div>

              {user && (
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm text-gray-700 hover:text-primary-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
