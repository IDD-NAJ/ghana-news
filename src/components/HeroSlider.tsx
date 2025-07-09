import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  secondaryCtaText: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Stay Informed with +233Blog-news',
    subtitle: 'Your trusted source for breaking news, in-depth analysis, and stories that matter in Ghana and beyond.',
    backgroundImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop',
    ctaText: 'Explore Latest News',
    secondaryCtaText: 'Subscribe Newsletter'
  },
  {
    id: '2',
    title: 'Breaking News & Updates',
    subtitle: 'Get the latest headlines and developments from Ghana and around the world as they happen.',
    backgroundImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop',
    ctaText: 'Read Breaking News',
    secondaryCtaText: 'Follow Updates'
  },
  {
    id: '3',
    title: 'In-Depth Analysis',
    subtitle: 'Expert commentary and detailed coverage of the stories shaping our world today.',
    backgroundImage: 'https://images.unsplash.com/photo-1586339949216-35c4842f5b4e?w=1920&h=1080&fit=crop',
    ctaText: 'Read Analysis',
    secondaryCtaText: 'Expert Views'
  }
];

export const HeroSlider = () => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      <Carousel className="w-full h-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${slide.backgroundImage}')`
                  }}
                />
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-shadow animate-fade-in-up">
                      {slide.title.includes('+233Blog-news') ? (
                        <>
                          {slide.title.split('+233Blog-news')[0]}
                          <span className="text-primary-foreground">+233Blog-news</span>
                          {slide.title.split('+233Blog-news')[1]}
                        </>
                      ) : (
                        slide.title
                      )}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <button className="elegant-card px-8 py-3 rounded-lg font-semibold hover:glow-effect transition-all duration-300 text-foreground hover:scale-105">
                        {slide.ctaText}
                      </button>
                      <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-foreground transition-all duration-300">
                        {slide.secondaryCtaText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
      </Carousel>
    </section>
  );
};