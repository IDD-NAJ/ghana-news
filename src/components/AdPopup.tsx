import { useState, useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AdPopupProps {
  currentPage?: string;
  category?: string;
  delay?: number; // Delay in milliseconds before showing popup
}

export const AdPopup = ({ currentPage, category, delay = 5000 }: AdPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  
  const { advertisements, loading, trackAdInteraction } = useAdvertisements(
    'popup',
    undefined,
    currentPage,
    category
  );

  useEffect(() => {
    if (loading || advertisements.length === 0 || hasShown) {
      return;
    }

    // Check if user has seen popup today (localStorage)
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('ad-popup-last-shown');
    
    if (lastShown === today) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
      localStorage.setItem('ad-popup-last-shown', today);
      
      // Track view
      advertisements.forEach(ad => {
        trackAdInteraction(ad.id, 'view');
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [advertisements, loading, delay, hasShown, trackAdInteraction]);

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
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-medium text-muted-foreground">
              Advertisement
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {ad.image_url && (
            <div className="w-full">
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-foreground text-xl">
              {ad.title}
            </h3>
            
            {ad.description && (
              <p className="text-muted-foreground">
                {ad.description}
              </p>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
              
              {ad.link_url && (
                <Button
                  onClick={handleClick}
                  className="flex items-center gap-2"
                >
                  <span>{ad.link_text}</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};