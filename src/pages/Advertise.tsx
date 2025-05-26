
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdvertisingInquiryForm from '../components/AdvertisingInquiryForm';
import { Target, Users, TrendingUp, Mail } from 'lucide-react';

const Advertise = () => {
  const packages = [
    {
      name: "Banner Ads",
      description: "High-visibility banner placements on our homepage and category pages",
      features: ["Prime positioning", "Responsive design", "Analytics tracking", "30-day minimum"],
      price: "Contact for pricing"
    },
    {
      name: "Sponsored Content",
      description: "Native advertising that blends seamlessly with our editorial content",
      features: ["Editorial oversight", "Social media promotion", "SEO optimization", "Performance metrics"],
      price: "Contact for pricing"
    },
    {
      name: "Newsletter Sponsorship",
      description: "Reach our engaged subscriber base through newsletter placements",
      features: ["Weekly newsletter", "Targeted audience", "Click tracking", "Brand recognition"],
      price: "Contact for pricing"
    }
  ];

  const stats = [
    { icon: Users, label: "Monthly Visitors", value: "500K+" },
    { icon: Target, label: "Engagement Rate", value: "75%" },
    { icon: TrendingUp, label: "Page Views", value: "2M+" }
  ];

  const scrollToForm = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:advertising@233blognews.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-ghana-red pl-4">
            Advertise With Us
          </h1>
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-ghana-red to-ghana-gold text-white rounded-lg p-8 mb-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Reach Ghana's Most Engaged News Audience</h2>
              <p className="text-xl mb-6">
                Connect with our highly engaged readership and grow your business with targeted advertising 
                solutions on Ghana's leading digital news platform.
              </p>
              <button 
                onClick={scrollToForm}
                className="bg-white text-ghana-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started Today
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
                <stat.icon className="w-12 h-12 text-ghana-gold mx-auto mb-4" />
                <div className="text-3xl font-bold text-ghana-red mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Advertising Packages */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Advertising Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                  <h3 className="text-2xl font-semibold text-ghana-red mb-4">{pkg.name}</h3>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-ghana-green rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xl font-semibold text-ghana-gold mb-4">{pkg.price}</div>
                  <button 
                    onClick={scrollToForm}
                    className="w-full bg-ghana-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Why Advertise With +233BLOG-NEWS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-ghana-red mb-4">Targeted Audience</h3>
                <p className="text-gray-700 leading-relaxed">
                  Reach educated, affluent Ghanaians who are actively engaged with current events and 
                  seeking quality products and services. Our audience consists of decision-makers and 
                  influencers across various sectors.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-ghana-red mb-4">Premium Content Environment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your brand will be associated with high-quality journalism and trusted news content. 
                  Our editorial standards ensure your advertisements appear in a professional, credible environment.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-ghana-red mb-4">Multi-Platform Reach</h3>
                <p className="text-gray-700 leading-relaxed">
                  Extend your reach across our website, mobile app, newsletters, and social media channels. 
                  Our integrated approach ensures maximum visibility for your brand message.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-ghana-red mb-4">Detailed Analytics</h3>
                <p className="text-gray-700 leading-relaxed">
                  Track your campaign performance with comprehensive analytics and reporting. Monitor 
                  impressions, clicks, engagement rates, and ROI to optimize your advertising investment.
                </p>
              </div>
            </div>
          </section>

          {/* Inquiry Form */}
          <section id="inquiry-form" className="mb-12">
            <AdvertisingInquiryForm />
          </section>

          {/* Contact CTA */}
          <div className="bg-ghana-green bg-opacity-10 rounded-lg p-8 text-center">
            <Mail className="w-16 h-16 text-ghana-green mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Contact our advertising team to discuss your marketing goals and create a customized 
              advertising solution that delivers results for your business.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleContactClick}
                className="text-lg font-semibold text-ghana-green hover:text-green-700 transition-colors duration-200 underline"
              >
                advertising@233blognews.com
              </button>
              <p className="text-gray-600">+233 59 168 3489</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Advertise;
