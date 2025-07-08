
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Calendar, Clock, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchDialog from './SearchDialog';
import { useAuth } from '../contexts/AuthContext';
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
      <header className="bg-white border-b-2 border-muted sticky top-0 z-50">
        {/* Top Info Bar */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-1.5 md:py-2">
            <div className="flex justify-between items-center text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center space-x-3 md:space-x-6">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{formattedDate}</span>
                  <span className="sm:hidden">{currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {formattedTime}
                </span>
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-medium uppercase tracking-wider">Professional News & Analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-3 md:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="text-center">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                    <span className="text-foreground">THE</span>
                  </h1>
                  <div className="flex items-center justify-center">
                    <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-primary mr-1">+233</span>
                    <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-foreground">HERALD</span>
                  </div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5 md:mt-1">
                    Trusted News Since 2024
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-4 xl:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-xs xl:text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-primary pb-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                className="p-1.5 md:p-2 hover:bg-muted rounded-full transition-colors"
                onClick={handleSearchClick}
                title="Search articles (Ctrl+K)"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </button>

              {/* Authentication Section */}
              {user && profile ? (
                <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                  <Link 
                    to={
                      profile.role === 'admin' ? '/admin' :
                      profile.role === 'chief_author' ? '/chief-author' :
                      profile.role === 'news_anchor' && profile.verified ? '/news-anchor' :
                      '/'
                    }
                    className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 bg-muted/50 rounded hover:bg-muted transition-colors"
                  >
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                    <span className="text-xs lg:text-sm font-medium text-foreground hidden lg:inline">
                      {profile.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>
                  
                  {(profile.role === 'admin' || profile.role === 'chief_author' || (profile.role === 'news_anchor' && profile.verified)) && (
                    <Link to={
                      profile.role === 'admin' ? '/admin' :
                      profile.role === 'chief_author' ? '/chief-author' :
                      '/news-anchor'
                    }>
                      <Button variant="outline" size="sm" className="text-[10px] lg:text-xs px-2 lg:px-3">
                        <span className="hidden lg:inline">Dashboard</span>
                        <span className="lg:hidden">•••</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-1 text-[10px] lg:text-xs px-1 lg:px-2"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center">
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-[10px] lg:text-xs px-2 lg:px-3">
                      <User className="w-3 h-3" />
                      <span className="hidden lg:inline">Sign In</span>
                      <span className="lg:hidden">•</span>
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-1.5 md:p-2 hover:bg-muted rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-muted/20">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 px-2 hover:bg-muted/50 rounded text-sm uppercase tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Section */}
                <div className="border-t pt-4 mt-4">
                  {user && profile ? (
                    <div className="space-y-2">
                      <Link 
                        to={
                          profile.role === 'admin' ? '/admin' :
                          profile.role === 'chief_author' ? '/chief-author' :
                          profile.role === 'news_anchor' && profile.verified ? '/news-anchor' :
                          '/'
                        }
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {profile.full_name?.split(' ')[0] || 'User'}
                        </span>
                      </Link>
                      
                      {(profile.role === 'admin' || profile.role === 'chief_author' || (profile.role === 'news_anchor' && profile.verified)) && (
                        <Link 
                          to={
                            profile.role === 'admin' ? '/admin' :
                            profile.role === 'chief_author' ? '/chief-author' :
                            '/news-anchor'
                          } 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs">Dashboard</Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-1 text-xs"
                      >
                        <LogOut className="w-3 h-3" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1 text-xs">
                        <User className="w-3 h-3" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
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
