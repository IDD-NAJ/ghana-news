import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Clock, Calendar } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface BannerItem {
  id: string;
  type: 'breaking' | 'announcement' | 'alert';
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  priority: 'high' | 'medium' | 'low';
  expiresAt?: string;
  image_url?: string; // Ensure this is present
}

// Add a type guard function above the Banner component
function hasImageUrl(banner: any): banner is { image_url: string } {
  return banner && typeof banner.image_url === 'string';
}

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date('2025-05-26'));
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);

  // Update date every minute (keeping the same fixed date)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date('2025-05-26'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch banner items from database
  useEffect(() => {
    const fetchBannerItems = async () => {
      try {
        const { data, error } = await supabase
          .from('banner_items')
          .select('*')
          .eq('active', true)
          .or('expires_at.is.null,expires_at.gt.now()')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching banner items:', error);
          return;
        }

        // Transform data to match existing interface
        const transformedItems: BannerItem[] = (data || []).map(item => ({
          id: item.id,
          type: item.type as 'breaking' | 'announcement' | 'alert',
          title: item.title,
          message: item.message,
          link: item.link || undefined,
          linkText: item.link_text || undefined,
          priority: item.priority as 'high' | 'medium' | 'low',
          expiresAt: item.expires_at || undefined,
          image_url: item.image_url || undefined // Always include image_url
        }));

        setBannerItems(transformedItems);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchBannerItems();

    // Set up real-time subscription
    const channel = supabase
      .channel('banner-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'banner_items'
        },
        () => {
          fetchBannerItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        <div className="flex items-center space-x-3 flex-1 min-w-0">
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
      {currentBanner && hasImageUrl(currentBanner) && (
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title || 'Banner image'}
          loading="lazy"
          className="w-full h-auto object-cover"
        />
      )}
    </div>
  );
};

export default Banner;
