import React from 'react';
import { Play, ArrowRight, TrendingUp } from 'lucide-react';
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
  category: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Breaking News That Matters',
    subtitle: 'Stay ahead with real-time updates and comprehensive coverage from Ghana and across the globe.',
    backgroundImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop',
    ctaText: 'Read Latest News',
    secondaryCtaText: 'Watch Live',
    category: 'Breaking News'
  },
  {
    id: '2',
    title: 'In-Depth Analysis & Reports',
    subtitle: 'Expert insights and detailed investigations that uncover the stories behind the headlines.',
    backgroundImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop',
    ctaText: 'Explore Analysis',
    secondaryCtaText: 'Expert Views',
    category: 'Analysis'
  },
  {
    id: '3',
    title: 'Local Stories, Global Impact',
    subtitle: 'Connecting Ghana to the world through compelling journalism and authentic storytelling.',
    backgroundImage: 'https://images.unsplash.com/photo-1586339949216-35c4842f5b4e?w=1920&h=1080&fit=crop',
    ctaText: 'Discover Stories',
    secondaryCtaText: 'Subscribe',
    category: 'Featured'
  }
];

export const HeroSlider = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <Carousel className="w-full h-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative h-full">
                {/* Background with enhanced gradient overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${slide.backgroundImage}')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-3xl text-white">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
                        {slide.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <span className="bg-gradient-to-r from-white via-white to-primary-foreground bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light leading-relaxed animate-fade-in-up max-w-2xl" style={{ animationDelay: '0.2s' }}>
                      {slide.subtitle}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      <button className="group flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <Play className="w-5 h-5" />
                        <span>{slide.secondaryCtaText}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-8 left-8 w-24 h-1 bg-gradient-to-r from-primary to-transparent opacity-80"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 w-12 h-12" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 w-12 h-12" />
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/80 transition-colors cursor-pointer"></div>
          ))}
        </div>
      </Carousel>
    </section>
  );
};