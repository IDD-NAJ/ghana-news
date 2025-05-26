import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-slate-600 pl-4">
            Privacy Policy
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <div className="text-sm text-gray-600 mb-6">
              <p>Last Updated: January 2025</p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                +233BLOG-NEWS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">Personal Information</h3>
                  <p className="text-gray-700">
                    We may collect personal information such as your name, email address, and contact details 
                    when you subscribe to our newsletter, contact us, or interact with our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">Usage Information</h3>
                  <p className="text-gray-700">
                    We collect information about how you access and use our website, including your IP address, 
                    browser type, pages visited, and the time and date of your visits.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">Cookies and Tracking</h3>
                  <p className="text-gray-700">
                    We use cookies and similar tracking technologies to enhance your experience on our website 
                    and to analyze website traffic and usage patterns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and maintain our news services</li>
                <li>To send you newsletters and updates (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website and services</li>
                <li>To analyze usage patterns and website performance</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without 
                your consent, except as described in this policy. We may share information with trusted partners 
                who assist us in operating our website and providing our services, provided they agree to keep 
                this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@233blognews.com<br />
                  <strong>Address:</strong> Digital Media House, Accra, Ghana
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
