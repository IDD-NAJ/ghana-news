
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Briefcase, Users, Heart, TrendingUp } from 'lucide-react';

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Political Reporter",
      department: "Editorial",
      location: "Accra, Ghana",
      type: "Full-time",
      description: "Seeking an experienced political reporter to cover national politics, parliament, and government affairs."
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Accra, Ghana",
      type: "Full-time",
      description: "Looking for a creative digital marketer to grow our online presence and engagement across social platforms."
    },
    {
      title: "Video Content Producer",
      department: "Multimedia",
      location: "Accra, Ghana",
      type: "Full-time",
      description: "Join our multimedia team to create engaging video content for our digital platforms and social media."
    },
    {
      title: "Freelance Sports Correspondent",
      department: "Sports",
      location: "Remote",
      type: "Freelance",
      description: "Cover local and international sports events, particularly football and other popular sports in Ghana."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs for all employees"
    },
    {
      icon: TrendingUp,
      title: "Professional Growth",
      description: "Continuous learning opportunities and career advancement pathways"
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Work with passionate journalists and media professionals"
    },
    {
      icon: Briefcase,
      title: "Work-Life Balance",
      description: "Flexible working arrangements and generous time-off policies"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-ghana-red pl-4">
            Join Our Team
          </h1>
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-ghana-green to-ghana-gold text-white rounded-lg p-8 mb-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Shape the Future of Ghanaian Journalism</h2>
              <p className="text-xl mb-6">
                Be part of a dynamic team that's revolutionizing digital news in Ghana. We're looking for 
                passionate individuals who want to make a difference through quality journalism and innovative storytelling.
              </p>
            </div>
          </div>

          {/* Why Work With Us */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Why Work With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
                  <benefit.icon className="w-12 h-12 text-ghana-red mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open Positions */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Current Openings
            </h2>
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-ghana-red mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="bg-ghana-gold bg-opacity-20 px-3 py-1 rounded-full">
                          {position.department}
                        </span>
                        <span className="bg-ghana-green bg-opacity-20 px-3 py-1 rounded-full">
                          {position.location}
                        </span>
                        <span className="bg-ghana-red bg-opacity-20 px-3 py-1 rounded-full">
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <button className="mt-4 md:mt-0 bg-ghana-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                      Apply Now
                    </button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{position.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Company Culture */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Our Culture
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-ghana-red mb-4">Innovation & Excellence</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We foster a culture of innovation where creative thinking is encouraged and excellence 
                    is our standard. Our team is dedicated to pushing the boundaries of digital journalism 
                    in Ghana.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-ghana-red mb-4">Diversity & Inclusion</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We believe that diverse perspectives make us stronger. We're committed to creating an 
                    inclusive environment where everyone can thrive and contribute their unique talents.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ghana-red mb-4">Professional Development</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Invest in your future with our comprehensive training programs, mentorship opportunities, 
                    and support for continued education and professional certifications.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-ghana-red mb-4">Impact & Purpose</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your work will have a direct impact on informing and empowering Ghanaian communities. 
                    Join us in our mission to promote transparency, accountability, and democratic values.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact for General Inquiries */}
          <div className="bg-ghana-green bg-opacity-10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Don't See the Right Position?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're always interested in connecting with talented individuals who share our passion for 
              journalism and digital innovation. Send us your resume and let us know how you'd like to contribute.
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-ghana-green">careers@233blognews.com</p>
              <p className="text-gray-600">HR Department | +233 24 123 4567</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
