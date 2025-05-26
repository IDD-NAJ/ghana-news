
import React, { useEffect, useState, useRef } from 'react';
import { Eye, Users, FileText, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const [counters, setCounters] = useState({
    articles: 0,
    readers: 0,
    views: 0,
    countries: 0,
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const finalValues = {
    articles: 2547,
    readers: 150000,
    views: 2500000,
    countries: 45,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        articles: Math.floor(finalValues.articles * progress),
        readers: Math.floor(finalValues.readers * progress),
        views: Math.floor(finalValues.views * progress),
        countries: Math.floor(finalValues.countries * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  const stats = [
    {
      icon: FileText,
      value: counters.articles,
      label: 'Articles Published',
      color: 'from-ghana-red to-red-500',
      delay: '0s',
    },
    {
      icon: Users,
      value: counters.readers,
      label: 'Monthly Readers',
      color: 'from-ghana-gold to-yellow-500',
      delay: '0.2s',
      format: true,
    },
    {
      icon: Eye,
      value: counters.views,
      label: 'Total Views',
      color: 'from-ghana-green to-green-500',
      delay: '0.4s',
      format: true,
    },
    {
      icon: TrendingUp,
      value: counters.countries,
      label: 'Countries Reached',
      color: 'from-blue-500 to-purple-500',
      delay: '0.6s',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-ghana-red/5 via-ghana-gold/5 to-ghana-green/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-ghana-gold via-white to-ghana-gold bg-clip-text text-transparent">
              Our Impact
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Trusted by readers across Ghana and beyond, delivering quality journalism every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group perspective-1000 animate-fade-in-up"
              style={{ animationDelay: stat.delay }}
            >
              <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:scale-105">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 scale-95 group-hover:scale-110`}></div>
                
                {/* Card */}
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.format ? formatNumber(stat.value) : stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-300 font-medium text-lg">
                      {stat.label}
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
