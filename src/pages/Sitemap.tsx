
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, Users, Briefcase } from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      title: "Main Pages",
      icon: FileText,
      links: [
        { name: "Home", path: "/" },
        { name: "Politics", path: "/politics" },
        { name: "Sports", path: "/sports" },
        { name: "Entertainment", path: "/entertainment" },
        { name: "Business", path: "/business" },
        { name: "Opinion", path: "/opinion" },
        { name: "Lifestyle", path: "/lifestyle" },
        { name: "Technology", path: "/technology" }
      ]
    },
    {
      title: "Company Information",
      icon: Users,
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Careers", path: "/careers" },
        { name: "Advertise", path: "/advertise" }
      ]
    },
    {
      title: "Legal & Resources",
      icon: Briefcase,
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "RSS Feed", path: "/rss" },
        { name: "Sitemap", path: "/sitemap" }
      ]
    }
  ];

  const externalLinks = [
    { name: "Facebook", url: "https://facebook.com/233blognews" },
    { name: "Twitter", url: "https://twitter.com/233blognews" },
    { name: "Instagram", url: "https://instagram.com/233blognews" },
    { name: "YouTube", url: "https://youtube.com/233blognews" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-ghana-red pl-4">
            Sitemap
          </h1>
          
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-ghana-red mb-4">Website Navigation</h2>
            <p className="text-gray-700 leading-relaxed">
              This sitemap provides an overview of all the pages and sections available on +233BLOG-NEWS. 
              Use this page to quickly find the content you're looking for or to explore different areas 
              of our website.
            </p>
          </div>

          {/* Site Structure */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {siteStructure.map((section, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-6">
                    <section.icon className="w-8 h-8 text-ghana-red mr-3" />
                    <h3 className="text-xl font-semibold text-ghana-red">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.path}
                          className="text-gray-700 hover:text-ghana-red transition-colors duration-200 flex items-center group"
                        >
                          <span className="w-2 h-2 bg-ghana-gold rounded-full mr-3 group-hover:bg-ghana-red transition-colors duration-200"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* News Categories */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              News Categories
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-red hover:text-white transition-colors duration-200 group">
                  <Link to="/politics" className="block">
                    <h4 className="font-semibold mb-2">Politics</h4>
                    <p className="text-sm opacity-75">Government & Policy News</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-green hover:text-white transition-colors duration-200 group">
                  <Link to="/sports" className="block">
                    <h4 className="font-semibold mb-2">Sports</h4>
                    <p className="text-sm opacity-75">Sports & Athletics</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-gold hover:text-white transition-colors duration-200 group">
                  <Link to="/entertainment" className="block">
                    <h4 className="font-semibold mb-2">Entertainment</h4>
                    <p className="text-sm opacity-75">Movies, Music & Celebrity</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-red hover:text-white transition-colors duration-200 group">
                  <Link to="/business" className="block">
                    <h4 className="font-semibold mb-2">Business</h4>
                    <p className="text-sm opacity-75">Economy & Finance</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-green hover:text-white transition-colors duration-200 group">
                  <Link to="/opinion" className="block">
                    <h4 className="font-semibold mb-2">Opinion</h4>
                    <p className="text-sm opacity-75">Editorial & Analysis</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-gold hover:text-white transition-colors duration-200 group">
                  <Link to="/lifestyle" className="block">
                    <h4 className="font-semibold mb-2">Lifestyle</h4>
                    <p className="text-sm opacity-75">Culture & Living</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-red hover:text-white transition-colors duration-200 group">
                  <Link to="/technology" className="block">
                    <h4 className="font-semibold mb-2">Technology</h4>
                    <p className="text-sm opacity-75">Tech & Innovation</p>
                  </Link>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-green hover:text-white transition-colors duration-200 group">
                  <Link to="/rss" className="block">
                    <h4 className="font-semibold mb-2">RSS Feeds</h4>
                    <p className="text-sm opacity-75">Subscribe to Updates</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Social Media Links */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Connect With Us
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-ghana-red mb-6 flex items-center">
                <ExternalLink className="w-6 h-6 mr-3" />
                Social Media Platforms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {externalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-ghana-red hover:text-white transition-colors duration-200 group"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <div className="bg-ghana-green bg-opacity-10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help Finding Something?</h2>
            <p className="text-gray-700 mb-6">
              If you can't find what you're looking for, don't hesitate to contact us. We're here to help!
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-ghana-green">info@233blognews.com</p>
              <p className="text-gray-600">+233 24 123 4567</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
