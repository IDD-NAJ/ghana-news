
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Calendar, Clock, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchDialog from './SearchDialog';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer);
  }, []);

  // Format date as "Monday, July 7, 2025"
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format time as "10:30 AM"
  const formattedTime = currentDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Politics', path: '/politics' },
    { name: 'Sports', path: '/sports' },
    { name: 'Entertainment', path: '/entertainment' },
    { name: 'Business', path: '/business' },
    { name: 'Opinion', path: '/opinion' },
    { name: 'Lifestyle', path: '/lifestyle' },
    { name: 'Technology', path: '/technology' }
  ];

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-ghana-red text-white text-sm py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Breaking News: </span>
              <span className="animate-pulse">Parliament approves 2024 budget</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="flex items-center bg-white/10 rounded px-3 py-1 text-white font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                {formattedDate}
              </span>
              <span className="flex items-center bg-white/10 rounded px-3 py-1 text-white font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                {formattedTime}
              </span>
              <span className="flex items-center bg-white/10 rounded px-3 py-1 text-white font-semibold">
                <span className="mr-2">BREAKING</span>
              </span>
              <span className="ml-2">Parliament approves 2024 budget</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-3xl font-playfair font-bold text-ghana-black">
                  <span className="text-ghana-red">+233</span>
                  <span className="text-ghana-gold">BLOG</span>
                  <span className="text-ghana-green">-NEWS</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-ghana-red transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search, Auth and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleSearchClick}
                title="Search articles (Ctrl+K)"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Authentication Section */}
              {user && profile ? (
                <div className="hidden md:flex items-center space-x-2">
                  {profile.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  {profile.role === 'chief_author' && (
                    <Link to="/chief-author">
                      <Button variant="outline" size="sm">Chief Author</Button>
                    </Link>
                  )}
                  {profile.role === 'news_anchor' && profile.verified && (
                    <Link to="/news-anchor">
                      <Button variant="outline" size="sm">News Anchor</Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-ghana-red transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Section */}
                <div className="border-t pt-4 mt-4">
                  {user && profile ? (
                    <div className="space-y-2">
                      {profile.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">Admin</Button>
                        </Link>
                      )}
                      {profile.role === 'chief_author' && (
                        <Link to="/chief-author" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">Chief Author</Button>
                        </Link>
                      )}
                      {profile.role === 'news_anchor' && profile.verified && (
                        <Link to="/news-anchor" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">News Anchor</Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
    </>
  );
};

export default Header;
