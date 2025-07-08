import { useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdSidebarProps {
  placement?: 'left' | 'right';
  currentPage?: string;
  category?: string;
  maxAds?: number;
}

export const AdSidebar = ({ placement, currentPage, category, maxAds = 3 }: AdSidebarProps) => {
  const { advertisements, loading, trackAdInteraction } = useAdvertisements(
    'sidebar',
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

  const adsToShow = advertisements.slice(0, maxAds);

  const handleClick = (ad: any) => {
    trackAdInteraction(ad.id, 'click');
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium text-muted-foreground text-center">
        Sponsored
      </div>
      
      {adsToShow.map((ad) => (
        <Card key={ad.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            {ad.image_url && (
              <div className="aspect-video w-full">
                <img 
                  src={ad.image_url} 
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                {ad.title}
              </h3>
              
              {ad.description && (
                <p className="text-muted-foreground text-xs mb-3 line-clamp-3">
                  {ad.description}
                </p>
              )}
              
              {ad.link_url && (
                <button
                  onClick={() => handleClick(ad)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-xs hover:bg-primary/90 transition-colors"
                >
                  <span>{ad.link_text}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};