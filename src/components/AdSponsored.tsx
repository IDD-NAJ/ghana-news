import { useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdSponsoredProps {
  currentPage?: string;
  category?: string;
  maxAds?: number;
}

export const AdSponsored = ({ currentPage, category, maxAds = 2 }: AdSponsoredProps) => {
  const { advertisements, loading, trackAdInteraction } = useAdvertisements(
    'sponsored',
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

  const adsToShow = advertisements.slice(0, maxAds);

  const handleClick = (ad: any) => {
    trackAdInteraction(ad.id, 'click');
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Sponsored Content</h2>
        <Badge variant="secondary" className="text-xs">
          Advertisement
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {adsToShow.map((ad) => (
          <Card key={ad.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleClick(ad)}>
            <CardHeader className="pb-3">
              {ad.image_url && (
                <div className="aspect-video w-full mb-3">
                  <img 
                    src={ad.image_url} 
                    alt={ad.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
              <CardTitle className="text-lg line-clamp-2">
                {ad.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {ad.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {ad.description}
                </p>
              )}
              
              {ad.link_url && (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>{ad.link_text}</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};