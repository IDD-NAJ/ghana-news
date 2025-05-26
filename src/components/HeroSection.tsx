
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Article } from '../hooks/useArticles';

interface HeroSectionProps {
  featuredArticle: Article | null;
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredArticle, scrollY }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-ghana-red/20 via-ghana-gold/10 to-ghana-green/20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8">
          {/* Main Headlines */}
          <div 
            className="space-y-6"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            <h1 className="text-6xl md:text-8xl font-playfair font-bold">
              <span className="bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green bg-clip-text text-transparent animate-fade-in-up">
                +233
              </span>
              <br />
              <span className="text-white animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                BLOG-NEWS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '1s' }}>
              Your premier destination for breaking news, in-depth analysis, and compelling stories from Ghana and beyond
            </p>
          </div>

          {/* Featured Article Preview */}
          {featuredArticle && (
            <div 
              className="max-w-4xl mx-auto animate-fade-in-up"
              style={{ 
                animationDelay: '1.5s',
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <div className="group perspective-1000">
                <div className="relative transform-gpu transition-all duration-1000 group-hover:rotate-y-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-ghana-red/30 to-ghana-green/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-1000 opacity-50 group-hover:opacity-75 transform scale-95 group-hover:scale-105"></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex flex-col md:flex-row">
                      {featuredArticle.image_url && (
                        <div className="md:w-1/2 relative overflow-hidden">
                          <img
                            src={featuredArticle.image_url}
                            alt={featuredArticle.title}
                            className="w-full h-64 md:h-80 object-cover transform group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-ghana-red text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                              Featured
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-4 line-clamp-3">
                          {featuredArticle.title}
                        </h2>
                        
                        {featuredArticle.excerpt && (
                          <p className="text-gray-300 mb-6 line-clamp-3">
                            {featuredArticle.excerpt}
                          </p>
                        )}
                        
                        <Link
                          to={`/story/${featuredArticle.id}/${featuredArticle.slug}`}
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-ghana-red to-ghana-green text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 self-start group"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up"
            style={{ 
              animationDelay: '2s',
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <button className="group relative overflow-hidden bg-gradient-to-r from-ghana-red to-ghana-green text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300">
              <span className="relative z-10">Explore All Stories</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            <button className="group flex items-center space-x-3 text-white hover:text-ghana-gold transition-colors duration-300">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="font-semibold">Watch News Updates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
