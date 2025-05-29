import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Film, Music, Headphones, Tv, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">MonSiteAvis</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors">
              Accueil
            </Link>
            <div className="relative group">
              <button className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors flex items-center">
                Catégories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block transform transition-transform duration-150 ease-in-out">
                <Link to="/search?type=films" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Film size={16} className="inline mr-2" /> Films
                </Link>
                <Link to="/search?type=series" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Tv size={16} className="inline mr-2" /> Séries
                </Link>
                <Link to="/search?type=music" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Music size={16} className="inline mr-2" /> Musique
                </Link>
                <Link to="/search?type=podcasts" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Headphones size={16} className="inline mr-2" /> Podcasts
                </Link>
              </div>
            </div>
            <Link to="/profile/me" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors">
              Mon Profil
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative ml-4">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-10"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={toggleMenu} 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-slide-up">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full pr-10"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <div className="space-y-2 ml-2">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Catégories:</p>
                <Link 
                  to="/search?type=films" 
                  className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Film size={16} className="inline mr-2" /> Films
                </Link>
                <Link 
                  to="/search?type=series" 
                  className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tv size={16} className="inline mr-2" /> Séries
                </Link>
                <Link 
                  to="/search?type=music" 
                  className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Music size={16} className="inline mr-2" /> Musique
                </Link>
                <Link 
                  to="/search?type=podcasts" 
                  className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Headphones size={16} className="inline mr-2" /> Podcasts
                </Link>
              </div>
              <Link 
                to="/profile/me" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={16} className="inline mr-2" /> Mon Profil
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;