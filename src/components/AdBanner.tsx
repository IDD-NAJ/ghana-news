import { useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  placement?: 'top' | 'bottom' | 'middle';
  currentPage?: string;
  category?: string;
}

export const AdBanner = ({ placement, currentPage, category }: AdBannerProps) => {
  const { advertisements, loading, trackAdInteraction } = useAdvertisements(
    'banner',
    placement,
    currentPage,
    category
  );

  // Track views when component mounts
  useEffect(() => {
    advertisements.forEach(ad => {
      trackAdInteraction(ad.id, 'view');
    });
  }, [advertisements, trackAdInteraction]);

  if (loading || advertisements.length === 0) {
    return null;
  }

  // Show the highest priority ad
  const ad = advertisements[0];

  const handleClick = () => {
    trackAdInteraction(ad.id, 'click');
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              Advertisement
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="h-16 w-24 object-cover rounded-md"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg mb-1">
                {ad.title}
              </h3>
              {ad.description && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {ad.description}
                </p>
              )}
            </div>
            
            {ad.link_url && (
              <button
                onClick={handleClick}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <span>{ad.link_text}</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};