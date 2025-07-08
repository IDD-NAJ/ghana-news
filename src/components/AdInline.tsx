import { useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink } from 'lucide-react';

interface AdInlineProps {
  currentPage?: string;
  category?: string;
}

export const AdInline = ({ currentPage, category }: AdInlineProps) => {
  const { advertisements, loading, trackAdInteraction } = useAdvertisements(
    'inline',
    undefined,
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
    <div className="my-8 p-4 bg-muted/50 border border-border rounded-lg">
      <div className="text-center">
        <div className="text-xs font-medium text-muted-foreground mb-3">
          Advertisement
        </div>
        
        <div className="flex flex-col items-center gap-4">
          {ad.image_url && (
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="max-w-full h-32 object-contain rounded-md"
            />
          )}
          
          <div className="text-center">
            <h3 className="font-semibold text-foreground text-lg mb-2">
              {ad.title}
            </h3>
            {ad.description && (
              <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                {ad.description}
              </p>
            )}
            
            {ad.link_url && (
              <button
                onClick={handleClick}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
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