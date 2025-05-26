
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Clock, Calendar } from 'lucide-react';

interface BannerItem {
  id: string;
  type: 'breaking' | 'announcement' | 'alert';
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  priority: 'high' | 'medium' | 'low';
  expiresAt?: string;
}

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample banner data - in a real app, this would come from an API or CMS
  const bannerItems: BannerItem[] = [
    {
      id: '1',
      type: 'breaking',
      title: 'BREAKING',
      message: 'Parliament approves 2024 budget with significant infrastructure investments',
      link: '/politics',
      linkText: 'Read More',
      priority: 'high'
    },
    {
      id: '2',
      type: 'announcement',
      title: 'NEW',
      message: 'Subscribe to our newsletter for daily news updates and exclusive content',
      link: '#newsletter',
      linkText: 'Subscribe',
      priority: 'medium'
    }
  ];

  // Auto-rotate banners every 10 seconds
  useEffect(() => {
    if (bannerItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [bannerItems.length]);

  // Check if banner was dismissed (stored in localStorage)
  useEffect(() => {
    const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    const currentBanner = bannerItems[currentBannerIndex];
    if (currentBanner && dismissedBanners.includes(currentBanner.id)) {
      // Find next non-dismissed banner or hide if all are dismissed
      const nextBanner = bannerItems.find(banner => !dismissedBanners.includes(banner.id));
      if (!nextBanner) {
        setIsVisible(false);
      }
    }
  }, [currentBannerIndex, bannerItems]);

  const handleDismiss = () => {
    const currentBanner = bannerItems[currentBannerIndex];
    if (currentBanner) {
      const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
      dismissedBanners.push(currentBanner.id);
      localStorage.setItem('dismissedBanners', JSON.stringify(dismissedBanners));
    }
    setIsVisible(false);
  };

  const handleLinkClick = () => {
    const currentBanner = bannerItems[currentBannerIndex];
    if (currentBanner?.link === '#newsletter') {
      // Scroll to newsletter subscription section
      const newsletterElement = document.querySelector('[data-newsletter]');
      if (newsletterElement) {
        newsletterElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (!isVisible || bannerItems.length === 0) return null;

  const currentBanner = bannerItems[currentBannerIndex];
  if (!currentBanner) return null;

  const getBannerStyles = (type: string, priority: string) => {
    const baseStyles = "text-white px-4 py-3 text-sm font-medium transition-all duration-500 ease-in-out";
    
    switch (type) {
      case 'breaking':
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700`;
      case 'alert':
        return `${baseStyles} bg-gradient-to-r from-orange-500 to-orange-600`;
      default:
        return `${baseStyles} bg-gradient-to-r from-ghana-red to-red-700`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breaking':
        return <Clock className="w-4 h-4 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className={getBannerStyles(currentBanner.type, currentBanner.priority)}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Date Display */}
        <div className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {formatDate(currentDate)}
          </span>
        </div>

        <div className="flex items-center space-x-3 flex-1 min-w-0 md:ml-4">
          <div className="flex items-center space-x-2">
            {getTypeIcon(currentBanner.type)}
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
              {currentBanner.title}
            </span>
          </div>
          <span className="truncate flex-1">{currentBanner.message}</span>
        </div>
        
        <div className="flex items-center space-x-3 ml-4">
          {currentBanner.link && (
            <a
              href={currentBanner.link}
              onClick={currentBanner.link === '#newsletter' ? handleLinkClick : undefined}
              className="flex items-center space-x-1 hover:underline whitespace-nowrap font-semibold"
            >
              <span>{currentBanner.linkText || 'Learn More'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          
          {/* Banner indicators */}
          {bannerItems.length > 1 && (
            <div className="flex space-x-1">
              {bannerItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBannerIndex 
                      ? 'bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Show banner ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <button
            onClick={handleDismiss}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
