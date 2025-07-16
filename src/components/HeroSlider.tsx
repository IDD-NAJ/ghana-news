import React from 'react';
import { Link } from 'react-router-dom';

const backgroundImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop';

export const HeroSlider = () => {
  return (
    <section
      className="relative h-[40vh] md:h-[55vh] flex items-center justify-center text-center overflow-hidden"
      style={{ minHeight: '350px' }}
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(20,20,30,0.65), rgba(20,20,30,0.65)), url('${backgroundImage}')`,
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-white drop-shadow-lg">
          Stay Informed with <span className="text-primary-foreground">+233News</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
          Your trusted source for breaking news, in-depth analysis, and stories that matter in Ghana and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/politics" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold text-base shadow hover:bg-primary/90 transition-all duration-200 flex items-center justify-center">
            Explore Latest News
          </Link>
          <Link to="/newsletter" className="border-2 border-white text-white px-6 py-2 rounded-md font-semibold text-base hover:bg-white hover:text-foreground transition-all duration-200 flex items-center justify-center">
            Subscribe Newsletter
          </Link>
        </div>
      </div>
    </section>
  );
};